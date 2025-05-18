import { Component, OnInit } from '@angular/core';
import { Orden } from '../../pedidos/pedidos.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente, Vendedor } from '../../vendedores/vendedores.model';
import { GeneracionRutasService } from './generacion-rutas.service';
import { formatDate } from '@angular/common';
import { TableCheckboxConfig } from 'src/app/shared/table-template/table-template.component';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface TableRow {
    status: string;
    date_delivery: string;
    date_order: string;
    seller: string;
    id: string;
    customer: string;
}

@Component({
  selector: 'app-generacion-rutas',
  standalone: false,
  templateUrl: './generacion-rutas.component.html',
  styleUrls: ['./generacion-rutas.component.css']
})
export class GeneracionRutasComponent implements OnInit {
  checkboxConfig: TableCheckboxConfig = {
    enabled: true,
    selectedItems: [],
    selectionChanged: (selectedItems: TableRow[]) => {
      this.ordenesSeleccionadas = selectedItems;
    }
  };

  generacionRutasForm!: FormGroup;
  selectedDate: Date | null = null;

  listaOrdenes: Orden[] = [];
  listaVendedores: Vendedor[] = [];
  listaClientes: Cliente[] = [];

  mapaRutaBase64: string | null = null;

  isRefreshing: boolean = true;
  isGeneratingRoute: boolean = false;
  isMapLoading: boolean = false;
  showMapPlaceholder: boolean = true;

  tableData: TableRow[] = [];
  ordenesSeleccionadas: TableRow[] = [];

  tableColumns = [
    {
      name: 'status',
      header: 'Estado',
      cell: (item: any) => item.status.toString()
    },
    {
      name: 'date_delivery',
      header: 'Fecha de Entrega',
      cell: (item: any) => item.date_delivery.toString()
    },
    {
      name: 'date_order',
      header: 'Fecha de Pedida',
      cell: (item: any) => item.date_order.toString()
    },
    {
      name: 'seller',
      header: 'Vendedor',
      cell: (item: any) => item.seller.toString()
    },
    {
      name: 'customer',
      header: 'Cliente',
      cell: (item: any) => item.customer.toString()
    },
    {
      name: 'id',
      header: 'ID',
      cell: (item: any) => item.id.toString()
    }
  ];

  visibleColumns = ['customer','seller','date_order','date_delivery','status'];

  constructor(
    private formBuilder: FormBuilder,
    private apiService: GeneracionRutasService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.initializeForm();
    this.cargarVendedoresClientes();

  }

  initializeForm(): void {
    this.generacionRutasForm = this.formBuilder.group({
      fieldFechaEntrega: [null, Validators.required]
    });
  }

  cargarVendedoresClientes(): void {
    this.isRefreshing = true;
    
    this.apiService.getListaVendedores().subscribe({
      next: (response) => {
        this.listaVendedores = response.sellers;
      },
      error: (error) => {
        console.error('Error loading sellers:', error);
      }
    });

    this.apiService.getClientes().subscribe({
      next: (response) => {
        this.listaClientes = response.customers;
      },
      error: (error) => {
        console.error('Error loading customers:', error);
      }
    });
  }

  onSubmit() {
    if (!this.generacionRutasForm.value.fieldFechaEntrega) {
      return;
    }

    this.selectedDate = this.generacionRutasForm.value.fieldFechaEntrega;
    this.cargarOrdenesPorFechaEntrega();
  }

  cargarOrdenesPorFechaEntrega(): void {
    if (!this.selectedDate) return;

    this.isRefreshing = true;
    
    this.apiService.getOrdenes().subscribe({
      next: (response) => {
        const selectedDateStr = formatDate(this.selectedDate!, 'yyyy-MM-dd', 'en-US');
        
        this.listaOrdenes = response.orders.filter(order => {
          const orderDateStr = order.date_delivery.split('T')[0];
          return orderDateStr === selectedDateStr && order.status === 'created';
        });

        this.prepararInfoTabla();
        this.isRefreshing = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.isRefreshing = false;
      }
    });
  }

  prepararInfoTabla() {
    this.tableData = this.listaOrdenes
      .filter(order => order.status === 'created') 
      .map(order => {
      const seller = this.listaVendedores.find(v => v.id === order.seller_id);
      const customer = this.listaClientes.find(c => c.id === order.customer_id);

      return {
        status: order.status,
        date_delivery: order.date_delivery.split('T')[0],
        date_order: order.date_order.split('T')[0],
        seller: seller ? seller.name : 'Desconocido',
        id: order.id,
        customer: customer ? customer.name : 'Desconocido'
      } as TableRow;
    });
  }

  generarRuta() {
    if (this.ordenesSeleccionadas.length === 0) {
      this.snackBar.open('Por favor seleccione al menos una orden', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const requestBody = {
      orders: this.ordenesSeleccionadas.map(order => ({
        customer_id: this.getCustomerIdDesdeOrden(order.id),
        order_id: order.id
      }))
    };

    this.isGeneratingRoute = true;
    this.isMapLoading = true;

    this.apiService.postDeliveryRoute(requestBody).subscribe({
      next: (response) => {
        this.snackBar.open('Ruta generada exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        console.log('Route generated successfully', response);

        this.tableData = this.tableData.filter(item => 
          !this.ordenesSeleccionadas.some(selected => selected.id === item.id)
        );
        
        this.listaOrdenes = this.listaOrdenes.filter(order => 
          !this.ordenesSeleccionadas.some(selected => selected.id === order.id)
        );

        this.ordenesSeleccionadas = [];

        if (response.map && response.map !== '{{image as base64}}') {
          this.mapaRutaBase64 = 'data:image/png;base64,' + response.map;
          this.showMapPlaceholder = false;
        } else {
          this.mapaRutaBase64 = null;
          this.showMapPlaceholder = true;
        }

        this.isMapLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error al generar la ruta', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        console.error('Error generating route', error);

        this.isGeneratingRoute = false;
        this.isMapLoading = false;
      }
    });
  }

  getCustomerIdDesdeOrden(orderId: string): string {
    const order = this.listaOrdenes.find(o => o.id === orderId);
    return order ? order.customer_id : '';
  }

}

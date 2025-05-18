import { Component, OnInit } from '@angular/core';
import { Orden } from '../../pedidos/pedidos.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente, Vendedor } from '../../vendedores/vendedores.model';
import { GeneracionRutasService } from './generacion-rutas.service';
import { formatDate } from '@angular/common';

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
  generacionRutasForm!: FormGroup;
  selectedDate: Date | null = null;

  listaOrdenes: Orden[] = [];
  listaVendedores: Vendedor[] = [];
  listaClientes: Cliente[] = [];

  isRefreshing: boolean = true;

  tableData: TableRow[] = [];

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
          return orderDateStr === selectedDateStr;
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
    this.tableData = this.listaOrdenes.map(order => {
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

}

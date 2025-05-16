import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GestionAlertasInventarioCriticoService } from './gestion-alertas-inventario-critico.service';
import { finalize, map, Observable, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Bodega, BodegasResponse } from '../../bodegas/bodegas.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

export interface TableRow {
  product_id: string;
  product_name: string;
  warehouse: string;
  current_quantity: number;
  threshold: number;
  alert_message: string;
  suggested_action: string;
}

@Component({
  selector: 'app-gestion-alertas-inventario-critico',
  standalone: false,
  templateUrl: './gestion-alertas-inventario-critico.component.html',
  styleUrls: ['./gestion-alertas-inventario-critico.component.css']
})
export class GestionAlertasInventarioCriticoComponent implements OnInit {
  gestionAlertasInventarioCriticoForm!: FormGroup;

  nombresProductosFiltrados!: Observable<string[]>;

  listaProductos: any[] = [];
  listaBodegas: Bodega[] = [];
  listaProductosStock: TableRow[] = [];
  listaProductosStockFiltrados: TableRow[] = [];

  isRefreshing: boolean = true;

  idProductoSeleccionado: string | null = null;

  tableData: TableRow[] = [];

  tableColumns = [
    {
      name: 'product_name',
      header: 'Producto',
      cell: (item: any) => item.product_name.toString()
    },
    {
      name: 'warehouse',
      header: 'Bodega',
      cell: (item: any) => item.warehouse.toString()
    },
    {
      name: 'current_quantity',
      header: 'Cantidad',
      cell: (item: any) => item.current_quantity.toString()
    },
    {
      name: 'alert_message',
      header: 'Alerta',
      cell: (item: any) => item.alert_message.toString()
    },
    {
      name: 'suggested_action',
      header: 'Acción Sugerida',
      cell: (item: any) => item.suggested_action.toString()
    }
  ];

  visibleColumns = ['product_name', 'warehouse', 'current_quantity', 'alert_message', 'suggested_action'];

  constructor(
    private formBuilder: FormBuilder,
    private apiService: GestionAlertasInventarioCriticoService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  initializeForms(): void{
    this.gestionAlertasInventarioCriticoForm = this.formBuilder.group({
      fieldProducto: ['', Validators.required],
      fieldBodega: ['', Validators.required],
    })
  }

  autoCompletar(): void {
    this.nombresProductosFiltrados = this.gestionAlertasInventarioCriticoForm.get('fieldProducto')!.valueChanges.pipe(
          startWith(''),
          map(value => this._filtrarNombresProductos(value || ''))
        )
  }

  _filtrarNombresProductos(value: string): string[] {
    const valorFiltro = value.toLowerCase();
    return this.listaProductos
      .filter(producto => 
        producto.name.toLowerCase().includes(valorFiltro) ||
        producto.name.toLowerCase().indexOf(valorFiltro) === 0
      )
      .map(producto => producto.name);
  }

  conProductoSeleccionado(event: MatAutocompleteSelectedEvent): void {
    const value = event.option?.value;
    let productName: string;
    
    if (typeof value === 'string') {
      productName = value;
    } else if (value?.name) {
      productName = value.name;
    } else {
      this.idProductoSeleccionado = null;
      this.gestionAlertasInventarioCriticoForm.get('fieldProducto')?.setValue('');
      return;
    }

    const producto = this.listaProductos.find(p => p.name === productName);
    if (producto) {
      this.idProductoSeleccionado = producto.id;

      const control = this.gestionAlertasInventarioCriticoForm.get('fieldProducto');
      if (control) {
        control.setValue(producto.name);
      }
    } else {
      console.log('Product not found!');
    }
  }

  cargarProductos(callback?: () => void): void{
    this.isRefreshing = true;

    this.apiService.getListaProductosStock().pipe(
      finalize(() => {
        this.isRefreshing = false;
        if (callback) callback();
      })
    ).subscribe({
        next: (productos) => {
          this.listaProductos = productos.products;
          this.gestionAlertasInventarioCriticoForm.get('fieldProducto')?.setValue('', {emitEvent: true})
        },
        error: (err) => {
          console.error('Failed to load products', err);
        }
    })
  }

  cargarFabricantes(): void {
    this.apiService.getListaBodegas().subscribe({
      next: (response: BodegasResponse) => {
        this.listaBodegas = response.Warehouses;
      },
      error: (err) => {
        console.error('Error loading warehouses:', err);
      }
    });
  }

  ngOnInit() {
    this.initializeForms();
    this.cargarFabricantes();
    this.cargarProductos(() => {
      this.autoCompletar();
      this.cargarResultadosIniciales();
    });

    this.route.queryParams.subscribe(params => {
      if (params['product_id'] || params['warehouse_id']) {
        this.aplicarQueryParams(params['product_id'], params['warehouse_id']);
      } else {
        this.cargarResultadosIniciales();
      }
    });

  }

  cargarResultadosIniciales() {
    const productId = this.route.snapshot.queryParams['product_id'];
    const warehouseId = this.route.snapshot.queryParams['warehouse_id'];
    
    if (productId || warehouseId) {
      this.aplicarQueryParams(productId, warehouseId);
    } else {
      this.cargarProductosCriticos();
    }
  }

  aplicarQueryParams(productId: string | null, warehouseId: string | null) {
    if (productId) {
      const product = this.listaProductos.find(p => p.id === productId);
      if (product) {
        this.gestionAlertasInventarioCriticoForm.get('fieldProducto')?.setValue(product.name);
        this.idProductoSeleccionado = productId;
      }
    }
    
    if (warehouseId) {
      this.gestionAlertasInventarioCriticoForm.get('fieldBodega')?.setValue(warehouseId);
    }
    
    this.onSubmit();
  }

  cargarProductosCriticos() {
    this.isRefreshing = true;
    this.apiService.getProductosNivelCritico().pipe(
      finalize(() => this.isRefreshing = false)
    ).subscribe({
      next: (response) => {
        this.listaProductosStock = response.critical_products || [];
        this.listaProductosStockFiltrados = [...this.listaProductosStock];
        this.tableData = this.listaProductosStockFiltrados;
        this.mostrarSnackBar(response.message);
      },
      error: (err) => {
        console.error('Error loading critical products:', err);
        this.mostrarSnackBar('Error al cargar productos críticos');
      }
    });
  }

  mostrarSnackBar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
    });
  }

  onSubmit() {
    const productName = this.gestionAlertasInventarioCriticoForm.get('fieldProducto')?.value;
    const warehouseId = this.gestionAlertasInventarioCriticoForm.get('fieldBodega')?.value;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        product_id: this.idProductoSeleccionado || null,
        warehouse_id: warehouseId || null
      },
      queryParamsHandling: 'merge'
    });

    this.listaProductosStockFiltrados = this.listaProductosStock.filter(product => {
      const matchesProduct = !productName || product.product_name === productName;
      
      let matchesWarehouse = true;
      if (warehouseId) {
        const selectedWarehouse = this.listaBodegas.find(b => b.id === warehouseId);
        matchesWarehouse = selectedWarehouse ? product.warehouse === selectedWarehouse.name : false;
      }
      
      return matchesProduct && matchesWarehouse;
    });

    this.tableData = this.listaProductosStockFiltrados;
    
    if (this.listaProductosStockFiltrados.length > 0) {
      this.mostrarSnackBar(`Mostrando ${this.listaProductosStockFiltrados.length} productos críticos`);
    } else {
      this.mostrarSnackBar('No se encontraron productos críticos con los filtros seleccionados');
    }
  }

  clearAll(): void {
    this.gestionAlertasInventarioCriticoForm.reset();
    this.idProductoSeleccionado = null;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
    });
    this.listaProductosStockFiltrados = [...this.listaProductosStock];
    this.tableData = this.listaProductosStockFiltrados;
    this.mostrarSnackBar('Filtros limpiados');
  }
}

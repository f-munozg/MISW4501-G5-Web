import { Component, OnInit } from '@angular/core';
import { MovementType2LabelMapping, TipoMovimiento } from '../inventario.model';
import { Bodega, BodegasResponse } from '../../bodegas/bodegas.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from '../../productos/producto.model';
import { RegistroMovimientoInventarioService } from './registro-movimiento-inventario.service';
import { Router } from '@angular/router';
import { finalize, map, Observable, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

export interface TableRow{
  product_id: string,
  warehouse_id: string,
  quantity: number,
  user: string,
  movement_type: string,
  timestamp: string,
  alert_message: string,
}

@Component({
  selector: 'app-registro-movimiento-inventario',
  standalone: false,
  templateUrl: './registro-movimiento-inventario.component.html',
  styleUrls: ['./registro-movimiento-inventario.component.css']
})
export class RegistroMovimientoInventarioComponent implements OnInit {
  registroMovimientoInventarioForm!: FormGroup;

  listaUsuarios: any[] = [];
  listaProductos: any[] = [];
  listaBodegas: Bodega[] = [];

  productosFiltrados!: Observable<Producto[]>;

  isRefreshing: boolean = true;

  idProductoSeleccionado: string | null = null;

  public MovementType2LabelMapping = MovementType2LabelMapping;
  public tiposMovimiento = Object.values(TipoMovimiento);

  tableData: TableRow[] = [];

  tableColumns = [
    {
      name: 'timestamp', 
      header: 'Fecha', 
      cell: (item: any) => item.timestamp.toString() 
    },
    {
      name: 'product_id', 
      header: 'Producto', 
      cell: (item: any) => item.product_id.toString() 
    },
    {
      name: 'warehouse_id', 
      header: 'Bodega', 
      cell: (item: any) => item.warehouse_id.toString() 
    },
    {
      name: 'movement_type', 
      header: 'Movimiento', 
      cell: (item: any) => item.movement_type.toString() 
    },
    {
      name: 'number', 
      header: 'Cantidad', 
      cell: (item: any) => item.number.toString() 
    },
    {
      name: 'user', 
      header: 'Responsable', 
      cell: (item: any) => item.user.toString() 
    }
  ];

  visibleColumns = ['timestamp','product_id','warehouse_id','movement_type','number','user'];

  constructor(
    private formBuilder: FormBuilder,
    private apiService: RegistroMovimientoInventarioService,
    private router: Router,
  ) { }

  initializeForms(): void {
    this.registroMovimientoInventarioForm = this.formBuilder.group({
      fieldProducto: ['', Validators.required],
      fieldBodega: ['', Validators.required],
      fieldCantidad: ['', [Validators.required, Validators.min(1)]],
      fieldTipoMovimiento: ['', Validators.required],
      fieldResponsable: ['', Validators.required],
    });
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

  autoCompletar(): void {
    this.productosFiltrados = this.registroMovimientoInventarioForm.get('fieldProducto')!.valueChanges.pipe(
          startWith(''),
          map(value => this._filtrarNombresProductos(value))
        )
  }

  _filtrarNombresProductos(value: string): Producto[] {
    if (!this.listaProductos) return [];

    const valorFiltro = value?.toString() || '';
    return this.listaProductos
      .filter(producto => producto.name.toString().includes(valorFiltro))
  }

  conProductoSeleccionado(event: MatAutocompleteSelectedEvent): void {
    const producto = event.option?.value as Producto | undefined;
    if (!producto) {
      this.idProductoSeleccionado = null;
      this.registroMovimientoInventarioForm.get('fieldProducto')?.setValue('');
      return;
    }
    
    this.idProductoSeleccionado = producto.id;
    this.registroMovimientoInventarioForm.get('fieldProducto')?.setValue(producto.name);
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
          this.registroMovimientoInventarioForm.get('fieldProducto')?.setValue('', {emitEvent: true})
        },
        error: (err) => {
          console.error('Failed to load products', err);
        }
    })
  }

  ngOnInit() {
    this.initializeForms();
    this.cargarFabricantes();
    this.cargarProductos(() => {
      this.autoCompletar();
    });
  }

  onSubmit() {
    
  }

  clearAll() {
    this.registroMovimientoInventarioForm.reset();
    this.registroMovimientoInventarioForm.markAsPristine();
    this.registroMovimientoInventarioForm.markAsUntouched();
    this.registroMovimientoInventarioForm.setErrors(null);
  }
}

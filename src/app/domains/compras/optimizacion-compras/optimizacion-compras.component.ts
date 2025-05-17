import { Component, OnInit } from '@angular/core';
import { Bodega, BodegasResponse } from '../../bodegas/bodegas.model';
import { finalize, map, Observable, startWith } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OptimizacionComprasService } from './optimizacion-compras.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

export interface TableRow{
  product_name: string,
  suggested_qtty: number,
  motive: string,
}

@Component({
  selector: 'app-optimizacion-compras',
  standalone: false,
  templateUrl: './optimizacion-compras.component.html',
  styleUrls: ['./optimizacion-compras.component.css']
})

export class OptimizacionComprasComponent implements OnInit {
  optimizacionComprasForm!: FormGroup;

  listaProductos: any[] = [];
  listaBodegas: Bodega[] = [];

  nombresProductosFiltrados!: Observable<string[]>;

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
      name: 'suggested_qtty', 
      header: 'Cantidad Sugerida', 
      cell: (item: any) => item.suggested_qtty.toString() 
    },
    {
      name: 'motive', 
      header: 'Razón', 
      cell: (item: any) => item.motive.toString() 
    },
  ];

  visibleColumns = ['product_name','suggested_qtty','motive'];

  constructor(
    private formBuilder: FormBuilder,
    private apiService: OptimizacionComprasService,
  ) { }

  initializeForm(): void {
    this.optimizacionComprasForm = this.formBuilder.group({
      fieldProducto: [''],
      fieldBodega: [''],
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

  autoCompletar(): void {
    this.nombresProductosFiltrados = this.optimizacionComprasForm.get('fieldProducto')!.valueChanges.pipe(
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
      this.optimizacionComprasForm.get('fieldProducto')?.setValue('');
      return;
    }

    const producto = this.listaProductos.find(p => p.name === productName);
    if (producto) {
      this.idProductoSeleccionado = producto.id;

      const control = this.optimizacionComprasForm.get('fieldProducto');
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
          this.optimizacionComprasForm.get('fieldProducto')?.setValue('', {emitEvent: true})
        },
        error: (err) => {
          console.error('Failed to load products', err);
        }
    })
  }

  ngOnInit() {
    this.initializeForm();
    this.cargarFabricantes();
    this.cargarProductos(() => {
      this.autoCompletar();
    });
  }

  onSubmit() {

  }

  clearAll(): void {

  }
}

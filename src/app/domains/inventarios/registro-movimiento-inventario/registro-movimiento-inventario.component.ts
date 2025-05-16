import { Component, OnInit } from '@angular/core';
import { MovementType2LabelMapping, RegistroMovimiento, TipoMovimiento } from '../inventario.model';
import { Bodega, BodegasResponse } from '../../bodegas/bodegas.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from '../../productos/producto.model';
import { RegistroMovimientoInventarioService } from './registro-movimiento-inventario.service';
import { Router } from '@angular/router';
import { finalize, map, Observable, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface TableRow{
  fecha: string,
  nombre_producto: string,
  nombre_bodega: string,
  tipo_movimiento: string,
  cantidad: number,
  usuario: string
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

  nombresProductosFiltrados!: Observable<string[]>;

  isRefreshing: boolean = true;
  isSubmitting: boolean = false;
  mostrarCamposAdicionales: boolean = false;

  idProductoSeleccionado: string | null = null;

  public MovementType2LabelMapping = MovementType2LabelMapping;
  public tiposMovimiento = Object.values(TipoMovimiento);

  tableData: TableRow[] = [];

  tableColumns = [
    {
      name: 'fecha', 
      header: 'Fecha', 
      cell: (item: any) => item.fecha.toString() 
    },
    {
      name: 'nombre_producto', 
      header: 'Producto', 
      cell: (item: any) => item.nombre_producto.toString() 
    },
    {
      name: 'nombre_bodega', 
      header: 'Bodega', 
      cell: (item: any) => item.nombre_bodega.toString() 
    },
    {
      name: 'tipo_movimiento', 
      header: 'Movimiento', 
      cell: (item: any) => item.tipo_movimiento.toString() 
    },
    {
      name: 'cantidad', 
      header: 'Cantidad', 
      cell: (item: any) => item.cantidad.toString() 
    },
    {
      name: 'usuario', 
      header: 'Responsable', 
      cell: (item: any) => item.usuario.toString() 
    }
  ];

  visibleColumns = ['fecha','nombre_producto','nombre_bodega','tipo_movimiento','cantidad','usuario'];

  constructor(
    private formBuilder: FormBuilder,
    private apiService: RegistroMovimientoInventarioService,
    private snackBar: MatSnackBar
  ) { }

  initializeForms(): void {
    this.registroMovimientoInventarioForm = this.formBuilder.group({
      fieldProducto: ['', Validators.required],
      fieldBodega: ['', Validators.required],
      fieldCantidad: ['', [Validators.required, Validators.min(1)]],
      fieldTipoMovimiento: ['', Validators.required],
      // Campos adicionales
      fieldLimiteStock: [null, Validators.min(0)],
      fieldNivelCritico: [null, Validators.min(0)],
      fieldUbicacion: [''],
      fieldFechaVencimiento: [null]
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
    this.nombresProductosFiltrados = this.registroMovimientoInventarioForm.get('fieldProducto')!.valueChanges.pipe(
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
      this.registroMovimientoInventarioForm.get('fieldProducto')?.setValue('');
      return;
    }

    const producto = this.listaProductos.find(p => p.name === productName);
    if (producto) {
      this.idProductoSeleccionado = producto.id;

      const control = this.registroMovimientoInventarioForm.get('fieldProducto');
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
          this.registroMovimientoInventarioForm.get('fieldProducto')?.setValue('', {emitEvent: true})
        },
        error: (err) => {
          console.error('Failed to load products', err);
        }
    })
  }

  cargarListaMovimientos(): void {
    this.isRefreshing = true;
    
    this.apiService.getListaMovimientos().pipe(
      finalize(() => this.isRefreshing = false)
    ).subscribe({
      next: (movimientos) => {
        this.tableData = movimientos.movimientos;
      },
      error: (err) => {
        console.error('Error loading movements:', err);
        this.snackBar.open('Error al cargar los movimientos', 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  ngOnInit() {
    this.initializeForms();
    this.cargarFabricantes();
    this.cargarListaMovimientos();
    this.cargarProductos(() => {
      this.autoCompletar();
    });
  }

  activarCamposAdicionales(): void {
    this.mostrarCamposAdicionales = !this.mostrarCamposAdicionales;
  
    if(!this.registroMovimientoInventarioForm) {
      return;
    }

    if (this.mostrarCamposAdicionales) {
      this.registroMovimientoInventarioForm.get('fieldLimiteStock')?.enable();
      this.registroMovimientoInventarioForm.get('fieldNivelCritico')?.enable();
      this.registroMovimientoInventarioForm.get('fieldUbicacion')?.enable();
      this.registroMovimientoInventarioForm.get('fieldFechaVencimiento')?.enable();
    } else {
      this.registroMovimientoInventarioForm.get('fieldLimiteStock')?.disable();
      this.registroMovimientoInventarioForm.get('fieldNivelCritico')?.disable();
      this.registroMovimientoInventarioForm.get('fieldUbicacion')?.disable();
      this.registroMovimientoInventarioForm.get('fieldFechaVencimiento')?.disable();
    }
  }

  onSubmit() {
    if (this.registroMovimientoInventarioForm.invalid || this.isSubmitting) {
      this.registroMovimientoInventarioForm.markAllAsTouched();
      this.snackBar.open('Por favor complete todos los campos requeridos', 'Cerrar', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.isSubmitting = true;

    const formData = this.registroMovimientoInventarioForm.value;
    
    const productoSeleccionado = this.listaProductos.find(
      product => product.name === formData.fieldProducto
    );

    if (!productoSeleccionado) {
      console.error('No product selected or product not found');
      return;
    }

    let fechaVencimientoAjustada = null;
    if (formData.fieldFechaVencimiento) {
      const date = new Date(formData.fieldFechaVencimiento);
      fechaVencimientoAjustada = date.toISOString().split('.')[0];
    }

    const requestData = {
      ...formData,
      idProducto: productoSeleccionado.id,
      // Se incluyen campos adicionales si existen
      threshold_stock: formData.fieldLimiteStock,
      critical_level: formData.fieldNivelCritico,
      location: formData.fieldUbicacion,
      expiration_date: fechaVencimientoAjustada
    };

    this.apiService.postData(requestData).pipe(
      finalize(() => this.isSubmitting = false)
      ).subscribe({
        next: (response) => {
          console.log('Movement recorded successfully', response);
          this.snackBar.open('Movimiento registrado exitosamente', 'Cerrar', {
            duration: 5000,
            panelClass: ['success-snackbar']
          });
          this.clearAll();
          this.cargarListaMovimientos();
        },
        error: (err) => {
          console.error('Error recording movement', err);
          this.snackBar.open('Error al registrar el movimiento', 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  clearAll() {
    this.registroMovimientoInventarioForm.reset({
      fieldProducto: null,
      fieldBodega: null,
      fieldCantidad: null,
      fieldTipoMovimiento: null,
      fieldLimiteStock: null,
      fieldNivelCritico: null,
      fieldUbicacion: null,
      fieldFechaVencimiento: null
    });

    if (!this.mostrarCamposAdicionales) {
      this.registroMovimientoInventarioForm.get('fieldLimiteStock')?.disable();
      this.registroMovimientoInventarioForm.get('fieldNivelCritico')?.disable();
      this.registroMovimientoInventarioForm.get('fieldUbicacion')?.disable();
      this.registroMovimientoInventarioForm.get('fieldFechaVencimiento')?.disable();
    }

    this.registroMovimientoInventarioForm.markAsPristine();
    this.registroMovimientoInventarioForm.markAsUntouched();
    this.registroMovimientoInventarioForm.setErrors(null);
    this.mostrarCamposAdicionales = false;
  }
}

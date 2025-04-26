import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Vendedor } from '../../vendedores/vendedores.model';
import { finalize, map, Observable, startWith } from 'rxjs';
import { PeriodoPlanVentas, PeriodoType2LabelMapping, Producto } from '../ventas.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanesDeVentaService } from './planes-de-venta.service';


@Component({
  selector: 'app-planes-de-venta',
  standalone: false,
  templateUrl: './planes-de-venta.component.html',
  styleUrls: ['./planes-de-venta.component.css']
})
export class PlanesDeVentaComponent implements OnInit {
  definicionPlanDeVentasForm!: FormGroup;

  listaVendedores: Vendedor[] = [];
  listaProductos: Producto[] = [];

  vendedoresFiltrados!: Observable<number[]>;
  productosFiltrados!: Observable<string[]>;

  isSubmitting: boolean = true;
  isRefreshing: boolean = true;

  idVendedorSeleccionado: string | null = null;
  idProductoSeleccionado: string | null = null;

  public PeriodoType2LabelMapping = PeriodoType2LabelMapping;
  public periodoTypes = Object.values(PeriodoPlanVentas);

  constructor(
    private formBuilder: FormBuilder,
    private apiService: PlanesDeVentaService,
  ) { }

  ngOnInit() {
    this.initializeForm();
    this.autoCompletarVendedor();
    this.autoCompletarProductos();

    this.cargarVendedores();
    this.cargarProductos();
  }

  onSubmit() {
    if (this.definicionPlanDeVentasForm.invalid) {
      this.definicionPlanDeVentasForm.markAllAsTouched();
      return;
    }

    this.crearPlanDeVentas();
  }

  initializeForm(): void {
    this.definicionPlanDeVentasForm = this.formBuilder.group({
      fieldVendedor: ['', Validators.required],
      fieldMeta: ['', Validators.required],
      fieldProducto: ['', Validators.required],
      fieldPeriodo: ['', Validators.required]
    });
  }

  autoCompletarVendedor(): void{
    this.vendedoresFiltrados = this.definicionPlanDeVentasForm.get('fieldVendedor')!.valueChanges.pipe(
          startWith(''),
          map(value => this._filtrarNumerosIdentificacion(value))
        )
  }

  _filtrarNumerosIdentificacion(value: string): number[] {
    const valorFiltro = value?.toString().toLowerCase() || '';
    return this.listaVendedores
      .filter(vendedor => vendedor.identification_number.toString().includes(valorFiltro))
      .map(vendedor => vendedor.identification_number)
  }

  cargarVendedores(callback?: () => void): void{
    this.isRefreshing = true;

    this.apiService.getListaVendedores().pipe(
      finalize(() => {
        this.isRefreshing = false;
        if (callback) callback();
      })
    ).subscribe({
      next: (vendedores) => {
        this.listaVendedores = vendedores.sellers;
        this.definicionPlanDeVentasForm.get('fieldVendedor')?.setValue('', {emitEvent: true})
      },
      error: (err) => {
        console.error('Failed to load sellers', err);
      }
    })
  }

  autoCompletarProductos(): void {
    this.productosFiltrados = this.definicionPlanDeVentasForm.get('fieldProducto')!.valueChanges.pipe(
          startWith(''),
          map(value => this._filtrarNombresProductos(value))
        )
  }

  _filtrarNombresProductos(value: string): string[] {
    const valorFiltro = value?.toString().toLowerCase() || '';
    return this.listaProductos
      .filter(producto => producto.name.toString().includes(valorFiltro))
      .map(producto => producto.name)
  }

  cargarProductos(callback?: () => void): void{
    this.isRefreshing = true;

    this.apiService.getListaProductos().pipe(
      finalize(() => {
        this.isRefreshing = false;
        if (callback) callback();
      })
    ).subscribe({
        next: (productos) => {
          this.listaProductos = productos.products;
          this.definicionPlanDeVentasForm.get('fieldProducto')?.setValue('', {emitEvent: true})
        },
        error: (err) => {
          console.error('Failed to load products', err);
        }
    })
  }

  crearPlanDeVentas(): void {
    const vendedor = this.listaVendedores.find(v => v.id);
    const producto = this.listaProductos.find(p => p.id);

    const formData = {
      seller_id: vendedor?.id,
      target: this.definicionPlanDeVentasForm.get('fieldMeta')?.value,
      product_id: producto?.id,
      period: this.definicionPlanDeVentasForm.get('fieldPeriodo')?.value
    }

    this.isSubmitting = true;

    this.apiService.postPlanVentas(formData).pipe(
      finalize(() => this.isSubmitting = false)
    ).subscribe({
      next: () => {
        this.clearAll();
      },
      error: (err) => {
        if (err.status === 409 ) {
          this.definicionPlanDeVentasForm.reset();
          this.definicionPlanDeVentasForm.setErrors(null);
        } else {
          console.error('Error creating sales plan')
        }
      }
    });
  }

  clearAll(): void {
    this.definicionPlanDeVentasForm.reset();
    this.definicionPlanDeVentasForm.markAsPristine();
    this.definicionPlanDeVentasForm.markAsUntouched();
    this.definicionPlanDeVentasForm.setErrors(null);
  }
}

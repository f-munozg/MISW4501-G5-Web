import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GestionAlertasInventarioCriticoService } from './gestion-alertas-inventario-critico.service';
import { finalize, map, Observable, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Bodega, BodegasResponse } from '../../bodegas/bodegas.model';

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

  isRefreshing: boolean = true;

  idProductoSeleccionado: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: GestionAlertasInventarioCriticoService
  ) { }

  initializeForms(): void{
    this.gestionAlertasInventarioCriticoForm = this.formBuilder.group({
      fieldProducto: ['', Validators.required],
      fieldBodega: ['', Validators.required],
      fieldUmbralMinimo: ['', [Validators.required, Validators.min(0)]],
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
    });
  }

  onSubmit() {

  }

  clearAll(): void {
    
  }

}

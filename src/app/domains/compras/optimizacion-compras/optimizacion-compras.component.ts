import { Component, OnInit } from '@angular/core';
import { finalize, map, Observable, startWith } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OptimizacionComprasService } from './optimizacion-compras.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { Fabricante, FabricantesResponse } from '../../fabricantes/fabricantes.model';

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
  listaFabricantes: Fabricante[] = [];

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
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  initializeForm(): void {
    this.optimizacionComprasForm = this.formBuilder.group({
      fieldProducto: [''],
      fieldFabricante: [''],
    });

    this.optimizacionComprasForm.get('fieldProducto')?.setValue('', { emitEvent: true });
    this.optimizacionComprasForm.get('fieldFabricante')?.setValue('', { emitEvent: true });
  }

  cargarFabricantes(): void {
    this.apiService.getListaFabricantes().subscribe({
      next: (response: FabricantesResponse) => {
        this.listaFabricantes = response.providers;
        this.optimizacionComprasForm.get('fieldFabricante')?.setValue('', { emitEvent: true });
      },
      error: (err) => {
        console.error('Error loading providers:', err);
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
      this.subscribirseQueryParams(); 
      this.cargarSugerenciasCompras(); 
    });

    this.route.queryParams.subscribe(params => {
      if (params['product_id'] || params['provider_id']) {
        this.aplicarQueryParams(params['product_id'], params['provider_id']);
      }
    });
  }

  aplicarQueryParams(productId: string | null, providerId: string | null) {
    if (productId) {
      const product = this.listaProductos.find(p => p.id === productId);
      if (product) {
        this.optimizacionComprasForm.get('fieldProducto')?.setValue(product.name);
        this.idProductoSeleccionado = productId;
      } else {
        setTimeout(() => this.aplicarQueryParams(productId, providerId), 100);
        return;
      }
    }
    
    if (providerId) {
      this.optimizacionComprasForm.get('fieldFabricante')?.setValue(providerId);
    }
    
    this.onSubmit();
  }

  subscribirseQueryParams(): void {
    this.route.queryParams.subscribe(params => {
      if (params['product_id'] || params['provider_id']) {
        this.aplicarQueryParams(params['product_id'], params['provider_id']);
      } else {
        this.clearAll();
      }
    });
  }

  cargarSugerenciasCompras(): void {
    this.isRefreshing = true;
    
    const idProducto = this.idProductoSeleccionado;
    const idFabricante = this.optimizacionComprasForm.get('fieldFabricante')?.value;

    this.apiService.getComprasSugeridas(idProducto || '', idFabricante || '')
      .pipe(finalize(() => this.isRefreshing = false))
      .subscribe({
        next: (response) => {
          this.tableData = [];

          if (response.suggested_purchases && response.suggested_purchases.length > 0) {
            this.tableData = response.suggested_purchases;
          }
        },
        error: (err) => {
          console.error('Error loading purchase suggestions:', err);
          this.tableData = [];
        }
      });
  }

  onSubmit() {
    const providerId = this.optimizacionComprasForm.get('fieldFabricante')?.value;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        product_id: this.idProductoSeleccionado || null,
        provider_id: providerId || null
      },
      queryParamsHandling: 'merge'
    });

    this.cargarSugerenciasCompras();
  }

  clearAll(): void {
    this.optimizacionComprasForm.reset();
    this.idProductoSeleccionado = null;
    
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      queryParamsHandling: 'merge'
    });
    
    setTimeout(() => {
      this.optimizacionComprasForm.get('fieldProducto')?.setValue('', { emitEvent: true });
    });
    
    this.cargarSugerenciasCompras();
  }

  navegarProductosCriticos(): void {
    this.router.navigate(['/inventario/gestion_alertas_inventario_critico']);
  }

}

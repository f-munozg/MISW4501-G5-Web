import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from '../../productos/producto.model';
import { finalize, map, Observable, startWith } from 'rxjs';
import { ReporteVentasService } from './reporte-ventas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Vendedor } from '../../vendedores/vendedores.model';

export interface TableRow{

}

@Component({
  selector: 'app-reporte-ventas',
  standalone: false,
  templateUrl: './reporte-ventas.component.html',
  styleUrls: ['./reporte-ventas.component.css']
})
export class ReporteVentasComponent implements OnInit {
  reporteVentasForm!: FormGroup;

  listaProductos: Producto[] = [];
  listaVendedores: Vendedor[] = [];

  numerosIdentificacionFiltrados!: Observable<number[]>;
  nombresProductosFiltrados!: Observable<string[]>;

  idProductoSeleccionado: string | null = null;

  tableData: TableRow[] = [];

  tableColumns = [
    {
      name: 'timestamp',
      header: 'Fecha',
      cell: (item: any) => item.timestamp.toString()
    },
    {
      name: 'nombre_producto',
      header: 'Producto',
      cell: (item: any) => item.nombre_producto.toString()
    },
    {
      name: 'vendedor',
      header: 'Vendedor',
      cell: (item: any) => item.vendedor.toString()
    },
    {
      name: 'units_sold',
      header: 'Unidades Vendidas',
      cell: (item: any) => item.cantidad_salida.toString()
    },
    {
      name: 'value',
      header: 'Ingresos',
      cell: (item: any) => item.stock_acumulado.toString()
    },
  ]

  visibleColumns = ['timestamp', 'nombre_producto', 'vendedor', 'units_sold', 'value'];


  constructor(
    private formBuilder: FormBuilder,
    private apiService: ReporteVentasService,
    private route: ActivatedRoute,
    private router: Router    
  ) { }

  initializeForm(): void {
    this.reporteVentasForm = this.formBuilder.group({
      fieldDesde: ['', Validators.required],
      fieldHasta: ['', Validators.required],
      fieldProducto: ['', Validators.required],
      fieldVendedor: ['', Validators.required]
    });
  }

  autoCompletar(): void {
      this.nombresProductosFiltrados = this.reporteVentasForm.get('fieldProducto')!.valueChanges.pipe(
        startWith(''),
        map(value => this._filtrarNombresProductos(value || '')) 
      );
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

  cargarProductos(): void {
    this.apiService.getListaProductos().subscribe({
      next: (productos) => {
        this.listaProductos = productos.products;
        this.autoCompletar();
        this.actualizarUrlConParams();
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  conProductoSeleccionado(nombreProductoSeleccionado: string): void {
    const productoSeleccionado = this.listaProductos.find(
      producto => producto.name === nombreProductoSeleccionado
    );
    
    if (productoSeleccionado) {
      this.idProductoSeleccionado = productoSeleccionado.id;
    } else {
      this.idProductoSeleccionado = null;
    }
  }

  actualizarUrlConParams(): void {
    this.route.queryParams.subscribe(params => {
      if (params['product_id'] && this.listaProductos.length > 0) {
        this.idProductoSeleccionado = params['product_id'];
        const producto = this.listaProductos.find(p => p.id === params['product_id']);
        
        if (producto) {
          this.reporteVentasForm.patchValue({
            fieldProducto: producto.name
          });
        }
      }
      
      if (params['start_date']) {
        const startDateValue = this.parsearFechaComoString(params['start_date']);
        
        this.reporteVentasForm.patchValue({
          fieldDesde: startDateValue
        });
      }
      
      if (params['end_date']) {
        const endDateValue = this.parsearFechaComoString(params['end_date']);
        
        this.reporteVentasForm.patchValue({
          fieldHasta: endDateValue
        });
      }
    });
  }

  parsearFechaComoString(dateStr: string): Date {
    if (!dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return new Date(dateStr);
    }
    
    const parts = dateStr.split('-');
    return new Date(
      parseInt(parts[0]), // Año
      parseInt(parts[1]) - 1, // Mes, arranca en index 0
      parseInt(parts[2]) // Día
    );
  }

  autoCompletarVendedor(): void {
      this.numerosIdentificacionFiltrados = this.reporteVentasForm.get('fieldVendedor')!.valueChanges.pipe(
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

  cargarVendedores(callback?: () => void): void {
    this.apiService.getListaVendedores().pipe(
      finalize(() => {
        if (callback) callback();
      })
    ).subscribe({
      next: (vendedores) => {
        this.listaVendedores = vendedores.sellers;
        this.reporteVentasForm.get('fieldVendedor')?.setValue('', { emitEvent: true});
      },
      error: (err) => {
        console.error('Failed to load sellers', err);
      }
    });
  }

  conVendedorSeleccionado(numeroIdentificacionSeleccionado: number): void {
    const vendedor = this.listaVendedores.find(v => v.identification_number === numeroIdentificacionSeleccionado);
    
    this.router.navigate(['view'], {
      relativeTo: this.route,
      queryParams: {id: vendedor?.id},
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
    
  }

  ngOnInit() {
    this.initializeForm();
    this.autoCompletar();
    this.cargarProductos();
    this.autoCompletarVendedor();
    this.cargarVendedores();
    this.setupValidacionFechas();
  }


  onSubmit() {

  }

  formatoFecha(date: Date | string): string {
    let d: Date;

    if (!(date instanceof Date)) {
      if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return date;
      }
      d = new Date(date);
      if (isNaN(d.getTime())) {
        throw new Error('Invalid date');
      }
    } else {
      d = date;
    }

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const result = `${year}-${month}-${day}`;

    return result;
  }

  setupValidacionFechas(): void {
    this.reporteVentasForm.get('fieldDesde')?.valueChanges.subscribe(() => {
      this.validarFechas();
    });
    
    this.reporteVentasForm.get('fieldHasta')?.valueChanges.subscribe(() => {
      this.validarFechas();
    });
  }

  validarFechas(): void {
    const fechaInicial = this.reporteVentasForm.get('fieldDesde')?.value;
    const fechaFinal = this.reporteVentasForm.get('fieldHasta')?.value;

    if (fechaInicial && fechaFinal) {
      const start = new Date(fechaInicial);
      const end = new Date(fechaFinal);
      
      if (start > end) {
        this.reporteVentasForm.get('fieldHasta')?.setErrors({ invalidDate: true });
      } else {
        this.reporteVentasForm.get('fieldHasta')?.setErrors(null);
      }
    }
  }
}

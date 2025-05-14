import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from '../../productos/producto.model';
import { map, Observable, startWith } from 'rxjs';
import { ReporteRotacionInventarioService } from './reporte-rotacion-inventario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoMovimiento } from '../../inventarios/inventario.model';
import { ReporteRotacionProducto } from '../reportes.model';

export interface TableRow{
    timestamp: string;
    nombre_producto: string;
    cantidad_ingreso: number;
    cantidad_salida: number;
    tipo_movimiento: TipoMovimiento;
    stock_acumulado: number;
}

@Component({
  selector: 'app-reporte-rotacion-inventario',
  standalone: false,
  templateUrl: './reporte-rotacion-inventario.component.html',
  styleUrls: ['./reporte-rotacion-inventario.component.css']
})
export class ReporteRotacionInventarioComponent implements OnInit {
  reporteRotacionInventarioForm!: FormGroup;

  listaProductos: Producto[] = [];

  nombresProductosFiltrados!: Observable<string[]>;
  
  idProductoSeleccionado: string | null = null;

  stockInicial: number = 0;
  stockFinal: number = 0;
  rotacion: string = '';

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
      name: 'cantidad_ingreso',
      header: 'Entrada',
      cell: (item: any) => item.cantidad_ingreso.toString()
    },
    {
      name: 'cantidad_salida',
      header: 'Salida',
      cell: (item: any) => item.cantidad_salida.toString()
    },
    {
      name: 'stock_acumulado',
      header: 'Stock Final',
      cell: (item: any) => item.stock_acumulado.toString()
    },
  ]

  visibleColumns = ['timestamp', 'nombre_producto', 'cantidad_ingreso', 'cantidad_salida', 'stock_acumulado']

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ReporteRotacionInventarioService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  initializeForm(): void {
    this.reporteRotacionInventarioForm = this.formBuilder.group({
      fieldDesde: ['', Validators.required],
      fieldHasta: ['', Validators.required],
      fieldProducto: ['', Validators.required]
    });
  }

  autoCompletar(): void {
    this.nombresProductosFiltrados = this.reporteRotacionInventarioForm.get('fieldProducto')!.valueChanges.pipe(
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
          this.reporteRotacionInventarioForm.patchValue({
            fieldProducto: producto.name
          });
        }
      }
      
      if (params['start_date']) {
        const startDateValue = this.parsearFechaComoString(params['start_date']);
        
        this.reporteRotacionInventarioForm.patchValue({
          fieldDesde: startDateValue
        });
      }
      
      if (params['end_date']) {
        const endDateValue = this.parsearFechaComoString(params['end_date']);
        
        this.reporteRotacionInventarioForm.patchValue({
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

  ngOnInit() {
    this.initializeForm();
    this.autoCompletar();
    this.cargarProductos();
    this.setupValidacionFechas();
  }

  onSubmit() { 
    if (this.reporteRotacionInventarioForm.invalid || !this.idProductoSeleccionado) {
      this.reporteRotacionInventarioForm.markAllAsTouched();
      return;
    }

    const formValue = this.reporteRotacionInventarioForm.value;
    
    const queryParams: any = {
      product_id: this.idProductoSeleccionado
    };

    if (formValue.fieldDesde) {
      queryParams.start_date = this.formatoFecha(formValue.fieldDesde);
    }

    if (formValue.fieldHasta) {
      queryParams.end_date = this.formatoFecha(formValue.fieldHasta);
    }
    
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });
    
    this.apiService.getRotacionProducto(this.idProductoSeleccionado, queryParams.start_date, queryParams.end_date).subscribe(
      (response: ReporteRotacionProducto) => { 
        this.tableData = response.movimientos; 
        this.stockInicial = response.stock_inicial;
        this.stockFinal = response.stock_final;
        this.rotacion = response.rotacion.texto;
      },
      error => console.log(error)
    )
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
    this.reporteRotacionInventarioForm.get('fieldDesde')?.valueChanges.subscribe(() => {
      this.validarFechas();
    });
    
    this.reporteRotacionInventarioForm.get('fieldHasta')?.valueChanges.subscribe(() => {
      this.validarFechas();
    });
  }

  validarFechas(): void {
    const fechaInicial = this.reporteRotacionInventarioForm.get('fieldDesde')?.value;
    const fechaFinal = this.reporteRotacionInventarioForm.get('fieldHasta')?.value;

    if (fechaInicial && fechaFinal) {
      const start = new Date(fechaInicial);
      const end = new Date(fechaFinal);
      
      if (start > end) {
        this.reporteRotacionInventarioForm.get('fieldHasta')?.setErrors({ invalidDate: true });
      } else {
        this.reporteRotacionInventarioForm.get('fieldHasta')?.setErrors(null);
      }
    }
  }

}

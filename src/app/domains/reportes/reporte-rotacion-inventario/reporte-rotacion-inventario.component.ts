import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from '../../productos/producto.model';
import { map, Observable, startWith } from 'rxjs';
import { ReporteRotacionInventarioService } from './reporte-rotacion-inventario.service';
import { ActivatedRoute, Router } from '@angular/router';

export interface TableRow{

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

  tableData: TableRow[] = [];

  tableColumns = [
    {
      name: 'one',
      header: 'one',
      cell: (item: any) => item.one.toString()
    },
    {
      name: 'two',
      header: 'two',
      cell: (item: any) => item.two.toString()
    },
    {
      name: 'three',
      header: 'three',
      cell: (item: any) => item.three.toString()
    },
  ]

  visibleColumns = ['one', 'two', 'three']

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

  private parsearFechaComoString(dateStr: string): Date {
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

  private setupValidacionFechas(): void {
    this.reporteRotacionInventarioForm.get('fieldDesde')?.valueChanges.subscribe(() => {
      this.validarFechas();
    });
    
    this.reporteRotacionInventarioForm.get('fieldHasta')?.valueChanges.subscribe(() => {
      this.validarFechas();
    });
  }

  private validarFechas(): void {
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

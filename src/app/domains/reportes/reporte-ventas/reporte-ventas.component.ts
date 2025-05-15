import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from '../../productos/producto.model';
import { finalize, map, Observable, startWith } from 'rxjs';
import { ReporteVentasService } from './reporte-ventas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Vendedor } from '../../vendedores/vendedores.model';
import { ReporteVentas } from '../reportes.model';

export interface TableRow{
    producto: string;
    vendedor: string;
    unidades_vendidas: number;
    ingresos: number;
    primera_venta: string;
    ultima_venta: string;
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
  idVendedorSeleccionado: string | null = null;

  tableData: TableRow[] = [];

  tableColumns = [
    {
      name: 'producto',
      header: 'Producto',
      cell: (item: any) => item.producto.toString()
    },
    {
      name: 'vendedor',
      header: 'Vendedor',
      cell: (item: any) => item.vendedor.toString()
    },
    {
      name: 'unidades_vendidas',
      header: 'Unidades',
      cell: (item: any) => item.unidades_vendidas.toString()
    },
    {
      name: 'ingresos',
      header: 'Ingresos',
      cell: (item: any) => item.ingresos.toString()
    },
    {
      name: 'primera_venta',
      header: 'Primera Venta',
      cell: (item: any) => item.primera_venta.toString()
    },
        {
      name: 'ultima_venta',
      header: 'Última Venta',
      cell: (item: any) => item.ultima_venta.toString()
    },
  ]

  visibleColumns = ['producto','vendedor','unidades_vendidas','ingresos','primera_venta','ultima_venta'];

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
      fieldProducto: [''],
      fieldVendedor: ['']
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
      if (Object.keys(params).length === 0) return;

      if (params['producto']) {
        this.idProductoSeleccionado = params['producto'];
        if (this.listaProductos.length > 0) {
          const producto = this.listaProductos.find(p => p.id === params['producto']);
          if (producto) {
            this.reporteVentasForm.patchValue({
              fieldProducto: producto.name
            });
          }
        }
      }
      
      if (params['vendedor']) {
        this.idVendedorSeleccionado = params['vendedor'];
        if (this.listaVendedores.length > 0) {
          const vendedor = this.listaVendedores.find(v => v.id === params['vendedor']);
          if (vendedor) {
            this.reporteVentasForm.patchValue({
              fieldVendedor: vendedor.identification_number.toString()
            });
          }
        } else {
          this.cargarVendedores(() => {
            const vendedor = this.listaVendedores.find(v => v.id === params['vendedor']);
            if (vendedor) {
              this.reporteVentasForm.patchValue({
                fieldVendedor: vendedor.identification_number.toString()
              });
            }
          });
        }
      }
      
      if (params['fecha_inicio']) {
        const startDateValue = this.parsearFechaComoString(params['fecha_inicio']);
        this.reporteVentasForm.patchValue({
          fieldDesde: startDateValue
        });
      }
      
      if (params['fecha_fin']) {
        const endDateValue = this.parsearFechaComoString(params['fecha_fin']);
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
      .filter(vendedor => 
        vendedor.identification_number.toString().includes(valorFiltro)
      )
      .map(vendedor => vendedor.identification_number);
  }

  cargarVendedores(callback?: () => void): void {
    this.apiService.getListaVendedores().pipe(
      finalize(() => {
        this.autoCompletarVendedor();
        if (callback) callback();
      })
    ).subscribe({
      next: (vendedores) => {
        this.listaVendedores = vendedores.sellers;
      },
      error: (err) => {
        console.error('Failed to load sellers', err);
      }
    });
  }

  conVendedorSeleccionado(numeroIdentificacionSeleccionado: number): void {
    const vendedorSeleccionado = this.listaVendedores.find(v => 
      v.identification_number === numeroIdentificacionSeleccionado
    );
    
    if (vendedorSeleccionado) {
      this.idVendedorSeleccionado = vendedorSeleccionado.id;
    } else {
      this.idVendedorSeleccionado = null;
    }
  }

  ngOnInit() {
    this.initializeForm();
    this.autoCompletar();
    this.autoCompletarVendedor();
    this.setupValidacionFechas();
    
    this.cargarProductos();
    this.cargarVendedores(() => {
      this.actualizarUrlConParams();
    });
  }


  onSubmit() {
    if (this.reporteVentasForm.valid) {
      const formValues = this.reporteVentasForm.value;
      
      const queryParams: any = {
        fecha_inicio: this.formatoFecha(formValues.fieldDesde),
        fecha_fin: this.formatoFecha(formValues.fieldHasta)
      };

      if (this.idProductoSeleccionado) {
        queryParams.producto = this.idProductoSeleccionado;
      }

      if (this.idVendedorSeleccionado) {
        queryParams.vendedor = this.idVendedorSeleccionado;
      }

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams,
        queryParamsHandling: 'merge',
        replaceUrl: true
      });

      this.apiService.getReporteVentas(
        queryParams.fecha_inicio,
        queryParams.fecha_fin,
        this.idProductoSeleccionado,
        this.idVendedorSeleccionado
      ).subscribe(
        (response: ReporteVentas[]) => {
          this.tableData = response;
        },
        error => console.log(error)
      )
    }
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

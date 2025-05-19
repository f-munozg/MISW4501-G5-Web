import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Vendedor } from '../../vendedores/vendedores.model';
import { finalize, map, Observable, startWith } from 'rxjs';
import { ReporteVendedorService } from './reporte-vendedor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReporteVendedorResponse } from '../reportes.model';

export interface TableRow {
    fecha_venta: string;
    producto: string;
    cantidad: number;
    valor_total: number;
}

@Component({
  selector: 'app-reporte-vendedor',
  standalone: false,
  templateUrl: './reporte-vendedor.component.html',
  styleUrls: ['./reporte-vendedor.component.css']
})
export class ReporteVendedorComponent implements OnInit {
  reporteVendedorForm!: FormGroup;

  listaVendedores: Vendedor[] = [];

  numerosIdentificacionFiltrados!: Observable<number[]>;
  
  idVendedorSeleccionado: string | null = null;

  totalVentas: number = 0;
  clientesAtendidos: number = 0;
  cumplimientoMetas: string = '';

  totalPlanVentas: number = 0; 
  clientesVisitados: number = 0;
  tasaConversion: string = '';

  tableData: TableRow[] = [];

  tableColumns = [
    {
      name: 'fecha_venta',
      header: 'Fecha',
      cell: (item: any) => item.fecha_venta.toString()
    },
    {
      name: 'producto',
      header: 'Producto',
      cell: (item: any) => item.producto.toString()
    },
    {
      name: 'cantidad',
      header: 'Unidades Vendidas',
      cell: (item: any) => item.cantidad.toString()
    },
    {
      name: 'valor_total',
      header: 'Valor Total',
      cell: (item: any) => item.valor_total.toString()
    }
  ];

  visibleColumns = ['fecha_venta','producto','cantidad','valor_total'];

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ReporteVendedorService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  initializeForm(): void {
    this.reporteVendedorForm = this.formBuilder.group({
      fieldDesde: ['', Validators.required],
      fieldHasta: ['', Validators.required],
      fieldVendedor: ['', Validators.required]
    });
  }

  autoCompletarVendedor(): void {
    this.numerosIdentificacionFiltrados = this.reporteVendedorForm.get('fieldVendedor')!.valueChanges.pipe(
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

  actualizarUrlConParams(): void {
    this.route.queryParams.subscribe(params => {

      if (params['vendedor']) {
        this.idVendedorSeleccionado = params['vendedor'];
        if (this.listaVendedores.length > 0) {
          const vendedor = this.listaVendedores.find(v => v.id === params['vendedor']);
          if (vendedor) {
            this.reporteVendedorForm.patchValue({
              fieldVendedor: vendedor.identification_number.toString()
            });
          }
        } else {
          this.cargarVendedores(() => {
            const vendedor = this.listaVendedores.find(v => v.id === params['vendedor']);
            if (vendedor) {
              this.reporteVendedorForm.patchValue({
                fieldVendedor: vendedor.identification_number.toString()
              });
            }
          });
        }
      }
      
      if (params['start_date']) {
        const startDateValue = this.parsearFechaComoString(params['start_date']);
        
        this.reporteVendedorForm.patchValue({
          fieldDesde: startDateValue
        });
      }
      
      if (params['end_date']) {
        const endDateValue = this.parsearFechaComoString(params['end_date']);
        
        this.reporteVendedorForm.patchValue({
          fieldHasta: endDateValue
        });
      }
    });
  }

  ngOnInit() {
    this.initializeForm();
    this.autoCompletarVendedor();
    this.setupValidacionFechas();

    this.cargarVendedores(() => {
      this.actualizarUrlConParams();
    });
  }

  onSubmit() {
    if (this.reporteVendedorForm.invalid || !this.reporteVendedorForm) {
      this.reporteVendedorForm.markAllAsTouched();
      return;
    }

    const formValue = this.reporteVendedorForm.value;
    
    const queryParams: any = {
      vendedor_id: this.idVendedorSeleccionado
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
    
    this.apiService.getReporteVendedor(queryParams.start_date, queryParams.end_date, this.idVendedorSeleccionado!).subscribe(
      (response: ReporteVendedorResponse) => { 
        this.tableData = response.detalle_productos; 
        this.totalVentas = response.resumen.total_ventas;
        this.clientesAtendidos = response.resumen.clientes_atendidos;
        this.cumplimientoMetas = response.resumen.plan.cumplimiento;
        this.totalPlanVentas = response.resumen.total_ventas_plan;
        this.clientesVisitados = response.resumen.clientes_visitados;
        this.tasaConversion = response.resumen.tasa_conversion;
      },
      error => console.log(error)
    )
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
    this.reporteVendedorForm.get('fieldDesde')?.valueChanges.subscribe(() => {
      this.validarFechas();
    });
    
    this.reporteVendedorForm.get('fieldHasta')?.valueChanges.subscribe(() => {
      this.validarFechas();
    });
  }

  validarFechas(): void {
    const fechaInicial = this.reporteVendedorForm.get('fieldDesde')?.value;
    const fechaFinal = this.reporteVendedorForm.get('fieldHasta')?.value;

    if (fechaInicial && fechaFinal) {
      const start = new Date(fechaInicial);
      const end = new Date(fechaFinal);
      
      start.setHours(0, 0, 0, 0);
      
      end.setHours(23, 59, 59, 999);
      
      if (start > end) {
        this.reporteVendedorForm.get('fieldHasta')?.setErrors({ invalidDate: true });
      } else {
        this.reporteVendedorForm.get('fieldHasta')?.setErrors(null);
      }
    }
  }
}

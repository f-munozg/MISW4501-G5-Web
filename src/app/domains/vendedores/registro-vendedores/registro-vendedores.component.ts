import { Component, OnInit } from '@angular/core';
import { ClientesResponse, Vendedor, VendedoresResponse, ZonaType2LabelMapping, ZonaVendedor } from '../vendedores.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistroVendedoresService } from './registro-vendedores.service';
import { catchError, distinctUntilChanged, finalize, map, Observable, of, startWith } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

export interface TableRow{
  id: string;
  name: string;
  identification_number: string;
  observations: string;
  user_id: string;
  email: string;
}

@Component({
  selector: 'app-registro-vendedores',
  standalone: false,
  templateUrl: './registro-vendedores.component.html',
  styleUrls: ['./registro-vendedores.component.css']
})
export class RegistroVendedoresComponent implements OnInit {
  registroVendedoresForm!: FormGroup;
  consultaVendedoresForm!: FormGroup;

  listaVendedores: Vendedor[] = [];
  numerosIdentificacionFiltrados!: Observable<number[]>;

  creandoNuevoVendedor = true;

  isSubmitting: boolean = true;
  isRefreshing: boolean = true;
  isInViewMode: boolean = false;

  idVendedorSeleccionado: string | null = null;

  public ZonaType2LabelMapping = ZonaType2LabelMapping;
  public zonaTypes = Object.values(ZonaVendedor);

  tableData: TableRow[] = [];

  tableColumns = [
    { 
      name: 'name', 
      header: 'Nombre de Cliente', 
      cell: (item: any) => item.name.toString() 
    },
    { 
      name: 'observations', 
      header: 'Observaciones', 
      cell: (item: any) => item.observations.toString() 
    },
  ];

  visibleColumns = ['name', 'observations',];

  assignAction = [
    {
      icon: 'Asignar',
      tooltip: 'Asignar',
      action: (row: TableRow) => {
      const selectedVendedorId = this.idVendedorSeleccionado;
      
      if (!selectedVendedorId) {
        console.error('No vendedor selected');
        return;
      }
      
      this.asignarClienteAVendedor(selectedVendedorId, row.id);

      }     
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private apiService: RegistroVendedoresService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  initializeForms(): void {
    this.registroVendedoresForm = this.formBuilder.group({
      fieldNumeroIdentificacion: ['', Validators.required],
      fieldNombre: [ '', Validators.required ],
      fieldCorreoElectronico: [ '', [Validators.required, Validators.email] ],
      fieldDireccion: [ '', Validators.required ],
      fieldTelefono: [ '', Validators.required ],
      fieldZona: [ '', Validators.required ]
    });

    this.consultaVendedoresForm = this.formBuilder.group({
      fieldNumeroIdentificacion: ['', Validators.required],
      fieldNombre: [ '', Validators.required ],
      fieldCorreoElectronico: [ '', [Validators.required, Validators.email] ],
      fieldDireccion: [ '', Validators.required ],
      fieldTelefono: [ '', Validators.required ],
      fieldZona: [ '', Validators.required ]
    });
  }

  ngOnInit() {
    this.initializeForms();
    this.autoCompletar();
    this.cargarVendedores(() => {
      this.route.queryParams.pipe(
        distinctUntilChanged()
      ).subscribe(params => {
        this.idVendedorSeleccionado = params['id'] || null;
        if (this.idVendedorSeleccionado) {
          this.isInViewMode = true;
          this.crearUrlConId();
        } else {
          this.isInViewMode = false;
        }
      });
    });
  }

  crearUrlConId(): void {
    if (!this.idVendedorSeleccionado || !this.listaVendedores.length) return;

    const vendedor = this.listaVendedores.find(v => v.id === this.idVendedorSeleccionado);
    if (!vendedor) return
    else {
      this.isInViewMode = true;
      this.consultaVendedoresForm.patchValue({
        fieldNumeroIdentificacion: vendedor.identification_number,
        fieldNombre: vendedor.name,
        fieldCorreoElectronico: vendedor.email,
        fieldDireccion: vendedor.address,
        fieldTelefono: vendedor.phone,
        fieldZona: vendedor.zone
      });
    }
  }

  autoCompletar(): void {
    this.numerosIdentificacionFiltrados = this.consultaVendedoresForm.get('fieldNumeroIdentificacion')!.valueChanges.pipe(
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
    this.isRefreshing = true;

    this.apiService.getListaVendedores().pipe(
      finalize(() => {
        this.isRefreshing = false
        if (callback) callback();
      })
    ).subscribe({
      next: (vendedores) => {
        this.listaVendedores = vendedores.sellers;
        this.consultaVendedoresForm.get('fieldNumeroIdentificacion')?.setValue('', { emitEvent: true});
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
    
    this.apiService.getClientesPorAsignar().subscribe(
      (response: ClientesResponse) => {this.tableData = response.customers},
      error => console.log(error)
    );
  }

  crearNuevoVendedor(): void {
    const formData = this.registroVendedoresForm.value;

    this.isSubmitting = true;

    this.apiService.postData(formData).pipe(
      finalize(() => this.isSubmitting = false)
    ).subscribe({
      next: () => {
        this.clearAll();
        this.cargarVendedores();
      },
      error: (err) => {
        if (err.status === 409) {
          this.registroVendedoresForm.get('fieldNumeroIdentificacion')?.reset();
          this.registroVendedoresForm.get('fieldNumeroIdentificacion')?.setErrors(null);
        } else {
          console.error('Error creating seller')
        }
      }
    });  
  }

  asignarClienteAVendedor(user_id: string, customer_id: string) {
    this.apiService.postAsignarClienteAVendedor(user_id, customer_id).subscribe(
      (response) => {
        console.log('Customer assigned successfully', response);
        this.cargarVendedores();
      },
      (error) => {
        console.error('Failed to assign customer', error);
      }
    );
  }

  toggleMode(): void {
    if (this.isInViewMode) {
      this.cargarVendedores();
      this.limpiarUrlConId();
      this.consultaVendedoresForm.reset();
      this.tableData = [];
    } else {
      this.router.navigate(['view'], {
        relativeTo: this.route,
        queryParamsHandling: 'preserve'
      })
    }

    this.isInViewMode = !this.isInViewMode;
  }

  limpiarUrlConId(): void {
    this.idVendedorSeleccionado = null;
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: {id: null},
      queryParamsHandling: 'merge',
    })
  }

  onSubmit(){
    if (this.registroVendedoresForm.invalid) {
      this.registroVendedoresForm.markAllAsTouched();
      return;
    }

    if (this.creandoNuevoVendedor) {
      this.crearNuevoVendedor()
    }
  }

  clearAll(){
    this.registroVendedoresForm.reset();
    this.registroVendedoresForm.markAsPristine();
    this.registroVendedoresForm.markAsUntouched();
    this.registroVendedoresForm.setErrors(null);
  }

}

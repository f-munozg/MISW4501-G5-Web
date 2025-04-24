import { Component, OnInit } from '@angular/core';
import { Vendedor, VendedoresResponse, ZonaType2LabelMapping, ZonaVendedor } from '../vendedores.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistroVendedoresService } from './registro-vendedores.service';
import { catchError, finalize, map, Observable, of, startWith } from 'rxjs';

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

  public ZonaType2LabelMapping = ZonaType2LabelMapping;
  public zonaTypes = Object.values(ZonaVendedor);

  tableData = [

  ]

  tableColumns = [
    { 
      name: 'nombre_cliente', 
      header: 'Nombre de Cliente', 
      cell: (item: any) => `${item.nombre_cliente}` 
    },
    { 
      name: 'zona', 
      header: 'Zona', 
      cell: (item: any) => item.zona 
    },
  ];

  visibleColumns = ['nombre_cliente', 'zona',];

  assignAction = [
    {
      icon: 'Asignar',
      tooltip: 'Asignar',
      action: () => {}     
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private apiService: RegistroVendedoresService
  ) { }

  private initializeForms(): void {
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
    this.cargarVendedores();
  }

  private autoCompletar(): void {
    this.numerosIdentificacionFiltrados = this.consultaVendedoresForm.get('fieldNumeroIdentificacion')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filtrarNumerosIdentificacion(value))
    )
  }

  private _filtrarNumerosIdentificacion(value: string): number[] {
    const valorFiltro = value?.toString().toLowerCase() || '';
    return this.listaVendedores
      .filter(vendedor => vendedor.identification_number.toString().includes(valorFiltro))
      .map(vendedor => vendedor.identification_number)
  }

  private cargarVendedores(): void {
    this.isRefreshing = true;

    this.apiService.getListaVendedores().pipe(
      finalize(() => this.isRefreshing = false)
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

  conNumeroIdentificacionSeleccionado(numeroIdentificacionSeleccionado: number): void {
    const vendedor = this.listaVendedores.find(v => v.identification_number === numeroIdentificacionSeleccionado);
    if (vendedor) {
      this.consultaVendedoresForm.patchValue({
        fieldNombre: vendedor.name,
        fieldCorreoElectronico: vendedor.email,
        fieldDireccion: vendedor.address,
        fieldTelefono: vendedor.phone,
        fieldZona: vendedor.zone
      })
    }
  }

  private crearNuevoVendedor(): void {
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

  toggleMode(): void {
    this.isInViewMode = !this.isInViewMode;
    if (this.isInViewMode) {
      this.cargarVendedores();
    } else {
      this.consultaVendedoresForm.reset();
    }
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

import { Component, OnInit } from '@angular/core';
import { Vendedor, VendedoresResponse, ZonaType2LabelMapping, ZonaVendedor } from '../vendedores.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistroVendedoresService } from './registro-vendedores.service';
import { map, Observable, startWith } from 'rxjs';

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
    this.apiService.getListaVendedores().subscribe({
      next: (response: VendedoresResponse) => {
        this.listaVendedores = response.sellers;
      },
      error: (err) => {
        console.error('Error loading sellers: ', err);
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

    this.apiService.postData(formData).subscribe({
      next: (response) => {
        console.log('Vendedor creado:', response);
        this.registroVendedoresForm.reset();
      },
      error: (error) => {
        console.error('Error creando vendedor:', error);
      }
    });
  }

  toggleMode(): void {
    this.isInViewMode = !this.isInViewMode;
    if (!this.isInViewMode) {
      this.consultaVendedoresForm.reset(); // Clear view form when switching back to add mode
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

}

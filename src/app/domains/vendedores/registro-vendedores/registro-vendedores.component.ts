import { Component, OnInit } from '@angular/core';
import { ZonaType2LabelMapping, ZonaVendedor } from '../vendedores.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistroVendedoresService } from './registro-vendedores.service';

@Component({
  selector: 'app-registro-vendedores',
  standalone: false,
  templateUrl: './registro-vendedores.component.html',
  styleUrls: ['./registro-vendedores.component.css']
})
export class RegistroVendedoresComponent implements OnInit {
  registroVendedoresForm!: FormGroup;
  isCreatingNewSeller = true;

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

  private initializeForm(): void {
    this.registroVendedoresForm = this.formBuilder.group({
      fieldNumeroIdentificacion: ['', Validators.required],
      fieldNombre: [ '', Validators.required ],
      fieldCorreoElectronico: [ '', [Validators.required, Validators.email] ],
      fieldDireccion: [ '', Validators.required ],
      fieldTelefono: [ '', Validators.required ],
      fieldZona: [ '', Validators.required ]
    })
  }

  ngOnInit() {
    this.initializeForm();
  }

  private createNewSeller(): void {
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


  onSubmit(){
    if (this.registroVendedoresForm.invalid) {
      this.registroVendedoresForm.markAllAsTouched();
      return;
    }

    if (this.isCreatingNewSeller) {
      this.createNewSeller()
    }
  }

}

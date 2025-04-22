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

  ngOnInit() {
    this.registroVendedoresForm = this.formBuilder.group({
      fieldNumeroIdentificacion: ['', Validators.required],
      fieldNombre: [ {value: '', disabled: true} ],
      fieldCorreoElectronico: [ {value: '', disabled: true} ],
      fieldDireccion: [ {value: '', disabled: true} ],
      fieldTelefono: [ {value: '', disabled: true} ],
      fieldZona: [ {value: '', disabled: true}]
    })
  }

  onSubmit(){
    
  }

}

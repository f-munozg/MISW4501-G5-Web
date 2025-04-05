import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistroFabricantesService } from './registro-fabricantes.service';

@Component({
  selector: 'app-registro-fabricantes',
  standalone: false,
  templateUrl: './registro-fabricantes.component.html',
  styleUrls: ['./registro-fabricantes.component.css']
})
export class RegistroFabricantesComponent implements OnInit {
  registroFabricantesForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: RegistroFabricantesService
  ) { }

  ngOnInit() {
    this.registroFabricantesForm = this.formBuilder.group({
      fieldNit: ['', Validators.required],
      fieldNombre: ['', Validators.required],
      fieldPais: ['', Validators.required],
      fieldDireccion: ['', Validators.required],
      fieldIdentificacion: ['', Validators.required],
      fieldNombreContacto: ['', Validators.required],
      fieldTelefono: ['', Validators.required],
      fieldDireccionContacto: ['', Validators.required]
      }
    );
  }

  onSubmit() {
    if (this.registroFabricantesForm.valid) {
      const formData = this.registroFabricantesForm.value;
      
      this.apiService.postData(formData).subscribe(
        response => {
          console.log('Success!', response);
        },
        error => {
          console.error('Error!', error);
        }
      );
    }
  }

  clearAll(){
    this.registroFabricantesForm.reset()
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CargaProductoService } from './carga-producto.service';
import { FileType2LabelMapping, CategoriaProductos, Fabricante, FabricantesResponse } from '../producto.model';

@Component({
  selector: 'app-carga-producto',
  standalone: false,
  templateUrl: './carga-producto.component.html',
  styleUrls: ['./carga-producto.component.css']
})
export class CargaProductoComponent implements OnInit {
  cargaProductoForm!: FormGroup;
  selectedFile: File | null = null;
  isSubmitting = false;
  listaFabricantes: Fabricante[] = [];

  public FileType2LabelMapping = FileType2LabelMapping;
  public fileTypes = Object.values(CategoriaProductos);

  constructor(
    private formBuilder: FormBuilder,
    private apiService: CargaProductoService
  ) { }

  ngOnInit() {
    this.cargaProductoForm = this.formBuilder.group({
      fieldCodigo: ['', Validators.required],
      fieldFabricante: ['', Validators.required],
      fieldValor: ['', Validators.required],
      fieldFechaVencimiento: [null, Validators.required],
      fieldCondicionesAlmacenamiento: ['', Validators.required],
      fieldCategoria: ['', Validators.required],
      fieldCaracteristicas: ['', Validators.required],
      fieldDescripcion: ['', Validators.required],
      fieldNombre: ['', Validators.required]
      }
    );

    this.apiService.getListaFabricantes().subscribe({
      next: (response: FabricantesResponse) => {
        this.listaFabricantes = response.providers;
      },
      error: (err) => {
        console.error('Error loading providers:', err);
      }
    });

  
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit() {
    if (this.cargaProductoForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const formData = {
        ...this.cargaProductoForm.value,
        imageFile: this.selectedFile
      }

      if (formData.fieldFechaVencimiento) {
        formData.fieldFechaVencimiento = this.formatDateToISOWithTime(formData.fieldFechaVencimiento);
      }

      this.apiService.postData(formData)
      .then(apiObservable$ => {
        apiObservable$.subscribe({
          next: (response) => {
            console.log('Success!', response);
            this.isSubmitting = false;
          },
          error: (err) => {
            console.error('API Error:', err);
            this.isSubmitting = false;
          }
        });
      })
      .catch(error => {
        console.error('Image processing error:', error);
        this.isSubmitting = false;
      });
    }
  }

  clearAll(){
    this.cargaProductoForm.reset()

    this.selectedFile = null;

    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
  }
  }

  formatDateToISOWithTime(date: Date | string): string {
    let d: Date;
    
    if (!(date instanceof Date)) {
      if (isNaN(Date.parse(date))) {
        throw new Error('Invalid date string');
      }
      d = new Date(date);
      d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    } else {
      d = date;
    }
  
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}T00:00:00`;
}

}

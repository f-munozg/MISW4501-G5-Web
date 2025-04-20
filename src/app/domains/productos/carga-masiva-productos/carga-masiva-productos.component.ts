import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CargaMasivaProductosService } from './carga-masiva-productos.service';
import { Fabricante, FabricantesResponse } from '../producto.model';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-carga-masiva-productos',
  standalone: false,
  templateUrl: './carga-masiva-productos.component.html',
  styleUrls: ['./carga-masiva-productos.component.css']
})
export class CargaMasivaProductosComponent implements OnInit {
  cargaMasivaProductosForm!: FormGroup;
  selectedFile: File | null = null;
  errorMessage: string = '';
  allowedExtensions = ['.csv', '.xlsx', '.xls'];
  isSubmitting = false;
  listaFabricantes: Fabricante[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private apiService: CargaMasivaProductosService
  ) { }

  ngOnInit() {
    this.cargaMasivaProductosForm = this.formBuilder.group({
      fieldFabricante: ['', Validators.required]
    })

    this.apiService.getListaFabricantes().subscribe({
      next: (response: FabricantesResponse) => {
        this.listaFabricantes = response.providers;
      },
      error: (err) => {
        console.error('Error cargando fabricantes:', err);
      }
    });
  }

  // Comportamiento del drag and drop
  isDragOver = false;

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    
    this.errorMessage = '';
    
    if (!event.dataTransfer?.files?.length) {
      return;
    }

    const file = event.dataTransfer.files[0];
    this.processSelectedFile(file);
  }
  
  // Manejo de los archivos
  onFileSelected(event: any): void {
    this.errorMessage = '';
    const file: File = event.target.files[0];
    this.processSelectedFile(file);
  }  
    
  private processSelectedFile(file: File | null): void {
    if (!file) {
      return;
    }
  
    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!this.allowedExtensions.includes(fileExt)) {
      this.errorMessage = 'Archivo inválido. Solo subir archivos CSV o Excel.';
      this.selectedFile = null;
      return;
    }
  
    this.selectedFile = file;
  }

  async uploadFile(formData: { productsFile: File, fieldFabricante: string }) {
    try {
      const upload$ = this.apiService.postData(formData);
      
      await new Promise((resolve, reject) => {
        upload$.subscribe({
          next: (event) => {
            if (event.type === HttpEventType.Response) {
              console.log('¡Carga exitosa!', event.body);
              resolve(event.body);
            }
          },
          error: (err) => {
            this.errorMessage = 'La carga ha fallado: ' + err.message;
            reject(err);
          }
        });
      });
    } catch (err) {
      if (err instanceof Error) {
        this.errorMessage = 'Error preparando la carga: ' + err.message;
      } else {
        this.errorMessage = 'Un error desconocido ha sucedido';
      }
      throw err; 
    }
  }

  async onSubmit() {
    if (this.cargaMasivaProductosForm.invalid) {
      return;
    }

    if (!this.selectedFile) {
      this.errorMessage = 'Por favor seleccione un archivo.';
      return;
    }

    if (!this.isSubmitting) {
      this.isSubmitting = true;
      this.errorMessage = '';
  
      try {
        const formData = {
          ...this.cargaMasivaProductosForm.value,
          productsFile: this.selectedFile
        };
  
        await this.uploadFile(formData);
        
        console.log('Proceso completado exitosamente');
        
      } catch (error) {
        // Para garantizar la seguridad de los tipos.
        this.errorMessage = error instanceof Error 
        ? `Error: ${error.message}`
        : 'Error desconocido';
      } finally {
        this.isSubmitting = false; 
    }
    }
  }

  clearAll(){
    this.cargaMasivaProductosForm.reset()

    this.selectedFile = null;

    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }

    this.errorMessage = '';
    this.isSubmitting = false;
  }


}

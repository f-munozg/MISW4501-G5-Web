import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CargaMasivaProductosService } from './carga-masiva-productos.service';
import { Fabricante, FabricantesResponse } from '../../fabricantes/fabricantes.model';
import { HttpEventType } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

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

    event.target.value = '';
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
    this.errorMessage = '';
    this.isSubmitting = true;
  
    try {
      const upload$ = this.apiService.postData(formData);
      await lastValueFrom(upload$);
    } catch (err: unknown) {
      this.errorMessage = this.getErrorMessage(err, 'Error en el proceso de carga del archivo');
      throw err; // Re-throw para manejo adicional de error en onSubmit si es necesario
    } finally {
      this.isSubmitting = false;
    }
  }
  
  private getErrorMessage(error: unknown, prefix: string): string {
    // 1. HTTP errors
    if (typeof error === 'object' && error !== null) {
      // Revisa la estructura del error estándar de HttpClient
      if ('status' in error) {
        const status = error.status as number;
        const statusText = 'statusText' in error ? error.statusText as string : 'Error de servidor';
        
        // Muestra el error del servidor si es posible
        let serverMessage = '';
        if ('error' in error && typeof error.error === 'object' && error.error !== null) {
          if ('message' in error.error) {
            serverMessage = (error.error as {message: string}).message;
          }
        }
  
        return serverMessage 
          ? `${prefix}: ${serverMessage} (HTTP ${status})`
          : `${prefix}: HTTP ${status} - ${statusText}`;
      }

      // En caso de obtener el estado dentro de error.error
      if ('error' in error && typeof error.error === 'object' && error.error !== null) {
        if ('status' in error.error) {
          const status = error.error.status as number;
          const message = 'message' in error.error 
            ? error.error.message as string 
            : 'Error de servidor';
          return `${prefix}: ${message} (HTTP ${status})`;
        }
      }
    }
  
    // 2. Manejar instancias de Error (errores estándar de JavaScript)
    if (error instanceof Error) {
      return `${prefix}: ${error.message}`;
    }
  
    // 3. Manejar errores de tipo string (algo raro)
    if (typeof error === 'string') {
      return `${prefix}: ${error}`;
    }
  
    // 4. Por defecto
    return `${prefix}: Error desconocido`;
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
        this.selectedFile = null; // Limpia el input para que sea usado luego de dar submit.
        
      } catch (error) {
        this.errorMessage = this.getErrorMessage(error, 'Error cargando archivo');
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

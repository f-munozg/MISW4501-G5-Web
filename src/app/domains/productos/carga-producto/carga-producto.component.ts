import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CargaProductoService } from './carga-producto.service';
import { FileType2LabelMapping, CategoriaProductos, ProductosResponse, Producto } from '../producto.model';
import { Fabricante, FabricantesResponse } from '../../fabricantes/fabricantes.model';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-carga-producto',
  standalone: false,
  templateUrl: './carga-producto.component.html',
  styleUrls: ['./carga-producto.component.css']
})
export class CargaProductoComponent implements OnInit {
  cargaProductoForm!: FormGroup;
  selectedFile: File | null = null;
  listaFabricantes: Fabricante[] = [];

  isSubmitting: boolean = false;
  isEditMode: boolean = false;

  originalFormValues: any;
  idProducto: string | null = null;
  productoSeleccionado: string | null = null;

  public FileType2LabelMapping = FileType2LabelMapping;
  public fileTypes = Object.values(CategoriaProductos);

  constructor(
    private formBuilder: FormBuilder,
    private apiService: CargaProductoService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    // Se comprueba si el componente está en modo edición
    this.idProducto = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.idProducto;

    this.cargaProductoForm = this.formBuilder.group({
      fieldCodigo: ['', Validators.required],
      fieldFabricante: ['', Validators.required],
      fieldValor: ['', [Validators.required, Validators.min(0)]],
      fieldFechaVencimiento: [null, Validators.required],
      fieldCondicionesAlmacenamiento: ['', Validators.required],
      fieldCategoria: ['', Validators.required],
      fieldCaracteristicas: ['', Validators.required],
      fieldDescripcion: ['', Validators.required],
      fieldNombre: ['', Validators.required]
      }
    );

    if(this.isEditMode){
      this.cargarInformacionProducto();
    }

    this.apiService.getListaFabricantes().subscribe({
      next: (response: FabricantesResponse) => {
        this.listaFabricantes = response.providers;
      },
      error: (err) => {
        console.error('Error loading providers:', err);
      }
    });
  }

  cargarInformacionProducto(): void {
      this.apiService.getProductos().pipe(
        map((productos: ProductosResponse) => productos.products.find((p: Producto) => p.id === this.idProducto)))
        .subscribe({
          next: (producto) => {
            if (!producto) {
              console.error("Product not found");
              return ;
            }

            this.originalFormValues = {
              ...producto,
            };

            this.cargaProductoForm.patchValue({
              fieldCodigo: producto.sku,
              fieldFabricante: producto.provider_id,
              fieldValor: producto.unit_value,
              fieldFechaVencimiento: new Date(producto.estimated_delivery_time),
              fieldCondicionesAlmacenamiento: producto.storage_conditions,
              fieldCategoria: producto.category.charAt(0).toUpperCase() + producto.category.slice(1).toLowerCase(),
              fieldCaracteristicas: producto.product_features,
              fieldDescripcion: producto.description,
              fieldNombre: producto.name
            });
      
            this.selectedFile = null;
          },
          error: (err) => {
            console.error("Error loading product:", err);
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
        imageFile: this.selectedFile,
        id: this.idProducto
      }

      if (formData.fieldFechaVencimiento) {
        formData.fieldFechaVencimiento = this.formatDateToISOWithTime(formData.fieldFechaVencimiento);
      }

      const apiCall$ = this.isEditMode
        ? this.apiService.updateProducto(formData)
        : this.apiService.postData(formData);

      apiCall$.then(apiObservable$ => {
        apiObservable$.subscribe({
          next: (response) => {
            console.log("Success!", response);
            this.isSubmitting = false;

            alert(`Producto ${this.isEditMode ? 'actualizado': 'creado'} correctamente!`);
          },
          error: (err) => {
            console.error('API error: ', err);
            this.isSubmitting = false;
            alert('Error al procesar la solicitud');
          }
        });
      })
      .catch(error => {
        console.error('Image processing error:', error);
        this.isSubmitting = false;
        alert('Error procesando la imagen cargada')
      });
    }
  }

  clearAll(){
    if (this.isEditMode && this.originalFormValues) {
      this.cargaProductoForm.patchValue({
      });
      this.selectedFile = null;
    } else {
      this.cargaProductoForm.reset();
      this.selectedFile = null;
    }

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

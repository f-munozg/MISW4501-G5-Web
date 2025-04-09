import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileType2LabelMapping, CategoriaProductos } from './productos-categoria.enum';
import { ConsultaInventarioService } from './consulta-inventario.service';

export interface TableRow {
  warehouse: string;
  stock: string;
  estimated_delivery_time: string; // Revisar si es el type adecuado
  date_update: string; // Revisar si es el type adecuado
  product: string;
  category: string;
}

@Component({
  selector: 'app-consulta-inventario',
  standalone: false,
  templateUrl: './consulta-inventario.component.html',
  styleUrls: ['./consulta-inventario.component.css'],
})
export class ConsultaInventarioComponent implements OnInit {
  consultaInventarioForm!: FormGroup;

  public FileType2LabelMapping = FileType2LabelMapping;
  public fileTypes = Object.values(CategoriaProductos);

  tableData: TableRow[] = [];

  tableColumns = [
    { 
      name: 'warehouse', 
      header: 'Bodega', 
      cell: (item: TableRow) => item.warehouse 
    },
    { 
      name: 'stock', 
      header: 'Stock (Unidades)', 
      cell: (item: TableRow) => item.stock 
    },
    { 
      name: 'estimated_delivery_time', 
      header: 'Fecha Estimada Reposición', 
      cell: (item: TableRow) => item.estimated_delivery_time
    },
    { 
      name: 'date_update', 
      header: 'Última Actualización', 
      cell: (item: TableRow) => item.date_update 
    },
  ];
  
  visibleColumns = ['warehouse', 'stock', 'estimated_delivery_time', 'date_update'];

  selectedValue!: string; // Debe ser revisado, selectedValue es temporal

  categorias: any[] = []; // any debe ser cambiado cuando se implemente el servicio del cual lea.

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ConsultaInventarioService
  ) { }

  ngOnInit() {
    this.consultaInventarioForm = this.formBuilder.group({
      fieldProducto: ['', Validators.required],
      fieldFabricante: [''],
      fieldCategoria: ['']
    })
  }

  onSubmit() {
    if (this.consultaInventarioForm.valid) {
      const formData = {
        ...this.consultaInventarioForm.value
      }

    this.apiService.getData(formData).subscribe(
      response => {
        console.log('API Response:', response); // Check entire response
        console.log('Result Data:', response.result); // Verify array structure
        this.tableData = response.result.map((item: any) => ({
          ...item,
          // Ensure all required fields are present
          warehouse: item.warehouse || '',
          stock: item.stock || '',
          estimated_delivery_time: item.estimated_delivery_time || '',
          date_update: item.date_update || '',
          product: item.product || '',
          category: item.category || ''
      }));
         console.log('Processed Table Data:', this.tableData); // Verify final data
      },
      error => {
        console.error('Error!', error);
      }
    )
      
    }
  }

}

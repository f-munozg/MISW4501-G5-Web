import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiResponse, ProductInventoryItem } from '../inventario.model'
import { ConsultaProductoBodegaService } from './consulta-producto-bodega.service';

export interface TableRow {
  product: string,
  sku: string,
  quantity: number,
  location: string,
  status: string
}

@Component({
  selector: 'app-consulta-producto-bodega',
  standalone: false,
  templateUrl: './consulta-producto-bodega.component.html',
  styleUrls: ['./consulta-producto-bodega.component.css']
})
export class ConsultaProductoBodegaComponent implements OnInit {
  consultaProductoBodegaForm!: FormGroup;
  listaBodegas: any;
  
  tableData: TableRow[] = [];

  tableColumns = [
    { 
      name: 'location', 
      header: 'Ubicación en Bodega', 
      cell: (item: TableRow) => item.location.toString()
    },
    { 
      name: 'quantity', 
      header: 'Cantidad Disponible', 
      cell: (item: TableRow) => item.quantity.toString() 
    },
    { 
      name: 'status', 
      header: 'Estado', 
      cell: (item: TableRow) => item.status.toString()
    },
  ];

  visibleColumns = ['location', 'quantity', 'status'];


  selectedValue!: string; // Debe ser revisado, selectedValue es temporal

  bodegas: any[] = []; // any debe ser cambiado cuando se implemente el servicio del cual lea.

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ConsultaProductoBodegaService
  ) { }

  ngOnInit() {
    this.consultaProductoBodegaForm = this.formBuilder.group({
      fieldProducto: ['', Validators.required],
      fieldBodega: ['']
    });

    this.apiService.getListaBodegas().subscribe(data => {this.listaBodegas = data})
  }

  onSubmit() {
    if (this.consultaProductoBodegaForm.valid) {
          const formData = {
            ...this.consultaProductoBodegaForm.value
          }
    
        this.apiService.getData(formData).subscribe(
          (response: ApiResponse<ProductInventoryItem>) => { this.tableData = response.results},
          error => console.log(error)
          )
        }
  }

}

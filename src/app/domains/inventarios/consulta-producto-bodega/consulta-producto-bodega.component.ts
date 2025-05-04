import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiResponse, ProductInventoryItem } from '../inventario.model'
import { Bodega, BodegasResponse } from '../../bodegas/bodegas.model';
import { ConsultaProductoBodegaService } from './consulta-producto-bodega.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  listaBodegas: Bodega[] = [];
  
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

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ConsultaProductoBodegaService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.consultaProductoBodegaForm = this.formBuilder.group({
      fieldProducto: ['', Validators.required],
      fieldBodega: ['']
    });

    this.apiService.getListaBodegas().subscribe({
      next: (response: BodegasResponse) => {
        this.listaBodegas = response.Warehouses;
      },
      error: (err) => {
        console.error('Error loading warehouses:', err);
      }
    });
  
    this.route.queryParams.subscribe(params => {
      this.consultaProductoBodegaForm.patchValue({
        fieldProducto: params['product'] || '',
        fieldBodega: params['warehouse_id'] || ''
      });
    });

  }

  onSubmit() {
    if (this.consultaProductoBodegaForm.invalid) {
      return;
    }

    this.updateUrlWithParams();

    if (this.consultaProductoBodegaForm.valid) {
          const formData = {
            ...this.consultaProductoBodegaForm.value
          }
    
        this.apiService.getData(formData).subscribe(
          (response: ApiResponse<ProductInventoryItem>) => { this.tableData = response.results},
          error => console.log(error)
          )
        }
  };

  private updateUrlWithParams() {
    const formValues = this.consultaProductoBodegaForm.value;
    const queryParams: any = {
      product: formValues.fieldProducto
    };

    if (formValues.fieldBodega) {
      queryParams.warehouse_id = formValues.fieldBodega;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });
  }


}

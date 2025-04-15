import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileType2LabelMapping, CategoriaProductos, ApiResponse, InventoryItem, Fabricante, FabricantesResponse } from '../inventario.model';
import { ConsultaInventarioService } from './consulta-inventario.service';
import { ActivatedRoute, Router } from '@angular/router';

export interface TableRow {
  warehouse: string;
  product: string;
  category: string;
  quantity: number;
  estimated_delivery_time: string;
  date_update: string;
}

@Component({
  selector: 'app-consulta-inventario',
  standalone: false,
  templateUrl: './consulta-inventario.component.html',
  styleUrls: ['./consulta-inventario.component.css'],
})
export class ConsultaInventarioComponent implements OnInit {
  consultaInventarioForm!: FormGroup;
  listaFabricantes: Fabricante[] = [];

  public FileType2LabelMapping = FileType2LabelMapping;
  public fileTypes = Object.values(CategoriaProductos);

  tableData: TableRow[] = [];

  tableColumns = [
    { 
      name: 'warehouse', 
      header: 'Bodega', 
      cell: (item: TableRow) => item.warehouse.toString() 
    },
    { 
      name: 'stock', 
      header: 'Stock (Unidades)', 
      cell: (item: TableRow) => item.quantity.toString()
    },
    { 
      name: 'estimated_delivery_time', 
      header: 'Fecha Estimada Reposición', 
      cell: (item: TableRow) => item.estimated_delivery_time.toString()
    },
    { 
      name: 'date_update', 
      header: 'Última Actualización', 
      cell: (item: TableRow) => item.date_update.toString() 
    },
  ];
  
  visibleColumns = ['warehouse', 'stock', 'estimated_delivery_time', 'date_update'];

  selectedValue!: string; // Debe ser revisado, selectedValue es temporal

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ConsultaInventarioService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.consultaInventarioForm = this.formBuilder.group({
      fieldProducto: ['', Validators.required],
      fieldFabricante: [''],
      fieldCategoria: ['']
    });

    this.apiService.getListaFabricantes().subscribe({
      next: (response: FabricantesResponse) => {
        this.listaFabricantes = response.providers;
      },
      error: (err) => {
        console.error('Error loading providers:', err);
      }
    });

    this.route.queryParams.subscribe(params => {
      this.consultaInventarioForm.patchValue({
        fieldProducto: params['product'] || '',
        fieldFabricante: params['provider'] || '',
        fieldCategoria: params['category'] || ''
      });
    });
  }

  onSubmit() {
    if (this.consultaInventarioForm.invalid) {
      return;
    }

    this.updateUrlWithParams();

    if (this.consultaInventarioForm.valid) {
      const formData = {
        ...this.consultaInventarioForm.value
      }

    this.apiService.getData(formData).subscribe(
      (response: ApiResponse<InventoryItem>) => { this.tableData = response.results},
      error => console.log(error)
      )
    }
  }

  private updateUrlWithParams() {
    const formValues = this.consultaInventarioForm.value;
    const queryParams: any = {
      product: formValues.fieldProducto
    };

    if (formValues.fieldFabricante) {
      queryParams.provider = formValues.fieldFabricante
    }

    if (formValues.fieldCategoria) {
      queryParams.category = formValues.fieldCategoria;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });
  }

}

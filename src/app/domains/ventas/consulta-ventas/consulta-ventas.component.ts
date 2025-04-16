import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileType2LabelMapping, CategoriaProductos, Fabricante, FabricantesResponse, Producto, ProductosResponse } from '../ventas.model';
import { ConsultaVentasService } from './consulta-ventas.service';
import { ActivatedRoute, Router } from '@angular/router';

export interface TableRow {
  id: string;
  name: string;
  total_quantity: number;
  unit_value: number;
  /* Hacen falta la fecha de venta
  date_order: string;
  */
}

@Component({
  selector: 'app-consulta-ventas',
  standalone: false,
  templateUrl: './consulta-ventas.component.html',
  styleUrls: ['./consulta-ventas.component.css']
})
export class ConsultaVentasComponent implements OnInit {
  consultaVentasForm!: FormGroup;
  listaFabricantes: Fabricante[] = [];
  listaProductos: Producto[] = [];

  public FileType2LabelMapping = FileType2LabelMapping;
  public fileTypes = Object.values(CategoriaProductos);

  tableData: TableRow[] = [];

  tableColumns = [
    /*
    {
      name: 'fecha',
      header: 'Fecha',
      cell: (item: any) => item.date_order.toString()
    },
    */
    { 
      name: 'name', 
      header: 'Producto', 
      cell: (item: any) => item.name.toString()
    },
    { 
      name: 'total_quantity', 
      header: 'Unidades Vendidas', 
      cell: (item: any) => item.total_quantity.toString() 
    },
    { 
      name: 'total_value', 
      header: 'Ingresos', 
      cell: (item: any) => (item.total_quantity * item.unit_value).toString() 
    },
  ];

  visibleColumns = [/*date_order,*/ 'name', 'total_quantity', 'total_value'];

  selectedValue!: string; // Debe ser revisado, selectedValue es temporal

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ConsultaVentasService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.consultaVentasForm = this.formBuilder.group({
      fieldProducto: [''],
      fieldFabricante: [''],
      fieldCategoria: [''],
      fieldDesde: [''],
      fieldHasta: ['']
    });

    this.apiService.getListaProductos().subscribe({
      next: (response: ProductosResponse) => {
        this.listaProductos = response.products;
      },
      error: (err) => {
        console.error('Error loading products: ', err)
      }
    });

    this.apiService.getListaFabricantes().subscribe({
      next: (response: FabricantesResponse) => {
        this.listaFabricantes = response.providers;
      },
      error: (err) => {
        console.error('Error loading providers: ', err)
      }
    });

    this.route.queryParams.subscribe(params => {
      this.consultaVentasForm.patchValue({
        fieldProducto: params['product'] || '',
        fieldFabricante: params['provider'] || '',
        fieldCategoria: params['category'] || '',
        fieldDesde: params['initial_date'] || '',
        fieldHasta: params['final_date'] || ''
      });
    });
  }

  onSubmit() {
    if (this.consultaVentasForm.invalid) {
      return;
    }

    this.updateUrlWithParams();

    if (this.consultaVentasForm.valid) {
      const formData = {
        ...this.consultaVentasForm.value
      }
    }
  }

  private updateUrlWithParams() {
    const formValues = this.consultaVentasForm.value;
    const queryParams: any = {
      product: formValues.fieldProducto
    };

    if (formValues.fieldFabricante) {
      queryParams.provider = formValues.fieldFabricante;
    }

    if (formValues.fieldCategoria) {
      queryParams.category = formValues.fieldCategoria;
    }

    if (formValues.fieldDesde) {
      queryParams.initial_date = formValues.fieldDesde;
    }

    if (formValues.fieldHasta) {
      queryParams.final_date = formValues.fieldHasta;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });

  }

}

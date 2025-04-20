import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileType2LabelMapping, CategoriaProductos, Fabricante, FabricantesResponse, Producto, ProductosResponse, Venta } from '../ventas.model';
import { ConsultaVentasService } from './consulta-ventas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { timestamp } from 'rxjs';

export interface TableRow {
  id: string;
  name: string;
  total_quantity: number;
  unit_value: number;
  purchase_date: string;
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
    {
      name: 'purchase_date',
      header: 'Fecha',
      cell: (item: TableRow) => item.purchase_date.toString()
    },
    { 
      name: 'name', 
      header: 'Producto', 
      cell: (item: TableRow) => item.name.toString()
    },
    { 
      name: 'total_quantity', 
      header: 'Unidades Vendidas', 
      cell: (item: TableRow) => item.total_quantity.toString() 
    },
    { 
      name: 'total_value', 
      header: 'Ingresos', 
      cell: (item: TableRow) => (item.unit_value * item.total_quantity).toFixed(2) 
    },
  ];

  visibleColumns = ['purchase_date', 'name', 'total_quantity', 'total_value'];

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

    this.setupDateValidation();

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
      
      const patchValues: any = {};
  
      if (params['initial_date']) {
        if (params['initial_date'].match(/^\d{4}-\d{2}-\d{2}$/)) {
          patchValues.fieldDesde = params['initial_date'];
        } else {
          patchValues.fieldDesde = this.formatDate(new Date(params['initial_date']));
        }
      }

      if (params['final_date']) {
        if (params['final_date'].match(/^\d{4}-\d{2}-\d{2}$/)) {
          patchValues.fieldHasta = params['final_date'];
        } else {
          patchValues.fieldHasta = this.formatDate(new Date(params['final_date']));
        }
      }


      this.consultaVentasForm.patchValue({
        fieldProducto: params['product'] || '',
        fieldFabricante: params['provider'] || '',
        fieldCategoria: params['category'] || '',
        patchValues
      });
    });
  }

  onSubmit() {
    if (this.consultaVentasForm.invalid) {
      return;
    }

    if (this.consultaVentasForm.valid) {
      const formData = {
        ...this.consultaVentasForm.value
      }
    
      if (formData.fieldDesde instanceof Date) {
        formData.fieldDesde = this.formatDate(formData.fieldDesde);
      }
  
      if (formData.fieldHasta instanceof Date) {
        formData.fieldHasta = this.formatDate(formData.fieldHasta);
      }
  
      this.updateUrlWithParams();

      this.apiService.getData(formData).subscribe(
        (response: Venta[]) => { this.tableData = response; console.log(this.tableData) },
        error => console.log(error)
      )
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
      queryParams.initial_date = typeof formValues.fieldDesde === 'string' 
        ? formValues.fieldDesde 
        : this.formatDate(formValues.fieldDesde);
    }

    if (formValues.fieldHasta) {
      queryParams.final_date = typeof formValues.fieldHasta === 'string'
        ? formValues.fieldHasta
        : this.formatDate(formValues.fieldHasta);
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });

  }

  formatDate(date: Date | string): string {
    let d: Date;

    if (!(date instanceof Date)) {
      if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return date;
      }
      d = new Date(date);
      if (isNaN(d.getTime())) {
        throw new Error('Invalid date');
      }
    } else {
      d = date;
    }

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

  private setupDateValidation(): void {
    this.consultaVentasForm.get('fieldDesde')?.valueChanges.subscribe(() => {
      this.validateDates();
    });
    
    this.consultaVentasForm.get('fieldHasta')?.valueChanges.subscribe(() => {
      this.validateDates();
    });
  }

  private validateDates(): void {
    const initialDate = this.consultaVentasForm.get('fieldDesde')?.value;
    const finalDate = this.consultaVentasForm.get('fieldHasta')?.value;

    if (initialDate && finalDate) {
      if (new Date(initialDate) > new Date(finalDate)) {
        this.consultaVentasForm.get('fieldHasta')?.setErrors({ invalidDate: true });
      } else {
        this.consultaVentasForm.get('fieldHasta')?.setErrors(null);
      }
    } else {
      this.consultaVentasForm.get('fieldHasta')?.setErrors(null);
    }
  }

}

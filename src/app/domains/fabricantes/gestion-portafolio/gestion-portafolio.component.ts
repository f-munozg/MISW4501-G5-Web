import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GestionPortafolioService } from './gestion-portafolio.service';
import { Fabricante, FabricantesResponse } from '../../productos/producto.model';

export interface TableRow {
  id: string;
  sku: string;
  name: string;
  unit_value: number;
  storage_conditions: string;
  product_features: string;
  provider_id: string;
  estimated_delivery_time: string;
  photo: string;
  description: string;
  category: string;
}

@Component({
  selector: 'app-gestion-portafolio',
  standalone: false,
  templateUrl: './gestion-portafolio.component.html',
  styleUrls: ['./gestion-portafolio.component.css']
})
export class GestionPortafolioComponent implements OnInit {
  gestionPortafolioForm!: FormGroup;
  listaFabricantes: Fabricante[] = [];

  tableData: TableRow[] = [];

    tableColumns = [
      { 
        name: 'name', 
        header: 'Producto', 
        cell: (item: TableRow) => item.name.toString() 
      },
      { 
        name: 'category', 
        header: 'Categoría', 
        cell: (item: TableRow) => item.category.toString()
      },
      { 
        name: 'description', 
        header: 'Descripción', 
        cell: (item: TableRow) => item.description.toString()
      },
    ];
    
    visibleColumns = ['name', 'category', 'description'];

    assignAction = [
      {
        icon: 'Eliminar',
        tooltip: 'Eliminar',
        action: (row: TableRow) => {}
      }
    ]

  constructor(
    private formBuilder: FormBuilder,
    private apiService: GestionPortafolioService
  ) { }

  ngOnInit() {
    this.gestionPortafolioForm = this.formBuilder.group({
      fieldFabricante: ['', Validators.required]
    });

    this.apiService.getListaFabricantes().subscribe({
      next: (response: FabricantesResponse) => {
        this.listaFabricantes = response.providers;
      },
      error: (err) => {
        console.error('Error loading providers:', err);
      }
    });
  }

}

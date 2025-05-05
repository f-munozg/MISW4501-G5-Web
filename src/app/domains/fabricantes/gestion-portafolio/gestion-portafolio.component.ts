import { Component, OnInit } from '@angular/core';
import { GestionPortafolioService } from './gestion-portafolio.service';
import { Fabricante, FabricantePortafolioResponse, FabricantesResponse } from '../../fabricantes/fabricantes.model';
import { Router, ActivatedRoute } from '@angular/router';

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
  listaFabricantes: Fabricante[] = [];
  idFabricanteSeleccionado: string = '';

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
        icon: 'Editar',
        tooltip: 'Editar',
        action: (row: TableRow) => {}
      },
      {
        icon: 'Eliminar',
        tooltip: 'Eliminar',
        action: (row: TableRow) => {
          this.eliminarProducto(row.id);
        }
      }
    ]

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: GestionPortafolioService
  ) { }

  ngOnInit() {
    this.apiService.getListaFabricantes().subscribe({
      next: (response: FabricantesResponse) => {
        this.listaFabricantes = response.providers;
      },
      error: (err) => {
        console.error('Error loading providers:', err);
      }
    });

    this.route.queryParams.subscribe(params => {
      if (params['provider_id']) {
        this.idFabricanteSeleccionado = params['provider_id'];
      }
    })

    this.conFabricanteSeleccionado(this.idFabricanteSeleccionado);
  }

  conFabricanteSeleccionado(provider_id: string){
    this.apiService.getPortafolio(provider_id).subscribe(
      (response: FabricantePortafolioResponse) => { this.tableData = response.portfolio },
      error => console.log(error)
    )
    
    this.router.navigate([], {
      queryParams: { provider_id },
      queryParamsHandling: 'merge'
    });
  }

  eliminarProducto(product_id: string): void {
    this.apiService.eliminarProducto(product_id).subscribe({
      next: (response) => {
        console.log("Delete successful", response);
      },
      error: (err) => {
        console.error("Error during deletion", err);
      }
    });

    this.refrescarTableData();
  }

  refrescarTableData(): void {
    const currentId = this.route.snapshot.queryParams['provider_id'];
    this.apiService.getPortafolio(currentId).subscribe(
      (response: FabricantePortafolioResponse) => {
        this.tableData = response.portfolio;
        console.log('tableData after refresh:', this.tableData);
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { provider_id: currentId },
          queryParamsHandling: 'merge',
          replaceUrl: true
        });
      },
      error => console.error(error)
    );
  }

}

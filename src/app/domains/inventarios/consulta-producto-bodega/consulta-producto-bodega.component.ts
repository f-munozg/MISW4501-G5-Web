import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-consulta-producto-bodega',
  standalone: false,
  templateUrl: './consulta-producto-bodega.component.html',
  styleUrls: ['./consulta-producto-bodega.component.css']
})
export class ConsultaProductoBodegaComponent implements OnInit {
  tableData = [

  ]

  tableColumns = [
    { 
      name: 'ubicacion_bodega', 
      header: 'Ubicación en Bodega', 
      cell: (item: any) => `${item.ubicacion_bodega}` 
    },
    { 
      name: 'cantidad_disponible', 
      header: 'Cantidad Disponible', 
      cell: (item: any) => item.cantidad_disponible 
    },
    { 
      name: 'estado', 
      header: 'Estado', 
      cell: (item: any) => item.estado
    },
  ];

  visibleColumns = ['ubicacion_bodega', 'cantidad_disponible', 'estado'];


  selectedValue!: string; // Debe ser revisado, selectedValue es temporal

  bodegas: any[] = []; // any debe ser cambiado cuando se implemente el servicio del cual lea.

  constructor() { }
  // constructor(private dataService: YourDataService) {} `Debe ser implementado`

  ngOnInit() {
  }

}

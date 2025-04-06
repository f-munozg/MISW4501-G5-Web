import { Component, OnInit } from '@angular/core';

export interface TableRow {
  bodega: string;
  unidades: string;
  fecha_reposicion: string; // Revisar si es el type adecuado
  ultima_actualizacion: string; // Revisar si es el type adecuado
}

@Component({
  selector: 'app-consulta-inventario',
  standalone: false,
  templateUrl: './consulta-inventario.component.html',
  styleUrls: ['./consulta-inventario.component.css'],
})
export class ConsultaInventarioComponent implements OnInit {
  
  tableData: TableRow[] = [];

  tableColumns = [
    { 
      name: 'bodega', 
      header: 'Bodega', 
      cell: (item: any) => item.bodega 
    },
    { 
      name: 'unidades', 
      header: 'Stock (Unidades)', 
      cell: (item: any) => item.unidades 
    },
    { 
      name: 'fecha_reposicion', 
      header: 'Fecha Estimada Reposición', 
      cell: (item: any) => item.fecha_reposicion
    },
    { 
      name: 'ultima_actualizacion', 
      header: 'Última Actualización', 
      cell: (item: any) => item.ultima_actualizacion 
    },
  ];
  
  visibleColumns = ['bodega', 'unidades', 'fecha_reposicion', 'ultima_actualizacion'];

  selectedValue!: string; // Debe ser revisado, selectedValue es temporal

  categorias: any[] = []; // any debe ser cambiado cuando se implemente el servicio del cual lea.

  constructor() { }

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-consulta-ventas',
  standalone: false,
  templateUrl: './consulta-ventas.component.html',
  styleUrls: ['./consulta-ventas.component.css']
})
export class ConsultaVentasComponent implements OnInit {

  tableData = [

  ]

  tableColumns = [
    { 
      name: 'fecha', 
      header: 'Fecha', 
      cell: (item: any) => `${item.fecha}` 
    },
    { 
      name: 'producto', 
      header: 'Producto', 
      cell: (item: any) => item.producto 
    },
    { 
      name: 'unidades_vendidas', 
      header: 'Unidades Vendidas', 
      cell: (item: any) => item.unidades_vendidas 
    },
    { 
      name: 'ingresos', 
      header: 'Ingresos', 
      cell: (item: any) => item.ingresos 
    },
  ];

  visibleColumns = ['fecha', 'producto', 'unidades_vendidas', 'ingresos'];

  selectedValue!: string; // Debe ser revisado, selectedValue es temporal

  categorias: any[] = []; // any debe ser cambiado cuando se implemente el servicio del cual lea.

  constructor() { }

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registro-vendedores',
  standalone: false,
  templateUrl: './registro-vendedores.component.html',
  styleUrls: ['./registro-vendedores.component.css']
})
export class RegistroVendedoresComponent implements OnInit {
  tableData = [

  ]

  tableColumns = [
    { 
      name: 'nombre_cliente', 
      header: 'Nombre de Cliente', 
      cell: (item: any) => `${item.nombre_cliente}` 
    },
    { 
      name: 'zona', 
      header: 'Zona', 
      cell: (item: any) => item.zona 
    },
  ];

  visibleColumns = ['nombre_cliente', 'zona',];

  assignAction = [
    {
      icon: 'Asignar',
      tooltip: 'Asignar',
      action: () => {}     
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';

export interface TableRow{

}

@Component({
  selector: 'app-reporte-rotacion-inventario',
  standalone: false,
  templateUrl: './reporte-rotacion-inventario.component.html',
  styleUrls: ['./reporte-rotacion-inventario.component.css']
})
export class ReporteRotacionInventarioComponent implements OnInit {

  tableData: TableRow[] = [];

  tableColumns = [
    {
      name: 'one',
      header: 'one',
      cell: (item: any) => item.one.toString()
    },
    {
      name: 'two',
      header: 'two',
      cell: (item: any) => item.two.toString()
    },
    {
      name: 'three',
      header: 'three',
      cell: (item: any) => item.three.toString()
    },
  ]

  visibleColumns = ['one', 'two', 'three']

  constructor() { }

  ngOnInit() {
  }

}

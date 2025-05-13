import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Producto } from '../../productos/producto.model';
import { Observable } from 'rxjs';

export interface TableRow{

}

@Component({
  selector: 'app-reporte-rotacion-inventario',
  standalone: false,
  templateUrl: './reporte-rotacion-inventario.component.html',
  styleUrls: ['./reporte-rotacion-inventario.component.css']
})
export class ReporteRotacionInventarioComponent implements OnInit {
  reporteRotacionInventarioForm!: FormGroup;

  listaProductos: Producto[] = [];

  productosFiltrados!: Observable<Producto[]>;
  
  idProductoSeleccionado: string | null = null;

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

  onSubmit() {
    
  }
}

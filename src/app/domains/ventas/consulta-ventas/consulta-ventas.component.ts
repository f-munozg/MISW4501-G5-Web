import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileType2LabelMapping, CategoriaProductos, Fabricante, FabricantesResponse } from '../ventas.model';
import { ConsultaVentasService } from './consulta-ventas.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-consulta-ventas',
  standalone: false,
  templateUrl: './consulta-ventas.component.html',
  styleUrls: ['./consulta-ventas.component.css']
})
export class ConsultaVentasComponent implements OnInit {
  consultaVentasForm!: FormGroup;
  listaFabricantes: Fabricante[] = [];

  public FileType2LabelMapping = FileType2LabelMapping;
  public fileTypes = Object.values(CategoriaProductos);

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

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ConsultaVentasService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.consultaVentasForm = this.formBuilder.group({
      fieldProducto: ['', Validators.required],
      fieldFabricante: [''],
      fieldCategoria: [''],
      fieldDesde: [''],
      fieldHasta: ['']
    });

    this.apiService.getListaFabricantes().subscribe({
      next: (response: FabricantesResponse) => {
        this.listaFabricantes = response.providers;
      },
      error: (err) => {
        console.error('Error loading providers: ', err)
      }
    })

  }



}

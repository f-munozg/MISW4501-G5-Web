import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { Paises, PaisesType2LabelMapping, ReglaLegal } from '../reglas.model';
import { CategoriaProductos, FileType2LabelMapping } from '../../productos/producto.model';
import { ReglasLegalesService } from './reglas-legales.service';
import { map } from 'rxjs';

export interface TableRow{
  id: string;
  pais: Paises;
  categoria_producto: CategoriaProductos;
  descripcion: string;
}

@Component({
  selector: 'app-reglas-legales',
  standalone: false,
  templateUrl: './reglas-legales.component.html',
  styleUrls: ['./reglas-legales.component.css']
})
export class ReglasLegalesComponent implements OnInit {
  agregarReglaLegalForm!: FormGroup;
  @ViewChild('fieldPais') fieldPais!: MatSelect;
  @ViewChild('fieldCategoriaProducto') fieldCategoriaProducto!: MatSelect;

  filtroPais: string = '';
  filtroCategoriaProducto: string = '';
  reglasFiltradas: ReglaLegal[] = [];

  esModoEdicion: boolean = false;
  cargando: boolean = false;
  enviando: boolean = false;
  
  idReglaLegal: string | null = null;

  mensajeExito: string | null = null;
  mensajeError: string | null = null;

  public PaisesType2LabelMapping = PaisesType2LabelMapping;
  public listaPaises = Object.values(Paises); 

  public FileType2LabelMapping = FileType2LabelMapping;
  public fileTypes = Object.values(CategoriaProductos);

  tableData: TableRow[] = [];

  tableColumns = [
    {
      name: 'country',
      header: 'País',
      cell: (item: any) => item.pais.toString()
    },
    {
      name: 'category_product',
      header: 'Categoría',
      cell: (item: any) => item.categoria_producto.toString()
    },
    {
      name: 'description',
      header: 'Descripción',
      cell: (item: any) => item.descripcion.toString()
    }
  ];

  visibleColumns = ['country', 'category_product', 'description'];

  assignAction = [
    {
      icon: 'Editar',
      tooltip: 'Editar',
      action: (row: TableRow) => {}
    },
    {
      icon: 'Eliminar',
      tooltip: 'Eliminar',
      action: (row: TableRow) => {}
    }
  ]

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ReglasLegalesService,
    private messageBox: MatSnackBar,
    private cdRef: ChangeDetectorRef,
  ) { 
    this.route.queryParams.subscribe(params => {
      this.filtroPais = params['pais'] || '';
      this.filtroCategoriaProducto = params['categoria_producto'] || '';
      if (this.filtroPais || this.filtroCategoriaProducto){
        this.cargarReglas();
      }
    });
  }

  initializeForm(): void {
    this.agregarReglaLegalForm = this.formBuilder.group({
      fieldDescripcion: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.idReglaLegal = this.route.snapshot.paramMap.get('id');
    this.esModoEdicion = !!this.idReglaLegal;

    this.initializeForm();
    this.cargarReglas();
  }

  cargarReglas(): void {
      this.cargando = true;
      this.mensajeError = null;
  
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          pais: this.filtroPais || null,
          tipo_regla_comercial: this.filtroCategoriaProducto || null,
        },
        queryParamsHandling: 'merge'
      });
  
      this.apiService.getListaReglasLegales().pipe(
        map(reglas => this.filtrarReglas(reglas.rules))
      ).subscribe({
        next: (filtrados) => {
          this.reglasFiltradas = filtrados;
          this.actualizarTabla(filtrados);
          this.cargando = false;
        },
        error: (err) => {
          console.error('Error loading rules', err);
          this.mensajeError = 'Error cargando las reglas comerciales';
          this.cargando = false;
        }
      });
  }

  filtrarReglas(reglas: ReglaLegal[]): ReglaLegal[] {
      return reglas.filter(regla => {
        const tipoReglaComercialMatch = !this.filtroCategoriaProducto || regla.categoria_producto.toString() === this.filtroCategoriaProducto;
        const paisMatch = !this.filtroPais || regla.pais.toString() === this.filtroPais;
  
        return tipoReglaComercialMatch && paisMatch;
      });
    }
  
    actualizarTabla(reglas: ReglaLegal[]): void {
      this.tableData = reglas.map(regla => ({
        id: regla.id,
        pais: regla.pais,
        categoria_producto: regla.categoria_producto,
        descripcion: regla.descripcion,
      }));
    }
  
    cambioValoresFiltros(): void {
      this.cargarReglas();
    }
  
    sonFiltrosValidos(): boolean{
      return this.fieldPais?.value != null && this.fieldPais?.value != undefined && this.fieldPais?.value != "" && 
             this.fieldCategoriaProducto?.value != null && this.fieldCategoriaProducto?.value != undefined && this.fieldCategoriaProducto?.value != "";
    }

  onSubmit(){

  }

  clearAll(): void {

  }
}

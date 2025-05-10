import { Component, OnInit } from '@angular/core';
import { Paises, PaisesType2LabelMapping, TipoImpuesto, TipoImpuesto2LabelMapping, ReglaTributariaResponse, ReglaTributaria } from '../reglas.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReglasTributariasService } from './reglas-tributarias.service';
import { map } from 'rxjs';

export interface TableRow {
  id: string;
  pais: Paises;
  tipo_impuesto: TipoImpuesto;
  valor: number;
  descripcion: string;
}

@Component({
  selector: 'app-reglas-tributarias',
  standalone: false,
  templateUrl: './reglas-tributarias.component.html',
  styleUrls: ['./reglas-tributarias.component.css']
})
export class ReglasTributariasComponent implements OnInit {
  agregarReglaTributariaForm!: FormGroup;

  filtroPais: string = '';
  filtroTipoImpuesto: string = "";
  reglasFiltradas: ReglaTributaria[] = [];

  public PaisesType2LabelMapping = PaisesType2LabelMapping;
  public listaPaises = Object.values(Paises); 

  public TipoImpuesto2LabelMapping = TipoImpuesto2LabelMapping;
  public listaTiposImpuestos = Object.values(TipoImpuesto);

  tableData: TableRow[] = [];

  tableColumns = [
    {
      name: 'country',
      header: 'País',
      cell: (item: any) => item.pais.toString()
    },
    {
      name: 'tax_type',
      header: 'Tipo Impuesto',
      cell: (item: any) => item.tipo_impuesto.toString()
    },
    {
      name: 'tax_value',
      header: 'Valor',
      cell: (item: any) => item.valor.toString()
    },
  ];

  visibleColumns = ['country', 'tax_type', 'tax_value'];

  assignAction = [
    {
      icon: 'Editar',
      tooltip: 'Editar',
      action: (row: any) => {}
    },
    {
      icon: 'Eliminar',
      tooltip: 'Eliminar',
      action: (row: TableRow) => {
        this.eliminarTributo(row.id);
      }
    }
  ]

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ReglasTributariasService,
  ) {
    this.route.queryParams.subscribe(params => {
      this.filtroPais = params['pais'] || '';
      this.filtroTipoImpuesto = params['tipo_impuesto'] || '';
      if (this.filtroPais || this.filtroTipoImpuesto){
        this.cargarReglas();
      }
    });
   }

  initializeForm(): void {
    this.agregarReglaTributariaForm = this.formBuilder.group({
      fieldDescripcion: ['', Validators.required],
      fieldValor: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    this.initializeForm();
    this.cargarReglas();
  }

  cargarReglas(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        pais: this.filtroPais || null,
        tipo_impuesto: this.filtroTipoImpuesto || null,
      },
      queryParamsHandling: 'merge'
    });

    this.apiService.getListaTributos().pipe(
      map(reglas => this.filtrarReglas(reglas.rules))
    ).subscribe({
      next: (filtrados) => {
        this.reglasFiltradas = filtrados;
        this.actualizarTabla(filtrados);
      },
      error: (err) => console.error('Error loading rules:', err)
    });
  }

  private filtrarReglas(reglas: ReglaTributaria[]): ReglaTributaria[] {
    return reglas.filter(regla => {
      const tipoImpuestoMatch = !this.filtroTipoImpuesto || regla.tipo_impuesto.toString() === this.filtroTipoImpuesto;
      const paisMatch = !this.filtroPais || regla.pais.toString() === this.filtroPais;

      return tipoImpuestoMatch && paisMatch;
    });
  }

  private actualizarTabla(reglas: ReglaTributaria[]): void {
    this.tableData = reglas.map(regla => ({
      id: regla.id,
      pais: regla.pais,
      tipo_impuesto: regla.tipo_impuesto,
      valor: regla.valor,
      descripcion: regla.descripcion,
    }));
  }

  cambioValoresFiltros(): void {
    this.cargarReglas();
  }

  eliminarTributo(regla_id: string): void {
    this.apiService.eliminarTributo(regla_id).subscribe({
      next: (response) => {
        console.log("Delete successful", response);
      },
      error: (err) => {
        console.error("Error during deletion", err);
      }
    })

    this.cargarReglas();
  }

  onSubmit(){

  }
}

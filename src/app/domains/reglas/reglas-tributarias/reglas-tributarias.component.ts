import { Component, OnInit, ViewChild } from '@angular/core';
import { Paises, PaisesType2LabelMapping, TipoImpuesto, TipoImpuesto2LabelMapping, ReglaTributariaResponse, ReglaTributaria } from '../reglas.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReglasTributariasService } from './reglas-tributarias.service';
import { map } from 'rxjs';
import { MatSelect } from '@angular/material/select';

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
  @ViewChild('fieldPais') fieldPais!: MatSelect;
  @ViewChild('fieldTipoImpuesto') fieldTipoImpuesto!: MatSelect;

  filtroPais: string = '';
  filtroTipoImpuesto: string = "";
  reglasFiltradas: ReglaTributaria[] = [];

  esModoEdicion: boolean = false;

  idTributo: string | null = null;

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
      action: (row: TableRow) => {
        this.editarTributo(row.id)
      }
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
    this.idTributo = this.route.snapshot.paramMap.get('id');
    this.esModoEdicion = !!this.idTributo;

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

  sonFiltrosValidos(): boolean{
    return this.fieldPais?.value != null && this.fieldPais?.value != undefined && this.fieldPais?.value != "" && 
           this.fieldTipoImpuesto?.value != null && this.fieldTipoImpuesto?.value != undefined && this.fieldTipoImpuesto?.value != "";
  }

  cargarInformacionRegla(): void {

  }

  editarTributo(regla_id: string): void {
    const regla = this.reglasFiltradas.find(r => r.id === regla_id);
  
    if (regla) {
      this.idTributo = regla_id;
      this.esModoEdicion = true;
      
      this.agregarReglaTributariaForm.patchValue({
        fieldDescripcion: regla.descripcion,
        fieldValor: regla.valor
      });
      
      this.fieldPais.writeValue(regla.pais);
      this.fieldTipoImpuesto.writeValue(regla.tipo_impuesto);
    }
  }

  eliminarTributo(regla_id: string): void {
    this.apiService.eliminarTributo(regla_id).subscribe({
      next: (response) => {
        this.cargarReglas();
        console.log("Delete successful", response);
      },
      error: (err) => {
        console.error("Error during deletion", err);
      }
    })
  }

  onSubmit(){
    if (this.agregarReglaTributariaForm.valid && 
      this.filtroPais != '' && this.filtroTipoImpuesto != '' ){
        const formData = {
          ...this.agregarReglaTributariaForm.value,
          fieldPais: this.fieldPais.value,
          fieldTipoImpuesto: this.fieldTipoImpuesto.value
        }

      if (this.esModoEdicion && this.idTributo) {
        // Acá se actualiza una regla tributaria existente
        formData.id = this.idTributo;
        this.apiService.updateTributo(formData).subscribe(
          response => {
            this.limpiarEdicion();
            console.log('Update successful', response);
          },
          error => {
            console.error('Error updating:', error)
          }
        );
      } else {
          // Acá se crea una nueva regla tributaria
          this.apiService.postData(formData).subscribe(
            response => {
              this.cargarReglas();
              this.agregarReglaTributariaForm.reset();
              console.log('Success!', response);
            },
            error => {
              console.error('Error!', error);
            }
          )
      }
    }
  }

  limpiarEdicion(): void {
    this.agregarReglaTributariaForm.reset();
    this.esModoEdicion = false;
    this.idTributo = null;
    this.cargarReglas();
  }

  clearAll(): void {
    
  }
}

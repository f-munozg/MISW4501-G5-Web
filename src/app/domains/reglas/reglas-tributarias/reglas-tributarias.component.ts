import { Component, OnInit, ViewChild, ChangeDetectorRef} from '@angular/core';
import { Paises, PaisesType2LabelMapping, TipoImpuesto, TipoImpuesto2LabelMapping, ReglaTributariaResponse, ReglaTributaria } from '../reglas.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  @ViewChild('fieldPais') fieldPais!: MatSelect;
  @ViewChild('fieldTipoImpuesto') fieldTipoImpuesto!: MatSelect;

  filtroPais: string = '';
  filtroTipoImpuesto: string = "";
  reglasFiltradas: ReglaTributaria[] = [];

  esModoEdicion: boolean = false;
  cargando: boolean = false;
  enviando: boolean = false;

  idTributo: string | null = null;

  mensajeExito: string | null = null;
  mensajeError: string | null = null;

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
        if (this.sonFiltrosValidos()) {  // Reuse your existing validation method
          this.editarTributo(row.id);
        } else {
          this.mostrarAlertaFiltros();
        }  
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
    private messageBox: MatSnackBar,
    private cdRef: ChangeDetectorRef,
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
    this.cargando = true;
    this.mensajeError = null;

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
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error loading rules:', err);
        this.mensajeError = 'Error cargando las reglas tributarias'
        this.cargando = false;
      }
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

  // Carga el producto a editar, la edición se maneja en onSubmit()
  editarTributo(regla_id: string): void {
    if (!this.sonFiltrosValidos()) {
      this.mostrarAlertaFiltros();
      return;
    }

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

      this.fieldPais.disabled = true;
      this.fieldTipoImpuesto.disabled = true;
    }
  }

  puedeEditar(): boolean {
    return this.fieldPais?.value && 
           this.fieldTipoImpuesto?.value &&
           this.fieldPais.value !== '' && 
           this.fieldTipoImpuesto.value !== '';
  }

  eliminarTributo(regla_id: string): void {
    if (confirm('¿Está seguro de querer eliminar la regla tributaria?')) {
      this.cargando = true;
      this.apiService.eliminarTributo(regla_id).subscribe({
        next: (response) => {
          this.cargarReglas();
          console.log("Delete successful", response);
          this.mostrarMensajeExito('Regla tributaria eliminada exitosamente');
          this.enviando = false;
        },
        error: (err) => {
          console.error("Error during deletion", err);
          this.mostrarMensajeError('Error eliminando la regla tributaria');
          this.cargando = false;
        }
      });
    }
  }

  onSubmit(){
    if (this.enviando) return;

    if (this.agregarReglaTributariaForm.valid && 
      this.filtroPais != '' && this.filtroTipoImpuesto != '' ){
        this.enviando = true;
        this.mensajeError = null;

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
              this.mostrarMensajeExito('Regla tributaria actualizada con éxito');
              console.log('Update successful', response);
              this.enviando = false;
            },
            error => {
              console.error('Error updating:', error);
              this.mostrarMensajeError('Error al actualizar la regla tributaria');
              this.enviando = false;
            }
          );
        } else {
            // Acá se crea una nueva regla tributaria
            this.apiService.postData(formData).subscribe(
              response => {
                this.cargarReglas();
                this.mostrarMensajeExito('Regla tributaria creada exitosamente');
                this.agregarReglaTributariaForm.reset();
                console.log('Success!', response);
                this.enviando = false;
              },
              error => {
                console.error('Error!', error);
                this.mostrarMensajeError('Error creando la regla tributaria');
                this.enviando = false;
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

    this.fieldPais.disabled = false;
    this.fieldTipoImpuesto.disabled = false;
    
    this.cdRef.detectChanges();
    
    this.cargarReglas();
  }

  clearAll(): void {
    this.agregarReglaTributariaForm.reset();
  
    if (!this.fieldPais.disabled) {
      this.fieldPais.writeValue('');
    }
    if (!this.fieldTipoImpuesto.disabled) {
      this.fieldTipoImpuesto.writeValue('');
    }
    
    if (this.esModoEdicion) {
      this.esModoEdicion = false;
      this.idTributo = null;
      
      this.fieldPais.disabled = false;
      this.fieldTipoImpuesto.disabled = false;
    }
    
    this.filtroPais = '';
    this.filtroTipoImpuesto = '';
    this.cargarReglas();
    
    this.mensajeExito = null;
    this.mensajeError = null;

    this.cdRef.detectChanges();
  }

  private mostrarMensajeExito(mensaje: string): void {
    this.mensajeExito = mensaje;
    this.messageBox.open(mensaje, 'Cerrar', {
      duration: 5000,
      panelClass: ['snackbar-success']
    });
    setTimeout(() => this.mensajeExito = null, 5000);
  }

  private mostrarMensajeError(mensaje: string): void {
    this.mensajeError = mensaje;
    this.messageBox.open(mensaje, 'Cerrar', {
      duration: 5000,
      panelClass: ['snackbar-error']
    });
  }

  private mostrarAlertaFiltros(): void {
    this.messageBox.open(
      'Seleccione País y Tipo de Impuesto antes de editar', 
      'Cerrar', 
      { duration: 3000, panelClass: ['snackbar-warning'] }
    );
  }
}

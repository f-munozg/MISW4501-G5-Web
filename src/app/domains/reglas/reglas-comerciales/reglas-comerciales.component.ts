import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Paises, PaisesType2LabelMapping, ReglaComercial, TipoReglaComercial, TipoReglaComercial2LabelMapping } from '../reglas.model';
import { ReglasComercialesService } from './reglas-comerciales.service';
import { map } from 'rxjs';


export interface TableRow {
  id: string;
  pais: Paises;
  tipo_regla_comercial: TipoReglaComercial;
  descripcion: string;
}

@Component({
  selector: 'app-reglas-comerciales',
  standalone: false,
  templateUrl: './reglas-comerciales.component.html',
  styleUrls: ['./reglas-comerciales.component.css']
})
export class ReglasComercialesComponent implements OnInit {
  agregarReglaComercialForm!: FormGroup;
  @ViewChild('fieldPais') fieldPais!: MatSelect;
  @ViewChild('fieldTipoReglaComercial') fieldTipoReglaComercial!: MatSelect;

  filtroPais: string = '';
  filtroTipoReglaComercial: string = "";
  reglasFiltradas: ReglaComercial[] = [];

  esModoEdicion: boolean = false;
  cargando: boolean = false;
  enviando: boolean = false;

  idReglaComercial: string | null = null;

  mensajeExito: string | null = null;
  mensajeError: string | null = null;

  public PaisesType2LabelMapping = PaisesType2LabelMapping;
  public listaPaises = Object.values(Paises); 

  public TipoReglaComercial2LabelMapping = TipoReglaComercial2LabelMapping;
  public listaTiposReglasComerciales = Object.values(TipoReglaComercial);

  tableData: TableRow[] = [];

  tableColumns = [
    {
      name: 'country',
      header: 'País',
      cell: (item: any) => item.pais.toString()
    },
    {
      name: 'type_commercial_rule',
      header: 'Regla',
      cell: (item: any) => item.tipo_regla_comercial.toString()
    },
    {
      name: 'description',
      header: 'Descripción',
      cell: (item: any) => item.descripcion.toString()
    },
  ];

  visibleColumns = ['country', 'type_commercial_rule', 'description'];

  assignAction = [
    {
      icon: 'Editar',
      tooltip: 'Editar',
      action: (row: TableRow) => {
        if (this.sonFiltrosValidos()) {
          this.editarReglaComercial(row.id);
        } else {
          this.mostrarAlertaFiltros();
        }  
      }
    },
    {
      icon: 'Eliminar',
      tooltip: 'Eliminar',
      action: (row: TableRow) => {
        this.eliminarReglaComercial(row.id);
      }
    }
  ]

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ReglasComercialesService,
    private messageBox: MatSnackBar,
    private cdRef: ChangeDetectorRef,
  ) { 
    this.route.queryParams.subscribe(params => {
      this.filtroPais = params['pais'] || '';
      this.filtroTipoReglaComercial = params['tipo_regla_comercial'] || '';
      if (this.filtroPais || this.filtroTipoReglaComercial){
        this.cargarReglas();
      }
    });
  }

  initializeForm(): void {
    this.agregarReglaComercialForm = this.formBuilder.group({
      fieldDescripcion: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.idReglaComercial = this.route.snapshot.paramMap.get('id');
    this.esModoEdicion = !!this.idReglaComercial;

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
        tipo_regla_comercial: this.filtroTipoReglaComercial || null,
      },
      queryParamsHandling: 'merge'
    });

    this.apiService.getListaReglasComerciales().pipe(
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

  filtrarReglas(reglas: ReglaComercial[]): ReglaComercial[] {
    return reglas.filter(regla => {
      const tipoReglaComercialMatch = !this.filtroTipoReglaComercial || regla.tipo_regla_comercial.toString() === this.filtroTipoReglaComercial;
      const paisMatch = !this.filtroPais || regla.pais.toString() === this.filtroPais;

      return tipoReglaComercialMatch && paisMatch;
    });
  }

  actualizarTabla(reglas: ReglaComercial[]): void {
    this.tableData = reglas.map(regla => ({
      id: regla.id,
      pais: regla.pais,
      tipo_regla_comercial: regla.tipo_regla_comercial,
      descripcion: regla.descripcion,
    }));
  }

  cambioValoresFiltros(): void {
    this.cargarReglas();
  }

  sonFiltrosValidos(): boolean{
    return this.fieldPais?.value != null && this.fieldPais?.value != undefined && this.fieldPais?.value != "" && 
           this.fieldTipoReglaComercial?.value != null && this.fieldTipoReglaComercial?.value != undefined && this.fieldTipoReglaComercial?.value != "";
  }

  // Carga la regla comercial a editar, la edición se maneja en onSubmit()
  editarReglaComercial(regla_id: string): void {
    if (!this.sonFiltrosValidos()){
      this.mostrarAlertaFiltros();
      return;
    }

    const regla = this.reglasFiltradas.find(r => r.id === regla_id);

    if (regla) {
      this.idReglaComercial = regla_id;
      this.esModoEdicion = true;

      this.agregarReglaComercialForm.patchValue({
        fieldDescripcion: regla.descripcion
      });

      this.fieldPais.writeValue(regla.pais);
      this.fieldTipoReglaComercial.writeValue(regla.tipo_regla_comercial);

      this.fieldPais.disabled = true;
      this.fieldTipoReglaComercial.disabled = true;
    }
  }

  puedeEditar(): boolean {
    const tienePais = this.fieldPais?.value !== null &&
                      this.fieldPais?.value !== undefined &&
                      this.fieldPais?.value !== '';

    const tieneTipoReglaComercial = this.fieldTipoReglaComercial?.value !== null &&
                                    this.fieldTipoReglaComercial?.value !== undefined &&
                                    this.fieldTipoReglaComercial?.value !== '';

    return tienePais && tieneTipoReglaComercial;
  }

  eliminarReglaComercial(regla_id: string): void {
    if (confirm('¿Está segudo de querer eliminar la regla comercial')) {
      this.cargando = true;
      this.apiService.eliminarReglaComercial(regla_id).subscribe({
        next: (response) => {
          this.cargarReglas();
          console.log("Delete successful", response);
          this.mostrarMensajeExito('Regla comercial eliminada exitosamente');
          this.enviando = false;
        },
        error: (err) => {
          console.error("Error during deletion", err);
          this.mostrarMensajeError('Error eliminando la regla comercial');
          this.cargando = false;
        }
      });
    }
  }

  onSubmit() {
    if (this.enviando) return;

    if (this.agregarReglaComercialForm.valid && 
        this.filtroPais != '' && this.filtroTipoReglaComercial != '') {
          this.enviando = true;
          this.mensajeError = null;

          const formData = {
            ...this.agregarReglaComercialForm.value,
            fieldPais: this.fieldPais.value,
            fieldTipoReglaComercial: this.fieldTipoReglaComercial.value
          }

          if (this.esModoEdicion && this.idReglaComercial) {
            // Acá se actualiza una regla comercial existente
            formData.id = this.idReglaComercial;
            this.apiService.updateReglaComercial(formData).subscribe(
              response => {
                this.limpiarEdicion();
                this.mostrarMensajeExito('Regla comercial actualizada con éxito');
                console.log('Update successful', response);
                this.enviando = false;
              },
              error => {
                console.error('Error updating:', error);
                this.mostrarMensajeError('Error al actualizar la regla comercial');
                this.enviando = false;
              }
            );
          } else {
              // Acá se crea una nueva regla comercial
              this.apiService.postData(formData).subscribe(
                response => {
                  this.cargarReglas();
                  this.mostrarMensajeExito('Regla comercial creada exitosamente');
                  this.agregarReglaComercialForm.reset();
                  console.log('Success!', response);
                  this.enviando = false;
                },
                error => {
                  console.error('Error!', error);
                  this.mostrarMensajeError('Error creando la regla comercial');
                  this.enviando = false;
                }
              )
          }
        }
    
  }

  limpiarEdicion(): void {
    this.agregarReglaComercialForm.reset();
    this.esModoEdicion = false;
    this.idReglaComercial = null;
    this.cargarReglas();

    this.fieldPais.disabled = false;
    this.fieldTipoReglaComercial.disabled = false;
    
    this.cdRef.detectChanges();
    
    this.cargarReglas();
  }

  clearAll(): void {
    this.agregarReglaComercialForm.reset();
  
    if (!this.fieldPais.disabled) {
      this.fieldPais.writeValue('');
    }
    if (!this.fieldTipoReglaComercial.disabled) {
      this.fieldTipoReglaComercial.writeValue('');
    }
    
    if (this.esModoEdicion) {
      this.esModoEdicion = false;
      this.idReglaComercial = null;
      
      this.fieldPais.disabled = false;
      this.fieldTipoReglaComercial.disabled = false;
    }
    
    this.filtroPais = '';
    this.filtroTipoReglaComercial = '';
    this.cargarReglas();
    
    this.mensajeExito = null;
    this.mensajeError = null;

    this.cdRef.detectChanges();
  }

  mostrarMensajeExito(mensaje: string): void {
    this.mensajeExito = mensaje;
    this.messageBox.open(mensaje, 'Cerrar', {
      duration: 5000,
      panelClass: ['snackbar-success']
    });
    setTimeout(() => this.mensajeExito = null, 5000);
  }

  mostrarMensajeError(mensaje: string): void {
    this.mensajeError = mensaje;
    this.messageBox.open(mensaje, 'Cerrar', {
      duration: 5000,
      panelClass: ['snackbar-error']
    });
  }

  mostrarAlertaFiltros(): void {
    this.messageBox.open(
      'Seleccione País y Tipo de Impuesto antes de editar', 
      'Cerrar', 
      { duration: 3000, panelClass: ['snackbar-warning'] }
    );
  }
}

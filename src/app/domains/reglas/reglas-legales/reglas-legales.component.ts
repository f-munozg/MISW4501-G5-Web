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
          categoria_producto: this.filtroCategoriaProducto || null,
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
          this.mensajeError = 'Error cargando las reglas legales';
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

  // Carga la regla legal a editar, la edición se maneja en onSubmit()
  editarReglaLegal(regla_id: string): void {
    if (!this.sonFiltrosValidos()){
      this.mostrarAlertaFiltros();
      return;
    }

    const regla = this.reglasFiltradas.find(r => r.id === regla_id);

    if (regla) {
      this.idReglaLegal = regla_id;
      this.esModoEdicion = true;

      this.agregarReglaLegalForm.patchValue({
        fieldDescripcion: regla.descripcion
      });

      this.fieldPais.writeValue(regla.pais);
      this.fieldCategoriaProducto.writeValue(regla.categoria_producto);

      this.fieldPais.disabled = true;
      this.fieldCategoriaProducto.disabled = true;
    }
  }

  puedeEditar(): boolean {
    const tienePais = this.fieldPais?.value !== null &&
                      this.fieldPais?.value !== undefined &&
                      this.fieldPais?.value !== '';

    const tieneCategoriaProducto = this.fieldCategoriaProducto?.value !== null &&
                                    this.fieldCategoriaProducto?.value !== undefined &&
                                    this.fieldCategoriaProducto?.value !== '';

    return tienePais && tieneCategoriaProducto;
  }

  eliminarReglaLegal(regla_id: string): void {
    if (confirm('¿Está segudo de querer eliminar la regla legal')) {
      this.cargando = true;
      this.apiService.eliminarReglaLegal(regla_id).subscribe({
        next: (response) => {
          this.cargarReglas();
          console.log("Delete successful", response);
          this.mostrarMensajeExito('Regla legal eliminada exitosamente');
          this.enviando = false;
        },
        error: (err) => {
          console.error("Error during deletion", err);
          this.mostrarMensajeError('Error eliminando la regla legal');
          this.cargando = false;
        }
      });
    }
  }

  onSubmit(){
    if (this.enviando) return;

    if (this.agregarReglaLegalForm.valid && 
        this.filtroPais != '' && this.filtroCategoriaProducto != '') {
          this.enviando = true;
          this.mensajeError = null;

          const formData = {
            ...this.agregarReglaLegalForm.value,
            fieldPais: this.fieldPais.value,
            fieldTipoReglaComercial: this.fieldCategoriaProducto.value
          }

          if (this.esModoEdicion && this.idReglaLegal) {
            // Acá se actualiza una regla legal existente
            formData.id = this.idReglaLegal;
            this.apiService.updateReglaComercial(formData).subscribe(
              response => {
                this.limpiarEdicion();
                this.mostrarMensajeExito('Regla legal actualizada con éxito');
                console.log('Update successful', response);
                this.enviando = false;
              },
              error => {
                console.error('Error updating:', error);
                this.mostrarMensajeError('Error al actualizar la regla legal');
                this.enviando = false;
              }
            );
          } else {
              // Acá se crea una nueva regla legal
              this.apiService.postData(formData).subscribe(
                response => {
                  this.cargarReglas();
                  this.mostrarMensajeExito('Regla legal creada exitosamente');
                  this.agregarReglaLegalForm.reset();
                  console.log('Success!', response);
                  this.enviando = false;
                },
                error => {
                  console.error('Error!', error);
                  this.mostrarMensajeError('Error creando la regla legal');
                  this.enviando = false;
                }
              )
          }
        }
  }

  limpiarEdicion(): void {
    this.agregarReglaLegalForm.reset();
    this.esModoEdicion = false;
    this.idReglaLegal = null;
    this.cargarReglas();

    this.fieldPais.disabled = false;
    this.fieldCategoriaProducto.disabled = false;
    
    this.cdRef.detectChanges();
    
    this.cargarReglas();
  }

  clearAll(): void {
    this.agregarReglaLegalForm.reset();
  
    if (!this.fieldPais.disabled) {
      this.fieldPais.writeValue('');
    }
    if (!this.fieldCategoriaProducto.disabled) {
      this.fieldCategoriaProducto.writeValue('');
    }
    
    if (this.esModoEdicion) {
      this.esModoEdicion = false;
      this.idReglaLegal = null;
      
      this.fieldPais.disabled = false;
      this.fieldCategoriaProducto.disabled = false;
    }
    
    this.filtroPais = '';
    this.filtroCategoriaProducto = '';
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

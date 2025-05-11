/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelect } from '@angular/material/select';
import { FormBuilder } from '@angular/forms';

import { of, throwError } from 'rxjs';

import { ReglasLegalesComponent, TableRow } from './reglas-legales.component';
import { ReglasModule } from '../reglas.module';
import { ReglasLegalesService } from './reglas-legales.service';
import { Paises, ReglaLegal, ReglaLegalResponse } from '../reglas.model';
import { CategoriaProductos } from '../../productos/producto.model';



describe('ReglasLegalesComponent', () => {
  let component: ReglasLegalesComponent;
  let fixture: ComponentFixture<ReglasLegalesComponent>;
  let service: ReglasLegalesService;
  let httpMock: HttpTestingController;
  let router: Router;
  let route: ActivatedRoute;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let cdRefSpy: jasmine.SpyObj<ChangeDetectorRef>;
  let fb: FormBuilder;

  beforeEach(waitForAsync(() => {
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    cdRefSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    TestBed.configureTestingModule({
      declarations: [ ReglasLegalesComponent ],
      imports: [ 
        ReglasModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]) 
      ],
      providers:[
        ReglasLegalesService,
        FormBuilder,
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: ChangeDetectorRef, useValue: cdRefSpy, multi: false }
      ]
    })
    .compileComponents();

    service = TestBed.inject(ReglasLegalesService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    fb = TestBed.inject(FormBuilder);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReglasLegalesComponent);
    component = fixture.componentInstance;
    (component as any).cdRef = cdRefSpy;

    component.agregarReglaLegalForm = fb.group({
      fieldDescripcion: [''],
    });

    fixture.detectChanges();
  });

  /*
  afterEach(() => {
    httpMock.verify();
  })
  */

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set idReglaLegal and esModoEdicion if there are any and run initializeForm() and cargarReglas()', () => {
       // 1. Inicialización de datos de prueba
      spyOn(route.snapshot.paramMap, 'get').and.returnValue('123');
      spyOn(component, 'initializeForm');
      spyOn(component, 'cargarReglas');
      
      // 2. Ejecución de métodos/funciones
      component.ngOnInit();
      
      // 3. Validación
      expect(component.idReglaLegal).toBe('123');
      expect(component.esModoEdicion).toBeTrue();
      expect(component.initializeForm).toHaveBeenCalled();
      expect(component.cargarReglas).toHaveBeenCalled();
    });
  });

  describe('cargarReglas', () => {
    it('should load and filter rules successfully', fakeAsync(() => {
      const mockRules = {
        rules: [
          { id: '1', pais: Paises.COLOMBIA, categoria_producto: CategoriaProductos.ROPA, descripcion: 'Test' }
        ]
      };
    
      spyOn(service, 'getListaReglasLegales').and.returnValue(of(mockRules));
      spyOn(component, 'filtrarReglas').and.callThrough();
      spyOn(component, 'actualizarTabla');
      spyOn(router, 'navigate');
    
      component.cargarReglas();
      tick();
    
      expect(component.cargando).toBeFalse();
      expect(component.mensajeError).toBeNull();
      expect(service.getListaReglasLegales).toHaveBeenCalled();
      expect(component.filtrarReglas).toHaveBeenCalledWith(mockRules.rules);
      expect(component.actualizarTabla).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith([], {
        relativeTo: route,
        queryParams: {
          pais: component.filtroPais || null,
          categoria_producto: component.filtroCategoriaProducto || null
        },
        queryParamsHandling: 'merge'
      });
    }));

    it('should handle API errors properly', fakeAsync(() => {
      const mockError = new Error('API failed');
      spyOn(service, 'getListaReglasLegales').and.returnValue(throwError(() => mockError));
      spyOn(console, 'error');
      spyOn(router, 'navigate');
    
      component.cargarReglas();
      tick();
    
      expect(component.cargando).toBeFalse();
      expect(component.mensajeError).toBe('Error cargando las reglas legales');
      expect(console.error).toHaveBeenCalledWith('Error loading rules', mockError);
      expect(router.navigate).toHaveBeenCalled();
    }));
  });

  describe('filtrarReglas', () => {
    it('filtrar works and filters a value', () => {
      component.filtroPais = Paises.COLOMBIA;
      component.filtroCategoriaProducto = CategoriaProductos.ROPA;
      const reglas = [
        { id: '1', pais: Paises.COLOMBIA, categoria_producto: CategoriaProductos.ROPA, descripcion: 'Prueba 1' },
        { id: '2', pais: Paises.ARGENTINA, categoria_producto: CategoriaProductos.ROPA, descripcion: 'Prueba 2' }
      ];
      
      const result = component.filtrarReglas(reglas);
      
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('1');
    });

    it('filtrar does not filter any value', () => {
      component.filtroPais = '';
      component.filtroCategoriaProducto = '';
      const reglas = [
        { id: '1', pais: Paises.COLOMBIA, categoria_producto: CategoriaProductos.ROPA, descripcion: 'Prueba 1' },
        { id: '2', pais: Paises.ARGENTINA, categoria_producto: CategoriaProductos.ROPA, descripcion: 'Prueba 2' }
      ];
      
      const result = component.filtrarReglas(reglas);
      
      expect(result.length).toBe(2);
    });
  });
  
  describe('actualizarTabla', () => {
    it('map method brings back data and updates table', () => {
      const reglas = [
        { id: '1', pais: Paises.COLOMBIA, categoria_producto: CategoriaProductos.ROPA, descripcion: 'Prueba' }
      ];
      
      component.actualizarTabla(reglas);
      
      expect(component.tableData.length).toBe(1);
      expect(component.tableData[0].id).toBe('1');
    });

    it('map method does not bring back data due to error', () => {
      const reglas: any[] = [];
      
      component.actualizarTabla(reglas);
            
      expect(component.tableData.length).toBe(0);
    });
  });

  describe('sonFiltrosValidos', () => {
    it('returns True', () => {
      component.fieldPais = { value: Paises.COLOMBIA } as MatSelect;
      component.fieldCategoriaProducto = { value: CategoriaProductos.ROPA } as MatSelect;
            
      const result = component.sonFiltrosValidos();
            
      expect(result).toBeTrue();
    });

    it('returns False', () => {
      component.fieldPais = { value: null } as MatSelect;
      component.fieldCategoriaProducto = { value: null } as MatSelect;
            
      const result = component.sonFiltrosValidos();
            
      expect(result).toBeFalse();
    });
  });

describe('puedeEditar', () => {
    it('returns true', () => {
      component.fieldPais = { value: Paises.COLOMBIA } as MatSelect;
      component.fieldCategoriaProducto = { value: CategoriaProductos.ROPA } as MatSelect;
      
      const result = component.puedeEditar();
      
      expect(result).toBeTrue();
    });
  
    it('returns false due to fieldPais', () => {
      component.fieldPais = { value: null } as MatSelect;
      component.fieldCategoriaProducto = { value: CategoriaProductos.ROPA } as MatSelect;
      
      const result = component.puedeEditar();
      
      expect(result).toBeFalse();
    });
  
    it('returns false due to fieldTipoReglaComercial', () => {
      component.fieldPais = { value: Paises.COLOMBIA } as MatSelect;
      component.fieldCategoriaProducto = { value: undefined } as MatSelect;
      
      const result = component.puedeEditar();
      
      expect(result).toBeFalse();
    });
  });

  describe('eliminarReglaLegal', () => {
    it('confirm returns false or cancel', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      spyOn(service, 'eliminarReglaLegal');
      
      component.eliminarReglaLegal('1');
      
      expect(service.eliminarReglaLegal).not.toHaveBeenCalled();
    });

    it('confirm returns true and record is deleted', () => {    
      spyOn(window, 'confirm').and.returnValue(true);
      const mockResponse: ReglaLegal = {
        id: '1',
        pais: Paises.COLOMBIA,
        categoria_producto: CategoriaProductos.ROPA,
        descripcion: 'Regla de Prueba'
      };
      spyOn(service, 'eliminarReglaLegal').and.returnValue(of(mockResponse));
      spyOn(component, 'cargarReglas');
      spyOn(component, 'mostrarMensajeExito');
      
      component.eliminarReglaLegal('1');
      
      expect(service.eliminarReglaLegal).toHaveBeenCalledWith('1');
      expect(component.cargarReglas).toHaveBeenCalled();
      expect(component.mostrarMensajeExito).toHaveBeenCalledWith('Regla legal eliminada exitosamente');
    });

    it('confirm returns true but record is not deleted due to server error', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      spyOn(service, 'eliminarReglaLegal').and.returnValue(throwError(() => new Error('Error')));
      spyOn(component, 'mostrarMensajeError');
      
      component.eliminarReglaLegal('1');
      
      expect(service.eliminarReglaLegal).toHaveBeenCalledWith('1');
      expect(component.mostrarMensajeError).toHaveBeenCalled();
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      component.agregarReglaLegalForm = {
        valid: true,
        value: { fieldDescripcion: 'Prueba', fieldValor: 19 },
        reset: jasmine.createSpy()
      } as any;
      component.fieldPais = { value: Paises.COLOMBIA, disabled: false } as any;
      component.fieldCategoriaProducto = { value: CategoriaProductos.ROPA, disabled: false } as any;
      component.filtroPais = Paises.COLOMBIA;
      component.filtroCategoriaProducto = CategoriaProductos.ROPA;
    });

    it('enviando is true so there is a return', () => {
      component.enviando = true;
      spyOn(service, 'postData');
      
      component.onSubmit();
      
      expect(service.postData).not.toHaveBeenCalled();
    });

    it('agregarReglaLegalForm.valid is true and filtroPais and filtroCategoriaProducto as well', () => {
      spyOn(service, 'postData').and.returnValue(of({}));
      spyOn(component, 'cargarReglas');
      spyOn(component, 'mostrarMensajeExito');
      
      component.onSubmit();
          
      expect(service.postData).toHaveBeenCalled();
      expect(component.cargarReglas).toHaveBeenCalled();
      expect(component.mostrarMensajeExito).toHaveBeenCalled();
    });

    it('agregarReglaLegalForm.valid is true but filtroPais or filtroCategoriaProducto are false', () => {   
      component.filtroPais = '';
      spyOn(service, 'postData');
      
      component.onSubmit();
      
      expect(service.postData).not.toHaveBeenCalled();
    });

    it('updateReglaComercial is successful and message in mostrarMensajeExito is "Regla legal actualizada con éxito"', () => {
      component.esModoEdicion = true;
      component.idReglaLegal = '1';
      spyOn(service, 'updateReglaComercial').and.returnValue(of({}));
      spyOn(component, 'mostrarMensajeExito');
      spyOn(component, 'limpiarEdicion');
      
      component.onSubmit();
      
      expect(service.updateReglaComercial).toHaveBeenCalled();
      expect(component.mostrarMensajeExito).toHaveBeenCalledWith('Regla legal actualizada con éxito');
      expect(component.limpiarEdicion).toHaveBeenCalled();
    });

    it('updateReglaComercial is unsuccessful and message in mostrarMensajeError is "Error al actualizar la regla legal"', () => { 
      component.esModoEdicion = true;
      component.idReglaLegal = '1';
      spyOn(service, 'updateReglaComercial').and.returnValue(throwError(() => new Error('Error')));
      spyOn(component, 'mostrarMensajeError');
       
      component.onSubmit();
      
      expect(service.updateReglaComercial).toHaveBeenCalled();
      expect(component.mostrarMensajeError).toHaveBeenCalledWith('Error al actualizar la regla legal');
    });

    it('postData is successful and message in mostrarMensajeExito is "Regla legal creada exitosamente"', () => {
      spyOn(service, 'postData').and.returnValue(of({}));
      spyOn(component, 'mostrarMensajeExito');
      
      component.onSubmit();
      
      expect(service.postData).toHaveBeenCalled();
      expect(component.mostrarMensajeExito).toHaveBeenCalledWith('Regla legal creada exitosamente');
    });

    it('postData is unsuccessful and message in mostrarMensajeError is "Error creando la regla legal"', () => {
      spyOn(service, 'postData').and.returnValue(throwError(() => new Error('Error')));
      spyOn(component, 'mostrarMensajeError');
            
      component.onSubmit();
            
      expect(service.postData).toHaveBeenCalled();
      expect(component.mostrarMensajeError).toHaveBeenCalledWith('Error creando la regla legal');
    });
  });

  describe('cambioValoresFiltros', () => {
    it('should call cargarReglas', () => {
      spyOn(component, 'cargarReglas');
      
      component.cambioValoresFiltros();
      
      expect(component.cargarReglas).toHaveBeenCalled();
    });
  });
  
  describe('limpiarEdicion', () => {
    it('should reset form and update component state', () => {
      component.agregarReglaLegalForm = fb.group({
        fieldDescripcion: ['Prueba'],
      });
  
      component.fieldPais = { 
        disabled: true,
        writeValue: jasmine.createSpy()
      } as any;
  
      component.fieldCategoriaProducto = { 
        disabled: true,
        writeValue: jasmine.createSpy()
      } as any;
  
      component.esModoEdicion = true;
      component.idReglaLegal = '123';
      
      spyOn(component, 'cargarReglas');
      cdRefSpy.detectChanges.calls.reset();

      component.limpiarEdicion();

      expect(component.esModoEdicion).toBeFalse();
      expect(component.idReglaLegal).toBeNull();
      expect(component.fieldPais.disabled).toBeFalse();
      expect(component.fieldCategoriaProducto.disabled).toBeFalse();
      expect(component.cargarReglas).toHaveBeenCalled();
      expect(cdRefSpy.detectChanges).toHaveBeenCalled();
    });
  });

  describe('clearAll', () => {
    beforeEach(() => {
      component.agregarReglaLegalForm = fb.group({
        fieldDescripcion: ['test'],
        fieldValor: ['10']
      });
  
      component.fieldPais = { 
        disabled: false,
        writeValue: jasmine.createSpy()
      } as any;
  
      component.fieldCategoriaProducto = { 
        disabled: false,
        writeValue: jasmine.createSpy()
      } as any;
  
      component.filtroPais = Paises.COLOMBIA;
      component.filtroCategoriaProducto = CategoriaProductos.ROPA;
      component.mensajeExito = 'Success message';
      component.mensajeError = 'Error message';
    });
  
    it('should clear all fields and reset state when not in edit mode', () => {
      spyOn(component, 'cargarReglas');
  
      component.clearAll();
  
      expect(component.agregarReglaLegalForm.value).toEqual({
        fieldDescripcion: null,
        fieldValor: null
      });
      expect(component.fieldPais.writeValue).toHaveBeenCalledWith('');
      expect(component.fieldCategoriaProducto.writeValue).toHaveBeenCalledWith('');
      expect(component.filtroPais).toBe('');
      expect(component.filtroCategoriaProducto).toBe('');
      expect(component.mensajeExito).toBeNull();
      expect(component.mensajeError).toBeNull();
      expect(component.cargarReglas).toHaveBeenCalled();
      expect(cdRefSpy.detectChanges).toHaveBeenCalled();
    });
  
    it('should reset edit mode when in edit mode', () => {
      component.esModoEdicion = true;
      component.idReglaLegal = '123';
      component.fieldPais.disabled = true;
      component.fieldCategoriaProducto.disabled = true;
  
      spyOn(component, 'cargarReglas');
  
      component.clearAll();
  
      expect(component.esModoEdicion).toBeFalse();
      expect(component.idReglaLegal).toBeNull();
      expect(component.fieldPais.disabled).toBeFalse();
      expect(component.fieldCategoriaProducto.disabled).toBeFalse();
    });
  });

  describe('messageBox methods', () => {
    it('should show success message', fakeAsync(() => {
      const testMessage = 'Test success';
      component.mostrarMensajeExito(testMessage);
      
      expect(snackBarSpy.open).toHaveBeenCalledWith(
        testMessage, 
        'Cerrar', 
        { duration: 5000, panelClass: ['snackbar-success'] }
      );
      tick(5000);
      expect(component.mensajeExito).toBeNull();
    }));

    it('should show error message', () => {
      const testMessage = 'Test error';
      component.mostrarMensajeError(testMessage);
      
      expect(snackBarSpy.open).toHaveBeenCalledWith(
        testMessage, 
        'Cerrar', 
        { duration: 5000, panelClass: ['snackbar-error'] }
      );
    });

    it('should show filter warning', () => {
      component.mostrarAlertaFiltros();
      
      expect(snackBarSpy.open).toHaveBeenCalledWith(
        'Seleccione País y Categoría de Producto antes de editar', 
        'Cerrar', 
        { duration: 3000, panelClass: ['snackbar-warning'] }
      );
    });
  });

  describe('Table Configuration', () => {
    describe('tableColumns', () => {
      it('should have correct column definitions', () => {
        expect(component.tableColumns.length).toBe(3);
        
        const countryColumn = component.tableColumns.find(c => c.name === 'country');
        expect(countryColumn).toBeDefined();
        expect(countryColumn?.header).toBe('País');
        
        const taxTypeColumn = component.tableColumns.find(c => c.name === 'category_product');
        expect(taxTypeColumn).toBeDefined();
        expect(taxTypeColumn?.header).toBe('Categoría');
        
        const taxValueColumn = component.tableColumns.find(c => c.name === 'description');
        expect(taxValueColumn).toBeDefined();
        expect(taxValueColumn?.header).toBe('Descripción');
      });
  
      it('should correctly format cell values', () => {
        const testRow = {
          id: '1',
          pais: Paises.COLOMBIA,
          categoria_producto: CategoriaProductos.ROPA,
          descripcion: 'Prueba'
        };
        
        const countryColumn = component.tableColumns.find(c => c.name === 'country');
        expect(countryColumn?.cell(testRow)).toBe(Paises.COLOMBIA.toString());
        
        const taxTypeColumn = component.tableColumns.find(c => c.name === 'category_product');
        expect(taxTypeColumn?.cell(testRow)).toBe(CategoriaProductos.ROPA.toString());
        
        const taxValueColumn = component.tableColumns.find(c => c.name === 'description');
        expect(taxValueColumn?.cell(testRow)).toBe('Prueba');
      });
    });
  
    describe('assignAction', () => {
      it('should have edit and delete actions', () => {
        expect(component.assignAction.length).toBe(2);
        expect(component.assignAction[0].icon).toBe('Editar');
        expect(component.assignAction[1].icon).toBe('Eliminar');
      });
  
      it('should call editarReglaLegal when edit action is clicked with valid filters', () => {
        const testRow = { id: '1' } as TableRow;
        spyOn(component, 'editarReglaLegal');
        spyOn(component, 'sonFiltrosValidos').and.returnValue(true);
        
        component.assignAction[0].action(testRow);
        
        expect(component.editarReglaLegal).toHaveBeenCalledWith('1');
      });
  
      it('should show alert when edit action is clicked with invalid filters', () => {
        const testRow = { id: '1' } as TableRow;
        spyOn(component, 'editarReglaLegal');
        spyOn(component, 'sonFiltrosValidos').and.returnValue(false);
        spyOn(component, 'mostrarAlertaFiltros');
        
        component.assignAction[0].action(testRow);
        
        expect(component.editarReglaLegal).not.toHaveBeenCalled();
        expect(component.mostrarAlertaFiltros).toHaveBeenCalled();
      });
  
      it('should call eliminarReglaComercial when delete action is clicked', () => {
        const testRow = { id: '1' } as TableRow;
        spyOn(component, 'eliminarReglaLegal');
        
        component.assignAction[1].action(testRow);
        
        expect(component.eliminarReglaLegal).toHaveBeenCalledWith('1');
      });
    });
  });
});

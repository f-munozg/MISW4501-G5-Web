/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { of, throwError } from 'rxjs';

import { ReglasComercialesComponent, TableRow } from './reglas-comerciales.component';
import { ReglasModule } from '../reglas.module';
import { ReglasComercialesService } from './reglas-comerciales.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Paises, ReglaComercial, TipoReglaComercial } from '../reglas.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelect } from '@angular/material/select';
import { FormBuilder } from '@angular/forms';

describe('ReglasTributariasComponent', () => {
  let component: ReglasComercialesComponent;
  let fixture: ComponentFixture<ReglasComercialesComponent>;
  let service: ReglasComercialesService;
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
      declarations: [ ReglasComercialesComponent ],
      imports: [ 
        ReglasModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]) 
      ],
      providers:[
        ReglasComercialesService,
        FormBuilder,
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: ChangeDetectorRef, useValue: cdRefSpy, multi: false }
      ]
    })
    .compileComponents();

    service = TestBed.inject(ReglasComercialesService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    fb = TestBed.inject(FormBuilder);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReglasComercialesComponent);
    component = fixture.componentInstance;
    (component as any).cdRef = cdRefSpy;
    fixture.detectChanges();

    component.agregarReglaComercialForm = fb.group({
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
    it('should set idReglaComercial and esModoEdicion if there are any and run initializeForm() and cargarReglas()', () => {
       // 1. Inicialización de datos de prueba
      spyOn(route.snapshot.paramMap, 'get').and.returnValue('123');
      spyOn(component, 'initializeForm');
      spyOn(component, 'cargarReglas');
      
      // 2. Ejecución de métodos/funciones
      component.ngOnInit();
      
      // 3. Validación
      expect(component.idReglaComercial).toBe('123');
      expect(component.esModoEdicion).toBeTrue();
      expect(component.initializeForm).toHaveBeenCalled();
      expect(component.cargarReglas).toHaveBeenCalled();
    });
  });

  describe('cargarReglas', () => {
    it('should load and filter rules successfully', fakeAsync(() => {
      const mockRules = {
        rules: [
          { id: '1', pais: Paises.COLOMBIA, tipo_regla_comercial: TipoReglaComercial.DESCUENTO, descripcion: 'Test' }
        ]
      };
    
      spyOn(service, 'getListaReglasComerciales').and.returnValue(of(mockRules));
      spyOn(component, 'filtrarReglas').and.callThrough();
      spyOn(component, 'actualizarTabla');
      spyOn(router, 'navigate');
    
      component.cargarReglas();
      tick();
    
      expect(component.cargando).toBeFalse();
      expect(component.mensajeError).toBeNull();
      expect(service.getListaReglasComerciales).toHaveBeenCalled();
      expect(component.filtrarReglas).toHaveBeenCalledWith(mockRules.rules);
      expect(component.actualizarTabla).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith([], {
        relativeTo: route,
        queryParams: {
          pais: component.filtroPais || null,
          tipo_regla_comercial: component.filtroTipoReglaComercial || null
        },
        queryParamsHandling: 'merge'
      });
    }));

    it('should handle API errors properly', fakeAsync(() => {
      const mockError = new Error('API failed');
      spyOn(service, 'getListaReglasComerciales').and.returnValue(throwError(() => mockError));
      spyOn(console, 'error');
      spyOn(router, 'navigate');
    
      component.cargarReglas();
      tick();
    
      expect(component.cargando).toBeFalse();
      expect(component.mensajeError).toBe('Error cargando las reglas comerciales');
      expect(console.error).toHaveBeenCalledWith('Error loading rules', mockError);
      expect(router.navigate).toHaveBeenCalled();
    }));
  });

  describe('filtrarReglas', () => {
    it('filtrar works and filters a value', () => {
      component.filtroPais = Paises.COLOMBIA;
      component.filtroTipoReglaComercial = TipoReglaComercial.DESCUENTO;
      const reglas = [
        { id: '1', pais: Paises.COLOMBIA, tipo_regla_comercial: TipoReglaComercial.DESCUENTO, descripcion: 'Prueba 1' },
        { id: '2', pais: Paises.ARGENTINA, tipo_regla_comercial: TipoReglaComercial.DESCUENTO, descripcion: 'Prueba 2' }
      ];
      
      const result = component.filtrarReglas(reglas);
      
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('1');
    });

    it('filtrar does not filter any value', () => {
      component.filtroPais = '';
      component.filtroTipoReglaComercial = '';
      const reglas = [
        { id: '1', pais: Paises.COLOMBIA, tipo_regla_comercial: TipoReglaComercial.DESCUENTO, descripcion: 'Prueba 1' },
        { id: '2', pais: Paises.ARGENTINA, tipo_regla_comercial: TipoReglaComercial.DESCUENTO, descripcion: 'Prueba 2' }
      ];
      
      const result = component.filtrarReglas(reglas);
      
      expect(result.length).toBe(2);
    });
  });
  
  describe('actualizarTabla', () => {
    it('map method brings back data and updates table', () => {
      const reglas = [
        { id: '1', pais: Paises.COLOMBIA, tipo_regla_comercial: TipoReglaComercial.DESCUENTO, descripcion: 'Prueba' }
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
      component.fieldTipoReglaComercial = { value: TipoReglaComercial.DESCUENTO } as MatSelect;
            
      const result = component.sonFiltrosValidos();
            
      expect(result).toBeTrue();
    });

    it('returns False', () => {
      component.fieldPais = { value: null } as MatSelect;
      component.fieldTipoReglaComercial = { value: null } as MatSelect;
            
      const result = component.sonFiltrosValidos();
            
      expect(result).toBeFalse();
    });
  });

  describe('editarTributo', () => {
    it('sonFiltrosValidos returns true and regla returns true', () => {   
      spyOn(component, 'sonFiltrosValidos').and.returnValue(true);
      component.reglasFiltradas = [
        { id: '1', pais: Paises.COLOMBIA, tipo_regla_comercial: TipoReglaComercial.DESCUENTO, descripcion: 'Prueba' }
      ];
      component.fieldPais = { value: Paises.COLOMBIA, writeValue: jasmine.createSpy(), disabled: false } as any;
      component.fieldTipoReglaComercial = { value: TipoReglaComercial.DESCUENTO, writeValue: jasmine.createSpy(), disabled: false } as any;
      component.agregarReglaComercialForm = { patchValue: jasmine.createSpy() } as any;
      
      component.editarReglaComercial('1');
            
      expect(component.esModoEdicion).toBeTrue();
      expect(component.idReglaComercial).toBe('1');
      expect(component.fieldPais.writeValue).toHaveBeenCalledWith(Paises.COLOMBIA);
      expect(component.fieldTipoReglaComercial.writeValue).toHaveBeenCalledWith(TipoReglaComercial.DESCUENTO);
    });

    it('sonFiltrosValidos returns false', () => {     
      spyOn(component, 'sonFiltrosValidos').and.returnValue(false);
      spyOn(component, 'mostrarAlertaFiltros');
      
      component.editarReglaComercial('1');
      
      expect(component.mostrarAlertaFiltros).toHaveBeenCalled();
    });

    it('sonFiltrosValidos returns true and regla returns false', () => {
      spyOn(component, 'sonFiltrosValidos').and.returnValue(true);
      component.reglasFiltradas = [];
      
      component.editarReglaComercial('1');
      
      expect(component.esModoEdicion).toBeFalse();
    });
  });

  describe('puedeEditar', () => {
    it('returns true', () => {
      component.fieldPais = { value: Paises.COLOMBIA } as MatSelect;
      component.fieldTipoReglaComercial = { value: TipoReglaComercial.DESCUENTO } as MatSelect;
      
      const result = component.puedeEditar();
      
      expect(result).toBeTrue();
    });
  
    it('returns false due to fieldPais', () => {
      component.fieldPais = { value: null } as MatSelect;
      component.fieldTipoReglaComercial = { value: TipoReglaComercial.DESCUENTO } as MatSelect;
      
      const result = component.puedeEditar();
      
      expect(result).toBeFalse();
    });
  
    it('returns false due to fieldTipoReglaComercial', () => {
      component.fieldPais = { value: Paises.COLOMBIA } as MatSelect;
      component.fieldTipoReglaComercial = { value: undefined } as MatSelect;
      
      const result = component.puedeEditar();
      
      expect(result).toBeFalse();
    });
  });

  describe('eliminarReglaComercial', () => {
    it('confirm returns false or cancel', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      spyOn(service, 'eliminarReglaComercial');
      
      component.eliminarReglaComercial('1');
      
      expect(service.eliminarReglaComercial).not.toHaveBeenCalled();
    });

    it('confirm returns true and record is deleted', () => {    
      spyOn(window, 'confirm').and.returnValue(true);
      const mockResponse: ReglaComercial = {
        id: '1',
        pais: Paises.COLOMBIA,
        tipo_regla_comercial: TipoReglaComercial.DESCUENTO,
        descripcion: 'Regla de Prueba'
      };
      spyOn(service, 'eliminarReglaComercial').and.returnValue(of(mockResponse));
      spyOn(component, 'cargarReglas');
      spyOn(component, 'mostrarMensajeExito');
      
      component.eliminarReglaComercial('1');
      
      expect(service.eliminarReglaComercial).toHaveBeenCalledWith('1');
      expect(component.cargarReglas).toHaveBeenCalled();
      expect(component.mostrarMensajeExito).toHaveBeenCalledWith('Regla comercial eliminada exitosamente');
    });

    it('confirm returns true but record is not deleted due to server error', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      spyOn(service, 'eliminarReglaComercial').and.returnValue(throwError(() => new Error('Error')));
      spyOn(component, 'mostrarMensajeError');
      
      component.eliminarReglaComercial('1');
      
      expect(service.eliminarReglaComercial).toHaveBeenCalledWith('1');
      expect(component.mostrarMensajeError).toHaveBeenCalled();
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      component.agregarReglaComercialForm = {
        valid: true,
        value: { fieldDescripcion: 'Prueba', fieldValor: 19 },
        reset: jasmine.createSpy()
      } as any;
      component.fieldPais = { value: Paises.COLOMBIA, disabled: false } as any;
      component.fieldTipoReglaComercial = { value: TipoReglaComercial.DESCUENTO, disabled: false } as any;
      component.filtroPais = Paises.COLOMBIA;
      component.filtroTipoReglaComercial = TipoReglaComercial.DESCUENTO;
    });

    it('enviando is true so there is a return', () => {
      component.enviando = true;
      spyOn(service, 'postData');
      
      component.onSubmit();
      
      expect(service.postData).not.toHaveBeenCalled();
    });

    it('agregarReglaComercialForm.valid is true and filtroPais and filtroTipoReglaComercial as well', () => {
      spyOn(service, 'postData').and.returnValue(of({}));
      spyOn(component, 'cargarReglas');
      spyOn(component, 'mostrarMensajeExito');
      
      component.onSubmit();
          
      expect(service.postData).toHaveBeenCalled();
      expect(component.cargarReglas).toHaveBeenCalled();
      expect(component.mostrarMensajeExito).toHaveBeenCalled();
    });

    it('agregarReglaComercialForm.valid is true but filtroPais or filtroTipoReglaComercial are false', () => {   
      component.filtroPais = '';
      spyOn(service, 'postData');
      
      component.onSubmit();
      
      expect(service.postData).not.toHaveBeenCalled();
    });

    it('updateReglaComercial is successful and message in mostrarMensajeExito is "Regla comercial actualizada con éxito"', () => {
      component.esModoEdicion = true;
      component.idReglaComercial = '1';
      spyOn(service, 'updateReglaComercial').and.returnValue(of({}));
      spyOn(component, 'mostrarMensajeExito');
      spyOn(component, 'limpiarEdicion');
      
      component.onSubmit();
      
      expect(service.updateReglaComercial).toHaveBeenCalled();
      expect(component.mostrarMensajeExito).toHaveBeenCalledWith('Regla comercial actualizada con éxito');
      expect(component.limpiarEdicion).toHaveBeenCalled();
    });

    it('updateReglaComercial is unsuccessful and message in mostrarMensajeError is "Error al actualizar la regla comercial"', () => { 
      component.esModoEdicion = true;
      component.idReglaComercial = '1';
      spyOn(service, 'updateReglaComercial').and.returnValue(throwError(() => new Error('Error')));
      spyOn(component, 'mostrarMensajeError');
       
      component.onSubmit();
      
      expect(service.updateReglaComercial).toHaveBeenCalled();
      expect(component.mostrarMensajeError).toHaveBeenCalledWith('Error al actualizar la regla comercial');
    });

    it('postData is successful and message in mostrarMensajeExito is "Regla comercial creada exitosamente"', () => {
      spyOn(service, 'postData').and.returnValue(of({}));
      spyOn(component, 'mostrarMensajeExito');
      
      component.onSubmit();
      
      expect(service.postData).toHaveBeenCalled();
      expect(component.mostrarMensajeExito).toHaveBeenCalledWith('Regla comercial creada exitosamente');
    });

    it('postData is unsuccessful and message in mostrarMensajeError is "Error creando la regla comercial"', () => {
      spyOn(service, 'postData').and.returnValue(throwError(() => new Error('Error')));
      spyOn(component, 'mostrarMensajeError');
            
      component.onSubmit();
            
      expect(service.postData).toHaveBeenCalled();
      expect(component.mostrarMensajeError).toHaveBeenCalledWith('Error creando la regla comercial');
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
      component.agregarReglaComercialForm = fb.group({
        fieldDescripcion: ['Prueba'],
      });
  
      component.fieldPais = { 
        disabled: true,
        writeValue: jasmine.createSpy()
      } as any;
  
      component.fieldTipoReglaComercial = { 
        disabled: true,
        writeValue: jasmine.createSpy()
      } as any;
  
      component.esModoEdicion = true;
      component.idReglaComercial = '123';
      
      spyOn(component, 'cargarReglas');
      cdRefSpy.detectChanges.calls.reset();

      component.limpiarEdicion();

      expect(component.esModoEdicion).toBeFalse();
      expect(component.idReglaComercial).toBeNull();
      expect(component.fieldPais.disabled).toBeFalse();
      expect(component.fieldTipoReglaComercial.disabled).toBeFalse();
      expect(component.cargarReglas).toHaveBeenCalled();
      expect(cdRefSpy.detectChanges).toHaveBeenCalled();
    });
  });

  describe('clearAll', () => {
    beforeEach(() => {
      component.agregarReglaComercialForm = fb.group({
        fieldDescripcion: ['test'],
        fieldValor: ['10']
      });
  
      component.fieldPais = { 
        disabled: false,
        writeValue: jasmine.createSpy()
      } as any;
  
      component.fieldTipoReglaComercial = { 
        disabled: false,
        writeValue: jasmine.createSpy()
      } as any;
  
      component.filtroPais = Paises.COLOMBIA;
      component.filtroTipoReglaComercial = TipoReglaComercial.DESCUENTO;
      component.mensajeExito = 'Success message';
      component.mensajeError = 'Error message';
    });
  
    it('should clear all fields and reset state when not in edit mode', () => {
      spyOn(component, 'cargarReglas');
  
      component.clearAll();
  
      expect(component.agregarReglaComercialForm.value).toEqual({
        fieldDescripcion: null,
        fieldValor: null
      });
      expect(component.fieldPais.writeValue).toHaveBeenCalledWith('');
      expect(component.fieldTipoReglaComercial.writeValue).toHaveBeenCalledWith('');
      expect(component.filtroPais).toBe('');
      expect(component.filtroTipoReglaComercial).toBe('');
      expect(component.mensajeExito).toBeNull();
      expect(component.mensajeError).toBeNull();
      expect(component.cargarReglas).toHaveBeenCalled();
      expect(cdRefSpy.detectChanges).toHaveBeenCalled();
    });
  
    it('should reset edit mode when in edit mode', () => {
      component.esModoEdicion = true;
      component.idReglaComercial = '123';
      component.fieldPais.disabled = true;
      component.fieldTipoReglaComercial.disabled = true;
  
      spyOn(component, 'cargarReglas');
  
      component.clearAll();
  
      expect(component.esModoEdicion).toBeFalse();
      expect(component.idReglaComercial).toBeNull();
      expect(component.fieldPais.disabled).toBeFalse();
      expect(component.fieldTipoReglaComercial.disabled).toBeFalse();
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
        'Seleccione País y Tipo de Regla Comercial antes de editar', 
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
        
        const taxTypeColumn = component.tableColumns.find(c => c.name === 'type_commercial_rule');
        expect(taxTypeColumn).toBeDefined();
        expect(taxTypeColumn?.header).toBe('Regla');
        
        const taxValueColumn = component.tableColumns.find(c => c.name === 'description');
        expect(taxValueColumn).toBeDefined();
        expect(taxValueColumn?.header).toBe('Descripción');
      });
  
      it('should correctly format cell values', () => {
        const testRow = {
          id: '1',
          pais: Paises.COLOMBIA,
          tipo_regla_comercial: TipoReglaComercial.DESCUENTO,
          descripcion: 'Prueba'
        };
        
        const countryColumn = component.tableColumns.find(c => c.name === 'country');
        expect(countryColumn?.cell(testRow)).toBe(Paises.COLOMBIA.toString());
        
        const taxTypeColumn = component.tableColumns.find(c => c.name === 'type_commercial_rule');
        expect(taxTypeColumn?.cell(testRow)).toBe(TipoReglaComercial.DESCUENTO.toString());
        
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
  
      it('should call editarReglaComercial when edit action is clicked with valid filters', () => {
        const testRow = { id: '1' } as TableRow;
        spyOn(component, 'editarReglaComercial');
        spyOn(component, 'sonFiltrosValidos').and.returnValue(true);
        
        component.assignAction[0].action(testRow);
        
        expect(component.editarReglaComercial).toHaveBeenCalledWith('1');
      });
  
      it('should show alert when edit action is clicked with invalid filters', () => {
        const testRow = { id: '1' } as TableRow;
        spyOn(component, 'editarReglaComercial');
        spyOn(component, 'sonFiltrosValidos').and.returnValue(false);
        spyOn(component, 'mostrarAlertaFiltros');
        
        component.assignAction[0].action(testRow);
        
        expect(component.editarReglaComercial).not.toHaveBeenCalled();
        expect(component.mostrarAlertaFiltros).toHaveBeenCalled();
      });
  
      it('should call eliminarReglaComercial when delete action is clicked', () => {
        const testRow = { id: '1' } as TableRow;
        spyOn(component, 'eliminarReglaComercial');
        
        component.assignAction[1].action(testRow);
        
        expect(component.eliminarReglaComercial).toHaveBeenCalledWith('1');
      });
    });
  });
});
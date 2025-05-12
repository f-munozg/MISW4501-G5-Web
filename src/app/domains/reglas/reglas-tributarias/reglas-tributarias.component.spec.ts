/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { of, throwError } from 'rxjs';

import { ReglasTributariasComponent, TableRow } from './reglas-tributarias.component';
import { ReglasModule } from '../reglas.module';
import { ReglasTributariasService } from './reglas-tributarias.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Paises, ReglaTributaria, TipoImpuesto } from '../reglas.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelect } from '@angular/material/select';
import { FormBuilder } from '@angular/forms';

describe('ReglasTributariasComponent', () => {
  let component: ReglasTributariasComponent;
  let fixture: ComponentFixture<ReglasTributariasComponent>;
  let service: ReglasTributariasService;
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
      declarations: [ ReglasTributariasComponent ],
      imports: [ 
        ReglasModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]) 
      ],
      providers:[
        ReglasTributariasService,
        FormBuilder,
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: ChangeDetectorRef, useValue: cdRefSpy, multi: false }
      ]
    })
    .compileComponents();

    service = TestBed.inject(ReglasTributariasService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    fb = TestBed.inject(FormBuilder);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReglasTributariasComponent);
    component = fixture.componentInstance;
    (component as any).cdRef = cdRefSpy;
    fixture.detectChanges();

    component.agregarReglaTributariaForm = fb.group({
      fieldDescripcion: [''],
      fieldValor: ['']
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
    it('should set idTributo and esModoEdicion if there are any and run initializeForm() and cargarReglas()', () => {
       // 1. Inicialización de datos de prueba
      spyOn(route.snapshot.paramMap, 'get').and.returnValue('123');
      spyOn(component, 'initializeForm');
      spyOn(component, 'cargarReglas');
      
      // 2. Ejecución de métodos/funciones
      component.ngOnInit();
      
      // 3. Validación
      expect(component.idTributo).toBe('123');
      expect(component.esModoEdicion).toBeTrue();
      expect(component.initializeForm).toHaveBeenCalled();
      expect(component.cargarReglas).toHaveBeenCalled();
    });
  });

  describe('cargarReglas', () => {
    it('should load and filter rules successfully', fakeAsync(() => {
      const mockRules = {
        rules: [
          { id: '1', pais: Paises.COLOMBIA, tipo_impuesto: TipoImpuesto.VALOR_AGREGADO, valor: 19, descripcion: 'Test' }
        ]
      };
    
      spyOn(service, 'getListaTributos').and.returnValue(of(mockRules));
      spyOn(component, 'filtrarReglas').and.callThrough();
      spyOn(component, 'actualizarTabla');
      spyOn(router, 'navigate');
    
      component.cargarReglas();
      tick();
    
      expect(component.cargando).toBeFalse();
      expect(component.mensajeError).toBeNull();
      expect(service.getListaTributos).toHaveBeenCalled();
      expect(component.filtrarReglas).toHaveBeenCalledWith(mockRules.rules);
      expect(component.actualizarTabla).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith([], {
        relativeTo: route,
        queryParams: {
          pais: component.filtroPais || null,
          tipo_impuesto: component.filtroTipoImpuesto || null
        },
        queryParamsHandling: 'merge'
      });
    }));

    it('should handle API errors properly', fakeAsync(() => {
      const mockError = new Error('API failed');
      spyOn(service, 'getListaTributos').and.returnValue(throwError(() => mockError));
      spyOn(console, 'error');
      spyOn(router, 'navigate');
    
      component.cargarReglas();
      tick();
    
      expect(component.cargando).toBeFalse();
      expect(component.mensajeError).toBe('Error cargando las reglas tributarias');
      expect(console.error).toHaveBeenCalledWith('Error loading rules:', mockError);
      expect(router.navigate).toHaveBeenCalled();
    }));
  });

  describe('filtrarReglas', () => {
    it('filtrar works and filters a value', () => {
      component.filtroPais = Paises.COLOMBIA;
      component.filtroTipoImpuesto = TipoImpuesto.VALOR_AGREGADO;
      const reglas = [
        { id: '1', pais: Paises.COLOMBIA, tipo_impuesto: TipoImpuesto.VALOR_AGREGADO, valor: 19, descripcion: 'Prueba 1' },
        { id: '2', pais: Paises.ARGENTINA, tipo_impuesto: TipoImpuesto.VALOR_AGREGADO, valor: 21, descripcion: 'Prueba 2' }
      ];
      
      const result = component.filtrarReglas(reglas);
      
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('1');
    });

    it('filtrar does not filter any value', () => {
      component.filtroPais = '';
      component.filtroTipoImpuesto = '';
      const reglas = [
        { id: '1', pais: Paises.COLOMBIA, tipo_impuesto: TipoImpuesto.VALOR_AGREGADO, valor: 19, descripcion: 'Prueba 1' },
        { id: '2', pais: Paises.ARGENTINA, tipo_impuesto: TipoImpuesto.VALOR_AGREGADO, valor: 21, descripcion: 'Prueba 2' }
      ];
      
      const result = component.filtrarReglas(reglas);
      
      expect(result.length).toBe(2);
    });
  });
  
  describe('actualizarTabla', () => {
    it('map method brings back data and updates table', () => {
      const reglas = [
        { id: '1', pais: Paises.COLOMBIA, tipo_impuesto: TipoImpuesto.VALOR_AGREGADO, valor: 19, descripcion: 'Prueba' }
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
      component.fieldTipoImpuesto = { value: TipoImpuesto.VALOR_AGREGADO } as MatSelect;
            
      const result = component.sonFiltrosValidos();
            
      expect(result).toBeTrue();
    });

    it('returns False', () => {
      component.fieldPais = { value: null } as MatSelect;
      component.fieldTipoImpuesto = { value: null } as MatSelect;
            
      const result = component.sonFiltrosValidos();
            
      expect(result).toBeFalse();
    });
  });

  describe('editarTributo', () => {
    it('sonFiltrosValidos returns true and regla returns true', () => {   
      spyOn(component, 'sonFiltrosValidos').and.returnValue(true);
      component.reglasFiltradas = [
        { id: '1', pais: Paises.COLOMBIA, tipo_impuesto: TipoImpuesto.VALOR_AGREGADO, valor: 19, descripcion: 'Prueba' }
      ];
      component.fieldPais = { value: Paises.COLOMBIA, writeValue: jasmine.createSpy(), disabled: false } as any;
      component.fieldTipoImpuesto = { value: TipoImpuesto.VALOR_AGREGADO, writeValue: jasmine.createSpy(), disabled: false } as any;
      component.agregarReglaTributariaForm = { patchValue: jasmine.createSpy() } as any;
      
      component.editarTributo('1');
            
      expect(component.esModoEdicion).toBeTrue();
      expect(component.idTributo).toBe('1');
      expect(component.fieldPais.writeValue).toHaveBeenCalledWith(Paises.COLOMBIA);
      expect(component.fieldTipoImpuesto.writeValue).toHaveBeenCalledWith(TipoImpuesto.VALOR_AGREGADO);
    });

    it('sonFiltrosValidos returns false', () => {     
      spyOn(component, 'sonFiltrosValidos').and.returnValue(false);
      spyOn(component, 'mostrarAlertaFiltros');
      
      component.editarTributo('1');
      
      expect(component.mostrarAlertaFiltros).toHaveBeenCalled();
    });

    it('sonFiltrosValidos returns true and regla returns false', () => {
      spyOn(component, 'sonFiltrosValidos').and.returnValue(true);
      component.reglasFiltradas = [];
      
      component.editarTributo('1');
      
      expect(component.esModoEdicion).toBeFalse();
    });
  });

  describe('puedeEditar', () => {
    it('returns true', () => {
      component.fieldPais = { value: Paises.COLOMBIA } as MatSelect;
      component.fieldTipoImpuesto = { value: TipoImpuesto.VALOR_AGREGADO } as MatSelect;
      
      const result = component.puedeEditar();
      
      expect(result).toBeTrue();
    });
  
    it('returns false due to fieldPais', () => {
      component.fieldPais = { value: null } as MatSelect;
      component.fieldTipoImpuesto = { value: TipoImpuesto.VALOR_AGREGADO } as MatSelect;
      
      const result = component.puedeEditar();
      
      expect(result).toBeFalse();
    });
  
    it('returns false due to fieldTipoImpuesto', () => {
      component.fieldPais = { value: Paises.COLOMBIA } as MatSelect;
      component.fieldTipoImpuesto = { value: undefined } as MatSelect;
      
      const result = component.puedeEditar();
      
      expect(result).toBeFalse();
    });
  });

  describe('eliminarTributo', () => {
    it('confirm returns false or cancel', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      spyOn(service, 'eliminarTributo');
      
      component.eliminarTributo('1');
      
      expect(service.eliminarTributo).not.toHaveBeenCalled();
    });

    it('confirm returns true and record is deleted', () => {    
      spyOn(window, 'confirm').and.returnValue(true);
      const mockResponse: ReglaTributaria = {
        id: '1',
        pais: Paises.COLOMBIA,
        tipo_impuesto: TipoImpuesto.VALOR_AGREGADO,
        valor: 19,
        descripcion: 'Regla de Prueba'
      };
      spyOn(service, 'eliminarTributo').and.returnValue(of(mockResponse));
      spyOn(component, 'cargarReglas');
      spyOn(component, 'mostrarMensajeExito');
      
      component.eliminarTributo('1');
      
      expect(service.eliminarTributo).toHaveBeenCalledWith('1');
      expect(component.cargarReglas).toHaveBeenCalled();
      expect(component.mostrarMensajeExito).toHaveBeenCalledWith('Regla tributaria eliminada exitosamente');
    });

    it('confirm returns true but record is not deleted due to server error', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      spyOn(service, 'eliminarTributo').and.returnValue(throwError(() => new Error('Error')));
      spyOn(component, 'mostrarMensajeError');
      
      component.eliminarTributo('1');
      
      expect(service.eliminarTributo).toHaveBeenCalledWith('1');
      expect(component.mostrarMensajeError).toHaveBeenCalled();
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      component.agregarReglaTributariaForm = {
        valid: true,
        value: { fieldDescripcion: 'Prueba', fieldValor: 19 },
        reset: jasmine.createSpy()
      } as any;
      component.fieldPais = { value: Paises.COLOMBIA, disabled: false } as any;
      component.fieldTipoImpuesto = { value: TipoImpuesto.VALOR_AGREGADO, disabled: false } as any;
      component.filtroPais = Paises.COLOMBIA;
      component.filtroTipoImpuesto = TipoImpuesto.VALOR_AGREGADO;
    });

    it('enviando is true so there is a return', () => {
      component.enviando = true;
      spyOn(service, 'postData');
      
      component.onSubmit();
      
      expect(service.postData).not.toHaveBeenCalled();
    });

    it('agregarReglaTributariaForm.valid is true and filtroPais and filtroTipoImpuesto as well', () => {
      spyOn(service, 'postData').and.returnValue(of({}));
      spyOn(component, 'cargarReglas');
      spyOn(component, 'mostrarMensajeExito');
      
      component.onSubmit();
          
      expect(service.postData).toHaveBeenCalled();
      expect(component.cargarReglas).toHaveBeenCalled();
      expect(component.mostrarMensajeExito).toHaveBeenCalled();
    });

    it('agregarReglaTributariaForm.valid is true but filtroPais or filtroTipoImpuesto is false', () => {   
      component.filtroPais = '';
      spyOn(service, 'postData');
      
      component.onSubmit();
      
      expect(service.postData).not.toHaveBeenCalled();
    });

    it('updateTributo is successful and message in mostrarMensajeExito is "Regla tributaria actualizada con éxito"', () => {
      component.esModoEdicion = true;
      component.idTributo = '1';
      spyOn(service, 'updateTributo').and.returnValue(of({}));
      spyOn(component, 'mostrarMensajeExito');
      spyOn(component, 'limpiarEdicion');
      
      component.onSubmit();
      
      expect(service.updateTributo).toHaveBeenCalled();
      expect(component.mostrarMensajeExito).toHaveBeenCalledWith('Regla tributaria actualizada con éxito');
      expect(component.limpiarEdicion).toHaveBeenCalled();
    });

    it('updateTributo is unsuccessful and message in mostrarMensajeError is "Error al actualizar la regla tributaria"', () => { 
      component.esModoEdicion = true;
      component.idTributo = '1';
      spyOn(service, 'updateTributo').and.returnValue(throwError(() => new Error('Error')));
      spyOn(component, 'mostrarMensajeError');
       
      component.onSubmit();
      
      expect(service.updateTributo).toHaveBeenCalled();
      expect(component.mostrarMensajeError).toHaveBeenCalledWith('Error al actualizar la regla tributaria');
    });

    it('postData is successful and message in mostrarMensajeExito is "Regla tributaria creada exitosamente"', () => {
      spyOn(service, 'postData').and.returnValue(of({}));
      spyOn(component, 'mostrarMensajeExito');
      
      component.onSubmit();
      
      expect(service.postData).toHaveBeenCalled();
      expect(component.mostrarMensajeExito).toHaveBeenCalledWith('Regla tributaria creada exitosamente');
    });

    it('postData is unsuccessful and message in mostrarMensajeError is "Error creando la regla tributaria"', () => {
      spyOn(service, 'postData').and.returnValue(throwError(() => new Error('Error')));
      spyOn(component, 'mostrarMensajeError');
            
      component.onSubmit();
            
      expect(service.postData).toHaveBeenCalled();
      expect(component.mostrarMensajeError).toHaveBeenCalledWith('Error creando la regla tributaria');
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
      component.agregarReglaTributariaForm = fb.group({
        fieldDescripcion: ['test'],
        fieldValor: ['10']
      });
  
      component.fieldPais = { 
        disabled: true,
        writeValue: jasmine.createSpy()
      } as any;
  
      component.fieldTipoImpuesto = { 
        disabled: true,
        writeValue: jasmine.createSpy()
      } as any;
  
      component.esModoEdicion = true;
      component.idTributo = '123';
      
      spyOn(component, 'cargarReglas');
      cdRefSpy.detectChanges.calls.reset();

      component.limpiarEdicion();

      expect(component.esModoEdicion).toBeFalse();
      expect(component.idTributo).toBeNull();
      expect(component.fieldPais.disabled).toBeFalse();
      expect(component.fieldTipoImpuesto.disabled).toBeFalse();
      expect(component.cargarReglas).toHaveBeenCalled();
      expect(cdRefSpy.detectChanges).toHaveBeenCalled();
    });
  });

  describe('clearAll', () => {
    beforeEach(() => {
      component.agregarReglaTributariaForm = fb.group({
        fieldDescripcion: ['test'],
        fieldValor: ['10']
      });
  
      component.fieldPais = { 
        disabled: false,
        writeValue: jasmine.createSpy()
      } as any;
  
      component.fieldTipoImpuesto = { 
        disabled: false,
        writeValue: jasmine.createSpy()
      } as any;
  
      component.filtroPais = Paises.COLOMBIA;
      component.filtroTipoImpuesto = TipoImpuesto.VALOR_AGREGADO;
      component.mensajeExito = 'Success message';
      component.mensajeError = 'Error message';
    });
  
    it('should clear all fields and reset state when not in edit mode', () => {
      spyOn(component, 'cargarReglas');
  
      component.clearAll();
  
      expect(component.agregarReglaTributariaForm.value).toEqual({
        fieldDescripcion: null,
        fieldValor: null
      });
      expect(component.fieldPais.writeValue).toHaveBeenCalledWith('');
      expect(component.fieldTipoImpuesto.writeValue).toHaveBeenCalledWith('');
      expect(component.filtroPais).toBe('');
      expect(component.filtroTipoImpuesto).toBe('');
      expect(component.mensajeExito).toBeNull();
      expect(component.mensajeError).toBeNull();
      expect(component.cargarReglas).toHaveBeenCalled();
      expect(cdRefSpy.detectChanges).toHaveBeenCalled();
    });
  
    it('should reset edit mode when in edit mode', () => {
      component.esModoEdicion = true;
      component.idTributo = '123';
      component.fieldPais.disabled = true;
      component.fieldTipoImpuesto.disabled = true;
  
      spyOn(component, 'cargarReglas');
  
      component.clearAll();
  
      expect(component.esModoEdicion).toBeFalse();
      expect(component.idTributo).toBeNull();
      expect(component.fieldPais.disabled).toBeFalse();
      expect(component.fieldTipoImpuesto.disabled).toBeFalse();
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
        'Seleccione País y Tipo de Impuesto antes de editar', 
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
        
        const taxTypeColumn = component.tableColumns.find(c => c.name === 'tax_type');
        expect(taxTypeColumn).toBeDefined();
        expect(taxTypeColumn?.header).toBe('Tipo Impuesto');
        
        const taxValueColumn = component.tableColumns.find(c => c.name === 'tax_value');
        expect(taxValueColumn).toBeDefined();
        expect(taxValueColumn?.header).toBe('Valor');
      });
  
      it('should correctly format cell values', () => {
        const testRow = {
          id: '1',
          pais: Paises.COLOMBIA,
          tipo_impuesto: TipoImpuesto.VALOR_AGREGADO,
          valor: 19,
          descripcion: 'Prueba'
        };
        
        const countryColumn = component.tableColumns.find(c => c.name === 'country');
        expect(countryColumn?.cell(testRow)).toBe(Paises.COLOMBIA.toString());
        
        const taxTypeColumn = component.tableColumns.find(c => c.name === 'tax_type');
        expect(taxTypeColumn?.cell(testRow)).toBe(TipoImpuesto.VALOR_AGREGADO.toString());
        
        const taxValueColumn = component.tableColumns.find(c => c.name === 'tax_value');
        expect(taxValueColumn?.cell(testRow)).toBe('19');
      });
    });
  
    describe('assignAction', () => {
      it('should have edit and delete actions', () => {
        expect(component.assignAction.length).toBe(2);
        expect(component.assignAction[0].icon).toBe('Editar');
        expect(component.assignAction[1].icon).toBe('Eliminar');
      });
  
      it('should call editarTributo when edit action is clicked with valid filters', () => {
        const testRow = { id: '1' } as TableRow;
        spyOn(component, 'editarTributo');
        spyOn(component, 'sonFiltrosValidos').and.returnValue(true);
        
        component.assignAction[0].action(testRow);
        
        expect(component.editarTributo).toHaveBeenCalledWith('1');
      });
  
      it('should show alert when edit action is clicked with invalid filters', () => {
        const testRow = { id: '1' } as TableRow;
        spyOn(component, 'editarTributo');
        spyOn(component, 'sonFiltrosValidos').and.returnValue(false);
        spyOn(component, 'mostrarAlertaFiltros');
        
        component.assignAction[0].action(testRow);
        
        expect(component.editarTributo).not.toHaveBeenCalled();
        expect(component.mostrarAlertaFiltros).toHaveBeenCalled();
      });
  
      it('should call eliminarTributo when delete action is clicked', () => {
        const testRow = { id: '1' } as TableRow;
        spyOn(component, 'eliminarTributo');
        
        component.assignAction[1].action(testRow);
        
        expect(component.eliminarTributo).toHaveBeenCalledWith('1');
      });
    });
  });
});
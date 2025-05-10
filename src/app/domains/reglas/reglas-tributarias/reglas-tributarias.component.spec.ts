/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { of, throwError } from 'rxjs';

import { ReglasTributariasComponent } from './reglas-tributarias.component';
import { ReglasModule } from '../reglas.module';
import { ReglasTributariasService } from './reglas-tributarias.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Paises, ReglaTributaria, TipoImpuesto } from '../reglas.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelect } from '@angular/material/select';

describe('ReglasTributariasComponent', () => {
  let component: ReglasTributariasComponent;
  let fixture: ComponentFixture<ReglasTributariasComponent>;
  let service: ReglasTributariasService;
  let httpMock: HttpTestingController;
  let router: Router;
  let route: ActivatedRoute;
  let snackBar: MatSnackBar;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReglasTributariasComponent ],
      imports: [ 
        ReglasModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]) 
      ],
      providers:[
        ReglasTributariasService
      ]
    })
    .compileComponents();

    service = TestBed.inject(ReglasTributariasService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    snackBar = TestBed.inject(MatSnackBar);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReglasTributariasComponent);
    component = fixture.componentInstance;
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

  describe('filtrarReglas', () => {
    it('filtrar works and filters a value', () => {
      component.filtroPais = Paises.COLOMBIA;
      component.filtroTipoImpuesto = TipoImpuesto.VALOR_AGREGADO;
      const reglas = [
        { id: '1', pais: Paises.COLOMBIA, tipo_impuesto: TipoImpuesto.VALOR_AGREGADO, valor: 19, descripcion: 'Test' },
        { id: '2', pais: Paises.ARGENTINA, tipo_impuesto: TipoImpuesto.VALOR_AGREGADO, valor: 21, descripcion: 'Test 2' }
      ];
      
      const result = component.filtrarReglas(reglas);
      
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('1');
    });

    it('filtrar does not filter any value', () => {
      component.filtroPais = '';
      component.filtroTipoImpuesto = '';
      const reglas = [
        { id: '1', pais: Paises.COLOMBIA, tipo_impuesto: TipoImpuesto.VALOR_AGREGADO, valor: 19, descripcion: 'Test' },
        { id: '2', pais: Paises.ARGENTINA, tipo_impuesto: TipoImpuesto.VALOR_AGREGADO, valor: 21, descripcion: 'Test 2' }
      ];
      
      const result = component.filtrarReglas(reglas);
      
      expect(result.length).toBe(2);
    });
  });
  
  describe('actualizarTabla', () => {
    it('map method brings back data and updates table', () => {
      const reglas = [
        { id: '1', pais: Paises.COLOMBIA, tipo_impuesto: TipoImpuesto.VALOR_AGREGADO, valor: 19, descripcion: 'Test' }
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
        { id: '1', pais: Paises.COLOMBIA, tipo_impuesto: TipoImpuesto.VALOR_AGREGADO, valor: 19, descripcion: 'Test' }
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
        descripcion: 'Test rule'
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
        value: { fieldDescripcion: 'Test', fieldValor: 19 },
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

  
});
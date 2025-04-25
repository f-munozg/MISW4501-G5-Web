/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RegistroVendedoresComponent } from './registro-vendedores.component';
import { VendedoresModule } from '../vendedores.module';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment'
import { RegistroVendedoresService } from './registro-vendedores.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Vendedor } from '../vendedores.model';
import { finalize, of } from 'rxjs';

describe('RegistroVendedoresComponent', () => {
  let component: RegistroVendedoresComponent;
  let fixture: ComponentFixture<RegistroVendedoresComponent>;
  let service: RegistroVendedoresService;
  let httpMock: HttpTestingController;
  let router: Router;
  let route: ActivatedRoute;

  let apiUrlSellers = environment.apiUrlSellers + `/sellers`;

  const mockVendedores: Vendedor[] = [
    { id: '1', identification_number: 123, name: 'John', email: 'john@test.com', address: '123 St', phone: '123456', zone: 'NORTE', user_id: '2e4a0ab9-0928-47fa-bf33-07c11267d178' },
    { id: '2', identification_number: 456, name: 'Jane', email: 'jane@test.com', address: '456 St', phone: '654321', zone: 'SUR', user_id: 'd71d8450-448c-46dc-9db5-536642a67627'}
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RegistroVendedoresComponent],
      imports: [
        VendedoresModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        RegistroVendedoresService,
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({}),
            snapshot: { queryParams: {} }
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroVendedoresComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(RegistroVendedoresService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);

    spyOn(router, 'navigate').and.stub();
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });
 
  it('should create', () => {
    expect(component).toBeTruthy();

    const req = httpMock.expectOne(`${environment.apiUrlSellers}/sellers`);
    req.flush({});
  });

  describe('ngOnInit', () => {
    it('should initialize forms and load sellers', () => {
      const initialGetReq = httpMock.expectOne(apiUrlSellers);
      expect(initialGetReq.request.method).toBe('GET');
      initialGetReq.flush({ sellers: [] });

      spyOn(component, 'initializeForms');
      spyOn(component, 'autoCompletar');
      spyOn(component, 'cargarVendedores').and.callThrough();

      component.ngOnInit();

      expect(component.initializeForms).toHaveBeenCalled();
      expect(component.autoCompletar).toHaveBeenCalled();
      expect(component.cargarVendedores).toHaveBeenCalled();

      const getReq = httpMock.expectOne(apiUrlSellers);
      expect(getReq.request.method).toBe('GET');
      getReq.flush({ sellers: [] });
    });
  });

  describe('initializeForms', () => {
    it('should initialize registroVendedoresForm with required validators', () => {
      component.initializeForms();
      
      expect(component.registroVendedoresForm.get('fieldNumeroIdentificacion')?.validator).toBeTruthy();
      expect(component.registroVendedoresForm.get('fieldNombre')?.validator).toBeTruthy();
      expect(component.registroVendedoresForm.get('fieldCorreoElectronico')?.validator).toBeTruthy();
      expect(component.registroVendedoresForm.get('fieldDireccion')?.validator).toBeTruthy();
      expect(component.registroVendedoresForm.get('fieldTelefono')?.validator).toBeTruthy();
      expect(component.registroVendedoresForm.get('fieldZona')?.validator).toBeTruthy();

      const getReq = httpMock.expectOne(apiUrlSellers);
      getReq.flush({ sellers: [] });
    });

    it('should initialize consultaVendedoresForm with required validators', () => {
      component.initializeForms();
      
      expect(component.consultaVendedoresForm.get('fieldNumeroIdentificacion')?.validator).toBeTruthy();
      expect(component.consultaVendedoresForm.get('fieldNombre')?.validator).toBeTruthy();
      expect(component.consultaVendedoresForm.get('fieldCorreoElectronico')?.validator).toBeTruthy();
      expect(component.consultaVendedoresForm.get('fieldDireccion')?.validator).toBeTruthy();
      expect(component.consultaVendedoresForm.get('fieldTelefono')?.validator).toBeTruthy();
      expect(component.consultaVendedoresForm.get('fieldZona')?.validator).toBeTruthy();

      const getReq = httpMock.expectOne(apiUrlSellers);
      getReq.flush({ sellers: [] });
    });
  });

  describe('loadSellers', () => {
  
    it('should load sellers and update listaVendedores', () => {
      const initialGetReq = httpMock.expectOne(apiUrlSellers);
      expect(initialGetReq.request.method).toBe('GET');
      initialGetReq.flush({ sellers: [] });

      const mockResponse = { sellers: mockVendedores };
      const callback = jasmine.createSpy('callback');
  
      component.isRefreshing = false;
      component.listaVendedores = [];
  
      component.cargarVendedores(callback);

      expect(component.isRefreshing).toBe(true);
  
      const req = httpMock.expectOne(apiUrlSellers); 
      expect(req.request.method).toEqual('GET');
      req.flush(mockResponse);
  
      expect(component.listaVendedores).toEqual(mockVendedores);
      expect(component.isRefreshing).toBe(false);
      expect(callback).toHaveBeenCalled();
    });
  
    it('should handle errors', () => {
      const initialGetReq = httpMock.expectOne(apiUrlSellers);
      expect(initialGetReq.request.method).toBe('GET');
      initialGetReq.flush({ sellers: [] });

      spyOn(console, 'error');
      component.cargarVendedores();
  
      const req = httpMock.expectOne(apiUrlSellers);
      req.flush('Error', { status: 500, statusText: 'Server Error' });
  
      expect(console.error).toHaveBeenCalledWith(
        'Failed to load sellers', 
        jasmine.any(Object)
      );
      expect(component.isRefreshing).toBe(false);
      
    });
  
  });

  describe('createUrlWithId', () => {
    it('should not do anything if no idVendedorSeleccionado or empty listaVendedores', () => {
      component.idVendedorSeleccionado = null;
      component.listaVendedores = [];
      component.crearUrlConId();
      expect(component.isInViewMode).toBeFalse();

      const req = httpMock.expectOne(`${environment.apiUrlSellers}/sellers`);
      req.flush({});
    });

    it('should set isInViewMode and patch myForm when seller found', () => {
      const mockVendedores = [{
        id: '1',
        identification_number: 1,
        name: 'Test Seller',
        email: 'test@example.com',
        address: '123 Street',
        phone: '1234567890',
        zone: 'NORTE',
        user_id: '990'
      }];
    
      component.listaVendedores = mockVendedores;
      component.idVendedorSeleccionado = '1';
      spyOn(component.consultaVendedoresForm, 'patchValue');
    
      component.crearUrlConId();
    
      expect(component.isInViewMode).toBeTrue();
      
      expect(component.consultaVendedoresForm.patchValue).toHaveBeenCalledWith({
        fieldNumeroIdentificacion: Number(component.idVendedorSeleccionado),
        fieldNombre: 'Test Seller',
        fieldCorreoElectronico: 'test@example.com',
        fieldDireccion: '123 Street',
        fieldTelefono: '1234567890',
        fieldZona: 'NORTE'
      });

      const getReq = httpMock.expectOne(apiUrlSellers);
      getReq.flush({ sellers: [] });
    });
  });

  describe('autoComplete', () => {
    beforeEach(() => {
      component.listaVendedores = mockVendedores;
      component.autoCompletar();
    });
  
    it('should properly filter identification numbers', fakeAsync(() => {
      const emittedValues: number[][] = [];
      const subscription = component.numerosIdentificacionFiltrados.subscribe(
        values => emittedValues.push(values)
      );
      tick();

      component.consultaVendedoresForm.get('fieldNumeroIdentificacion')?.setValue('');
      tick(300); 
      
      component.consultaVendedoresForm.get('fieldNumeroIdentificacion')?.setValue('1');
      tick(300);
      
      component.consultaVendedoresForm.get('fieldNumeroIdentificacion')?.setValue('999');
      tick(300);
      
      // Para evitar fuga de memoria
      subscription.unsubscribe();
  
      expect(emittedValues).toEqual([
        [123, 456],  // Todos los valores del autocomplete (antes de escribir)
        [123, 456],  // No se escribe nada (se selecciona el autocomplete)
        [123],       // Se escribe '1'
        []           // No hay coincidencias para '999'
      ]);

      const getReq = httpMock.expectOne(apiUrlSellers);
      getReq.flush({ sellers: [] });
    }));
  });

  describe('withSelectedSeller', () => {
    it('should navigate with seller id', () => {
      component.listaVendedores = mockVendedores;
      component.conVendedorSeleccionado(123);

      expect(router.navigate).toHaveBeenCalledWith(['view'], {
        relativeTo: route,
        queryParams: { id: '1' },
        queryParamsHandling: 'merge',
        replaceUrl: true
      });

      const getReq = httpMock.expectOne(apiUrlSellers);
      getReq.flush({ sellers: [] });
    });
  });

  describe('createNewSeller', () => {
    beforeEach(() => {

      component.initializeForms();
      component.registroVendedoresForm.patchValue({
        fieldNumeroIdentificacion: '123',
        fieldNombre: 'Test User',
        fieldCorreoElectronico: 'test@example.com',
        fieldDireccion: '123 Street',
        fieldTelefono: '1234567890',
        fieldZona: 'NORTE'
      });
    });
  
    it('should call apiService.postData and handle success', () => {
      const clearAllSpy = spyOn(component, 'clearAll');
      const loadSellersSpy = spyOn(component, 'cargarVendedores');
  
      component.crearNuevoVendedor();
  
      expect(component.isSubmitting).toBe(true);
      
      const req = httpMock.expectOne(apiUrlSellers + `/add`);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual({
        identification_number: '123',
        name: 'Test User',
        email: 'test@example.com',
        username: 'Vendedor123',
        password: '123',
        address: '123 Street',
        phone: '1234567890',
        zone: 'NORTE'
      });
      req.flush({});
  
      expect(component.isSubmitting).toBe(false);
      expect(clearAllSpy).toHaveBeenCalled();
      expect(loadSellersSpy).toHaveBeenCalled();

      const getReq = httpMock.expectOne(apiUrlSellers);
      getReq.flush({ sellers: [] });
    });
  
    it('should handle 409 conflict error', () => {
      component.crearNuevoVendedor();
  
      const req = httpMock.expectOne(apiUrlSellers + `/add`);
      req.flush(null, { 
        status: 409, 
        statusText: 'Conflict' 
      });
  
      expect(component.registroVendedoresForm.get('fieldNumeroIdentificacion')?.errors).toBeNull();
      expect(component.isSubmitting).toBe(false);

      const getReq = httpMock.expectOne(apiUrlSellers);
      getReq.flush({ sellers: [] });
    });
  });

  describe('toggleMode', () => {
    beforeEach(() => {
      jasmine.getEnv().allowRespy(true);
    });

    it('should toggle isInViewMode and reset form', () => {
      component.isInViewMode = true;
  
      const cargarVendedoresSpy = spyOn(component, 'cargarVendedores');
      const limpiarUrlConId = spyOn(component, 'limpiarUrlConId');
      const resetFormSpy = spyOn(component.consultaVendedoresForm, 'reset');
      const navigateSpy = spyOn(router, 'navigate');
  
      component.toggleMode();
  
      expect(cargarVendedoresSpy).toHaveBeenCalled();
      expect(limpiarUrlConId).toHaveBeenCalled();
      expect(resetFormSpy).toHaveBeenCalled();
      expect(navigateSpy).not.toHaveBeenCalled();
      expect(component.isInViewMode).toBeFalse();

      const req = httpMock.expectOne(`${environment.apiUrlSellers}/sellers`);
      req.flush({});
    });
  
    it('should navigate when toggling back to view mode', () => {
      component.isInViewMode = false;
  
      const cargarVendedoresSpy = spyOn(component, 'cargarVendedores');
      const limpiarUrlConId = spyOn(component, 'limpiarUrlConId');
      const resetFormSpy = spyOn(component.consultaVendedoresForm, 'reset');
      const navigateSpy = spyOn(router, 'navigate');
  
      component.toggleMode();
  
      expect(navigateSpy).toHaveBeenCalledWith(['view'], {
        relativeTo: route,
        queryParamsHandling: 'preserve'
      });
      expect(cargarVendedoresSpy).not.toHaveBeenCalled();
      expect(limpiarUrlConId).not.toHaveBeenCalled();
      expect(resetFormSpy).not.toHaveBeenCalled();
      expect(component.isInViewMode).toBeTrue();

      const req = httpMock.expectOne(`${environment.apiUrlSellers}/sellers`);
      req.flush({});
    });
  });

  describe('onSubmit', () => {
    it('should refresh sellers after successful submission', fakeAsync(() => {
      const initialGetReq = httpMock.expectOne(apiUrlSellers);
      expect(initialGetReq.request.method).toBe('GET');
      initialGetReq.flush({ sellers: [] });
  
      component.registroVendedoresForm.patchValue({
        fieldNumeroIdentificacion: '123',
        fieldNombre: 'Test User',
        fieldCorreoElectronico: 'test@example.com',
        fieldDireccion: '123 Street',
        fieldTelefono: '1234567890',
        fieldZona: 'NORTE'
      });
      
      const clearAllSpy = spyOn(component, 'clearAll');
      const cargarVendedoresSpy = spyOn(component, 'cargarVendedores').and.callThrough();
  
      component.onSubmit();
      tick();
      
      const postReq = httpMock.expectOne(apiUrlSellers + '/add');
      expect(postReq.request.method).toBe('POST');
      postReq.flush({ message: "Seller created successfully" });
      
      const secondGetReq = httpMock.expectOne(apiUrlSellers);
      expect(secondGetReq.request.method).toBe('GET');
      secondGetReq.flush({ sellers: [] });
  
      expect(clearAllSpy).toHaveBeenCalled();
      expect(cargarVendedoresSpy).toHaveBeenCalled();
    }));
  });

  describe('clearAll', () => {
    it('should reset the registroVendedoresForm', () => {
      component.registroVendedoresForm.patchValue({
        fieldnidentificationnumber: '789',
        fieldname: 'New User'
      });

      component.clearAll();

      expect(component.registroVendedoresForm.value).toEqual({
        fieldNumeroIdentificacion: null,
        fieldNombre: null,
        fieldCorreoElectronico: null,
        fieldDireccion: null,
        fieldTelefono: null,
        fieldZona: null
      });
      expect(component.registroVendedoresForm.pristine).toBeTrue();
      expect(component.registroVendedoresForm.untouched).toBeTrue();
      expect(component.registroVendedoresForm.errors).toBeNull();

      const getReq = httpMock.expectOne(apiUrlSellers);
      getReq.flush({ sellers: [] });
    });
  });
});

/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PlanesDeVentaComponent } from './planes-de-venta.component';
import { VentasModule } from '../ventas.module';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PlanesDeVentaService } from './planes-de-venta.service';
import { Vendedor } from '../../vendedores/vendedores.model';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Producto } from '../../productos/producto.model';

describe('PlanesDeVentaComponent', () => {
  let component: PlanesDeVentaComponent;
  let fixture: ComponentFixture<PlanesDeVentaComponent>;
  let service: PlanesDeVentaService;
  let httpMock: HttpTestingController;

  let apiUrlSellers = environment.apiUrlSellers + `/sellers`;
  let apiUrlProducts = environment.apiUrlProducts + `/products`;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanesDeVentaComponent ],
      imports: [
        VentasModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers:[
        PlanesDeVentaService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanesDeVentaComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(PlanesDeVentaService);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

    const reqGetSellers = httpMock.expectOne(apiUrlSellers);
    reqGetSellers.flush([]);

    const reqGetProducts = httpMock.expectOne(apiUrlProducts);
    reqGetProducts.flush([]);
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      spyOn(component.definicionPlanDeVentasForm, 'markAllAsTouched');
      spyOn(component, 'crearPlanDeVentas');
    });
  
    it('should mark all as touched and return when form is invalid', () => {
      Object.defineProperty(component.definicionPlanDeVentasForm, 'invalid', {
        get: () => true
      });
      
      component.onSubmit();
      
      expect(component.definicionPlanDeVentasForm.markAllAsTouched).toHaveBeenCalled();
      expect(component.crearPlanDeVentas).not.toHaveBeenCalled();

      const reqGetSellers = httpMock.expectOne(apiUrlSellers);
      reqGetSellers.flush([]);
  
      const reqGetProducts = httpMock.expectOne(apiUrlProducts);
      reqGetProducts.flush([]);
    });
  
    it('should submit when form is valid', () => {
      Object.defineProperty(component.definicionPlanDeVentasForm, 'invalid', {
        get: () => false
      });
      
      component.onSubmit();
      
      expect(component.definicionPlanDeVentasForm.markAllAsTouched).not.toHaveBeenCalled();
      expect(component.crearPlanDeVentas).toHaveBeenCalled();

      const reqGetSellers = httpMock.expectOne(apiUrlSellers);
      reqGetSellers.flush([]);
  
      const reqGetProducts = httpMock.expectOne(apiUrlProducts);
      reqGetProducts.flush([]);
    });
  });

  describe('conVendedorSeleccionado', () => {
    it('should set idVendedorSeleccionado and update form control value', () => {
      const mockVendedor: Vendedor = { 
        id: 'b8ad058bca7d-0f3f-413d-89e1-e5924f2e', 
        name: 'Vendedor1',
        identification_number: 1025485640,
        email: 'testuser1@testmail.com',
        address: 'Avenida Falsa 123',
        phone: '7540563',
        zone: 'NORTE',
        user_id: 'fd6472db-cf25-48b2-b4ab-5e9978c878d5'
      };
      const mockEvent = { 
        option: { value: mockVendedor } 
      } as MatAutocompleteSelectedEvent;
      
      const formControl = component.definicionPlanDeVentasForm.get('fieldVendedor') as FormControl;
      spyOn(formControl, 'setValue');

      component.conVendedorSeleccionado(mockEvent);
  
      expect(component.idVendedorSeleccionado).toBe('b8ad058bca7d-0f3f-413d-89e1-e5924f2e');
      expect(formControl.setValue).toHaveBeenCalledWith(1025485640);

      const reqGetSellers = httpMock.expectOne(apiUrlSellers);
      reqGetSellers.flush([]);
  
      const reqGetProducts = httpMock.expectOne(apiUrlProducts);
      reqGetProducts.flush([]);
    });
  
    it('should handle undefined option value safely', () => {
      const mockEvent = { 
        option: { value: null } 
      } as MatAutocompleteSelectedEvent;
  
      component.conVendedorSeleccionado(mockEvent);
  
      expect(component.idVendedorSeleccionado).toBeNull();

      const reqGetSellers = httpMock.expectOne(apiUrlSellers);
      reqGetSellers.flush([]);
  
      const reqGetProducts = httpMock.expectOne(apiUrlProducts);
      reqGetProducts.flush([]);
    });
  });

  describe('conProductoSeleccionado', () => {
    it('should set idProductoSeleccionado and update form control value', () => {
      const mockProducto: Producto = { 
        id: '48b2b4ab-cf25-48b2-b4ab-5e9978c878d5',
        name: 'Test Product',
        sku: 'sku1234',
        unit_value: 1500,
        storage_conditions: 'Prueba',
        product_features: 'Prueba',
        provider_id: 'e5924f2e-0f3f-413d-89e1-b8ad058bca7d', 
        estimated_delivery_time: '2025-05-02', 
        photo: 'zhzrdhdhw',
        description: 'Prueba',
        category: 'LIMPIEZA'
      };
      const mockEvent = { 
        option: { value: mockProducto } 
      } as MatAutocompleteSelectedEvent;
      
      const formControl = component.definicionPlanDeVentasForm.get('fieldProducto') as FormControl;
      spyOn(formControl, 'setValue');

      component.conProductoSeleccionado(mockEvent);
  
      expect(component.idProductoSeleccionado).toBe('48b2b4ab-cf25-48b2-b4ab-5e9978c878d5');
      expect(formControl.setValue).toHaveBeenCalledWith('Test Product');

      const reqGetSellers = httpMock.expectOne(apiUrlSellers);
      reqGetSellers.flush([]);
  
      const reqGetProducts = httpMock.expectOne(apiUrlProducts);
      reqGetProducts.flush([]);
    });
  
    it('should handle undefined option value safely', () => {
      const mockEvent = { 
        option: { value: null } 
      } as MatAutocompleteSelectedEvent;
  
      component.conProductoSeleccionado(mockEvent);
  
      expect(component.idProductoSeleccionado).toBeNull();

      const reqGetSellers = httpMock.expectOne(apiUrlSellers);
      reqGetSellers.flush([]);
  
      const reqGetProducts = httpMock.expectOne(apiUrlProducts);
      reqGetProducts.flush([]);
    });
  });

  describe('crearPlanDeVentas', () => {
    it('should create sales plan successfully and clear form', () => {
      component.definicionPlanDeVentasForm.get('fieldMeta')?.setValue(1000);
      component.definicionPlanDeVentasForm.get('fieldPeriodo')?.setValue('ANUAL');
      
      component.listaVendedores = [{
         id: 'b8ad058bca7d-0f3f-413d-89e1-e5924f2e', 
         name: 'Vendedor1',
         identification_number: 1025485640,
         email: 'testuser1@testmail.com',
         address: 'Avenida Falsa 123',
         phone: '7540563',
         zone: 'NORTE',
         user_id: 'fd6472db-cf25-48b2-b4ab-5e9978c878d5'
        }];
      component.listaProductos = [{ 
        id: '48b2b4ab-cf25-48b2-b4ab-5e9978c878d5',
        name: 'Test Product',
        sku: 'sku1234',
        unit_value: 1500,
        storage_conditions: 'Prueba',
        product_features: 'Prueba',
        provider_id: 'e5924f2e-0f3f-413d-89e1-b8ad058bca7d', 
        estimated_delivery_time: '2025-05-02', 
        photo: 'zhzrdhdhw',
        description: 'Prueba',
        category: 'LIMPIEZA'
      }];
      
      spyOn(component, 'clearAll').and.callThrough();
      
      component.crearPlanDeVentas();
      
      const req = httpMock.expectOne(environment.apiUrlSales + '/sales-plans/add');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        seller_id: component.idVendedorSeleccionado,
        target: 1000,
        product_id: component.idProductoSeleccionado,
        period: 'ANUAL'
      });
      
      req.flush({message: "Sales period created successfully", id: "4cb6cb61-87e8-4861-8002-2e8f3b470305"});
      
      expect(component.isSubmitting).toBeFalse();
      expect(component.clearAll).toHaveBeenCalled();

      const reqGetSellers = httpMock.expectOne(apiUrlSellers);
      reqGetSellers.flush([]);
  
      const reqGetProducts = httpMock.expectOne(apiUrlProducts);
      reqGetProducts.flush([]);
    });
  
    it('should handle 409 conflict error and reset form', () => {
      component.definicionPlanDeVentasForm.get('fieldMeta')?.setValue(1000);
      component.definicionPlanDeVentasForm.get('fieldPeriodo')?.setValue('TRIMESTRAL');
      
      component.listaVendedores = [{
        id: 'b8ad058bca7d-0f3f-413d-89e1-e5924f2e', 
        name: 'Vendedor1',
        identification_number: 1025485640,
        email: 'testuser1@testmail.com',
        address: 'Avenida Falsa 123',
        phone: '7540563',
        zone: 'NORTE',
        user_id: 'fd6472db-cf25-48b2-b4ab-5e9978c878d5'
      }];
     component.listaProductos = [{ 
       id: '48b2b4ab-cf25-48b2-b4ab-5e9978c878d5',
       name: 'Test Product',
       sku: 'sku1234',
       unit_value: 1500,
       storage_conditions: 'Prueba',
       product_features: 'Prueba',
       provider_id: 'e5924f2e-0f3f-413d-89e1-b8ad058bca7d', 
       estimated_delivery_time: '2025-05-02', 
       photo: 'zhzrdhdhw', 
       description: 'Prueba', 
       category: 'LIMPIEZA'
     }];
     
      component.crearPlanDeVentas();
      
      const req = httpMock.expectOne(environment.apiUrlSales + '/sales-plans/add');
      
      req.flush({}, { status: 409, statusText: 'Conflict' });
      
      expect(component.isSubmitting).toBeFalse();
      expect(component.definicionPlanDeVentasForm.errors).toBeNull();
      expect(component.definicionPlanDeVentasForm.dirty).toBeFalse();

      const reqGetSellers = httpMock.expectOne(apiUrlSellers);
      reqGetSellers.flush([]);
  
      const reqGetProducts = httpMock.expectOne(apiUrlProducts);
      reqGetProducts.flush([]);
    });
  
    it('should handle other errors and log to console', () => {
      component.definicionPlanDeVentasForm.get('fieldMeta')?.setValue(1000);
      component.definicionPlanDeVentasForm.get('fieldPeriodo')?.setValue('2023-06');
      
      component.listaVendedores = [{
        id: 'b8ad058bca7d-0f3f-413d-89e1-e5924f2e', 
        name: 'Vendedor1',
        identification_number: 1025485640,
        email: 'testuser1@testmail.com',
        address: 'Avenida Falsa 123',
        phone: '7540563',
        zone: 'NORTE',
        user_id: 'fd6472db-cf25-48b2-b4ab-5e9978c878d5'
       }];
     component.listaProductos = [{ 
       id: '48b2b4ab-cf25-48b2-b4ab-5e9978c878d5',
       name: 'Test Product',
       sku: 'sku1234',
       unit_value: 1500,
       storage_conditions: 'Prueba',
       product_features: 'Prueba',
       provider_id: 'e5924f2e-0f3f-413d-89e1-b8ad058bca7d', 
       estimated_delivery_time: '2025-05-02', 
       photo: 'zhzrdhdhw', 
       description: 'Prueba', 
       category: 'LIMPIEZA'
     }];
     
      spyOn(console, 'error');
      
      component.crearPlanDeVentas();
      
      const req = httpMock.expectOne(environment.apiUrlSales + '/sales-plans/add');
      req.flush({}, { status: 500, statusText: 'Internal Server Error' });
      
      expect(component.isSubmitting).toBeFalse();
      expect(console.error).toHaveBeenCalledWith('Error creating sales plan');

      const reqGetSellers = httpMock.expectOne(apiUrlSellers);
      reqGetSellers.flush([]);
  
      const reqGetProducts = httpMock.expectOne(apiUrlProducts);
      reqGetProducts.flush([]);
    });
  });

  describe('clearAll', () => {
    it('should reset the registroVendedoresForm', () => {
      component.definicionPlanDeVentasForm.patchValue({
        fieldVendedor: '107894560',
        fieldMeta: 150000,
        fieldProducto: 'Producto Test',
        fieldPeriodo: 'TRIMESTRAL'
      });

      component.clearAll();

      expect(component.definicionPlanDeVentasForm.value).toEqual({
        fieldVendedor: null,
        fieldMeta: null,
        fieldProducto: null,
        fieldPeriodo: null
      });
      expect(component.definicionPlanDeVentasForm.pristine).toBeTrue();
      expect(component.definicionPlanDeVentasForm.untouched).toBeTrue();
      expect(component.definicionPlanDeVentasForm.errors).toBeNull();

      const reqGetSellers = httpMock.expectOne(apiUrlSellers);
      reqGetSellers.flush([]);
  
      const reqGetProducts = httpMock.expectOne(apiUrlProducts);
      reqGetProducts.flush([]);
    });
  });
});

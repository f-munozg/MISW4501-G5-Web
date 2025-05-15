/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { InventariosModule } from '../inventarios.module';
import { RegistroMovimientoInventarioComponent } from './registro-movimiento-inventario.component';
import { RegistroMovimientoInventarioService } from './registro-movimiento-inventario.service';
import { Producto } from '../../productos/producto.model';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { of, throwError } from 'rxjs';

const mockProductosResponse = {
  products: [
    {
      id: "27644658-6c5c-4643-8121-c30bed696f68",
      sku: "SKU-123",
      name: "Chocolisto",
      unit_value: 10,
      storage_conditions: "Seco",
      product_features: "Chocolate",
      provider_id: "04303760-c1c2-48b0-a51e-496e9a52cca5",
      estimated_delivery_time: "2025-05-14",
      photo: "photo.jpg",
      description: "Chocolate",
      category: "ALIMENTACIÓN"
    },
    {
      id: "38644658-6c5c-4643-8121-c30bed696f69",
      sku: "SKU-124",
      name: "Leche",
      unit_value: 5,
      storage_conditions: "Refrigerado",
      product_features: "Leche",
      provider_id: "1e783abf-b6ae-4df3-80f4-c3936645389e",
      estimated_delivery_time: "2025-05-14",
      photo: "milk.jpg",
      description: "Leche",
      category: "ALIMENTACIÓN"
    }
  ]
};

describe('RegistroMovimientoInventarioComponent', () => {
  let component: RegistroMovimientoInventarioComponent;
  let fixture: ComponentFixture<RegistroMovimientoInventarioComponent>;
  let service: RegistroMovimientoInventarioService;
  let httpMock: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroMovimientoInventarioComponent ],
      imports: [ InventariosModule, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule ],
      providers: [ RegistroMovimientoInventarioService ]
    })
    .compileComponents();

    service = TestBed.inject(RegistroMovimientoInventarioService);
    httpMock = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroMovimientoInventarioComponent);
    fixture.detectChanges();
    service = TestBed.inject(RegistroMovimientoInventarioService);
    httpMock = TestBed.inject(HttpTestingController);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('cargarFabricantes', () => {
    const mockBodegasResponse = {
      Warehouses: [
        { 
          id: '06e5eb12-6b13-4b3c-b2a2-fc0f0da48783', 
          name: 'Bodega Norte', 
          address: 'Calle 170', 
          country: 'Colombia', 
          city: 'Bogotá', 
          location: '4.752666865357205, -74.05062043333939', 
          storage_volume: 200, 
          available_volume: 150, 
          truck_capacity: 50 
        },
        {
          id: '40184401-cb1e-48a5-8438-a6c58e416e9a', 
          name: 'Bodega Sur', 
          address: 'Calle 17 Sur', 
          country: 'Colombia', 
          city: 'Bogotá', 
          location: '4.569314857913806, -74.08300730013089', 
          storage_volume: 275, 
          available_volume: 225, 
          truck_capacity: 50
        }
      ]
    };

    beforeEach(() => {
      component.listaBodegas = [];
    });

    it('should load warehouses and update listaBodegas on successful API call', () => {
      spyOn(service, 'getListaBodegas').and.returnValue(of(mockBodegasResponse));

      component.cargarFabricantes();

      expect(component.listaBodegas).toEqual(mockBodegasResponse.Warehouses);
    });

    it('should handle empty response from API', () => {
      spyOn(service, 'getListaBodegas').and.returnValue(of({ Warehouses: [] }));
      
      component.cargarFabricantes();

      expect(component.listaBodegas).toEqual([]);
    });

    it('should not update listaBodegas on API error', () => {
      const consoleSpy = spyOn(console, 'error');
      spyOn(service, 'getListaBodegas').and.returnValue(throwError(() => new Error('Network error')));
      
      component.cargarFabricantes();
      
      expect(component.listaBodegas).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith('Error loading warehouses:', jasmine.any(Error));
    });
  });

  describe('autoCompletar', () => {
    it('should initialize filtered products observable', () => {
      component.listaProductos = mockProductosResponse.products;
      component.autoCompletar();
      
      expect(component.nombresProductosFiltrados).toBeDefined();
      
      component.nombresProductosFiltrados.subscribe(result => {
        expect(result.length).toBe(2);
        expect(result).toEqual(['Chocolisto', 'Leche']);
      });
    });
  });

  describe('_filtrarNombresProductos', () => {
    it('should filter products by name', () => {
      component.listaProductos = mockProductosResponse.products;
      
      const result = component._filtrarNombresProductos('Choco');
      expect(result.length).toBe(1);
      expect(result[0]).toBe('Chocolisto');
    });

    it('should return empty array if no match', () => {
      component.listaProductos = mockProductosResponse.products;
      
      const result = component._filtrarNombresProductos('XYZ');
      expect(result.length).toBe(0);
    });

    it('should return all products if empty filter', () => {
      component.listaProductos = mockProductosResponse.products;
      
      const result = component._filtrarNombresProductos('');
      expect(result.length).toBe(2);
    });
  });

  describe('cargarProductos', () => {
    it('should load products and update filtered list', fakeAsync(() => {
      spyOn(component, 'autoCompletar').and.callThrough();

      component.listaProductos = [];
      
      component.cargarProductos();
      tick();
      
      const reqs = httpMock.match(req => req.url.includes('/products'));
      expect(reqs.length).toBe(2);

      reqs[0].flush(mockProductosResponse);
      reqs[1].flush(mockProductosResponse);
      tick();

      expect(component.listaProductos.length).toBe(2);
      expect(component.autoCompletar).toHaveBeenCalled();
    }));

    it('should handle error when loading products', fakeAsync(() => {
      spyOn(console, 'error');
      
      component.listaProductos = [];
      
      component.cargarProductos();
      tick(); 
      
      const reqs = httpMock.match(req => req.url.includes('/products'));
      
      expect(reqs.length).toBe(2);
      
      reqs[0].error(new ErrorEvent('Error loading products'));
      tick();
      
      expect(console.error).toHaveBeenCalled();
    }));

  });

  describe('conProductoSeleccionado', () => {
    const mockProduct: Producto = {
      id: "27644658-6c5c-4643-8121-c30bed696f68",
      name: "Chocolisto",
      sku: "SKU-123",
      unit_value: 10,
      storage_conditions: "Seco",
      product_features: "Chocolate",
      provider_id: "04303760-c1c2-48b0-a51e-496e9a52cca5",
      estimated_delivery_time: "2025-05-14",
      photo: "photo.jpg",
      description: "Chocolate",
      category: "ALIMENTACIÓN"
    };

    beforeEach(() => {
      component.registroMovimientoInventarioForm = new FormGroup({
        fieldProducto: new FormControl(''),
        fieldBodega: new FormControl(null),
        fieldCantidad: new FormControl(null),
        fieldTipoMovimiento: new FormControl(null)
      });

      component.listaProductos = [mockProduct];
    });

    it('should not throw error when form control is missing', () => {
      const mockEvent = {
        option: {
          value: mockProduct.name
        }
      } as MatAutocompleteSelectedEvent;

      component.registroMovimientoInventarioForm.removeControl('fieldProducto');
      
      component.conProductoSeleccionado(mockEvent);

      expect(component.idProductoSeleccionado).toBe(mockProduct.id);
    });

    it('should handle null product selection by clearing values', () => {
      const mockEvent = {
        option: {
          value: null
        }
      } as MatAutocompleteSelectedEvent;

      component.idProductoSeleccionado = mockProduct.id;
      component.registroMovimientoInventarioForm.get('fieldProducto')?.setValue(mockProduct.name);

      component.conProductoSeleccionado(mockEvent);

      expect(component.idProductoSeleccionado).toBeNull();
      expect(component.registroMovimientoInventarioForm.get('fieldProducto')?.value)
        .toBe('');
    });

    it('should handle undefined product selection by clearing values', () => {
      const mockEvent = {
        option: {
          value: undefined
        }
      } as MatAutocompleteSelectedEvent;

      component.idProductoSeleccionado = mockProduct.id;
      component.registroMovimientoInventarioForm.get('fieldProducto')?.setValue(mockProduct.name);

      component.conProductoSeleccionado(mockEvent);

      expect(component.idProductoSeleccionado).toBeNull();
      expect(component.registroMovimientoInventarioForm.get('fieldProducto')?.value)
        .toBe('');
    });

    it('should handle missing option in event', () => {
      const mockEvent = {
        option: undefined
      } as unknown as MatAutocompleteSelectedEvent;

      component.idProductoSeleccionado = mockProduct.id;
      component.registroMovimientoInventarioForm.get('fieldProducto')?.setValue(mockProduct.name);

      component.conProductoSeleccionado(mockEvent);

      expect(component.idProductoSeleccionado).toBeNull();
      expect(component.registroMovimientoInventarioForm.get('fieldProducto')?.value)
        .toBe('');
    });

    it('should not throw error when form control is missing', () => {
      const mockEvent = {
        option: {
          value: mockProduct
        }
      } as MatAutocompleteSelectedEvent;
      
      component.registroMovimientoInventarioForm.removeControl('fieldProducto');

      expect(() => component.conProductoSeleccionado(mockEvent)).not.toThrow();
      expect(component.idProductoSeleccionado).toBe(mockProduct.id);
    });
  });

  describe('clearAll', () => {
    it('should reset the form to its initial state', () => {
      component.registroMovimientoInventarioForm.patchValue({
        fieldProducto: 'Producto Prueba',
        fieldBodega: 'Bodega Principal',
        fieldCantidad: 5,
        fieldTipoMovimiento: 'ENTRADA'
      });
      
      component.registroMovimientoInventarioForm.markAsDirty();
      component.registroMovimientoInventarioForm.markAsTouched();
      component.registroMovimientoInventarioForm.setErrors({invalid: true});

      component.clearAll();

      expect(component.registroMovimientoInventarioForm.value).toEqual({
        fieldProducto: null,
        fieldBodega: null,
        fieldCantidad: null,
        fieldTipoMovimiento: null
      });
      expect(component.registroMovimientoInventarioForm.pristine).toBeTrue();
      expect(component.registroMovimientoInventarioForm.untouched).toBeTrue();
      expect(component.registroMovimientoInventarioForm.errors).toBeNull();
    });

    it('should call all necessary form reset methods', () => {
      spyOn(component.registroMovimientoInventarioForm, 'reset');
      spyOn(component.registroMovimientoInventarioForm, 'markAsPristine');
      spyOn(component.registroMovimientoInventarioForm, 'markAsUntouched');
      spyOn(component.registroMovimientoInventarioForm, 'setErrors');

      component.clearAll();

      expect(component.registroMovimientoInventarioForm.reset).toHaveBeenCalled();
      expect(component.registroMovimientoInventarioForm.markAsPristine).toHaveBeenCalled();
      expect(component.registroMovimientoInventarioForm.markAsUntouched).toHaveBeenCalled();
      expect(component.registroMovimientoInventarioForm.setErrors).toHaveBeenCalledWith(null);
    });
  });
});

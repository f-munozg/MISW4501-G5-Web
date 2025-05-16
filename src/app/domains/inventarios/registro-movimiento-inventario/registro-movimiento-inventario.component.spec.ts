/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { InventariosModule } from '../inventarios.module';
import { RegistroMovimientoInventarioComponent, TableRow } from './registro-movimiento-inventario.component';
import { RegistroMovimientoInventarioService } from './registro-movimiento-inventario.service';
import { Producto } from '../../productos/producto.model';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { delay, of, Subject, throwError } from 'rxjs';
import { Bodega } from '../../bodegas/bodegas.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegistroMovimiento, RegistroMovimientoResponse, TipoMovimiento } from '../inventario.model';

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

  describe('cargarListaMovimientos', () => {
    const mockMovimientos: RegistroMovimientoResponse = {
        movimientos: [
        {
          fecha: '2025-05-01T10:00:00',
          nombre_producto: 'Chocolisto',
          nombre_bodega: 'Bodega Norte',
          tipo_movimiento: TipoMovimiento.INGRESO,
          cantidad: 10,
          usuario: '5729c444-170c-4397-a6c0-b50bde8da214'
        },
        {
          fecha: '2025-05-02T14:30:00',
          nombre_producto: 'Leche',
          nombre_bodega: 'Bodega Sur',
          tipo_movimiento: TipoMovimiento.SALIDA,
          cantidad: 5,
          usuario: '5729c444-170c-4397-a6c0-b50bde8da214'
        }
      ]
    };

    let snackBar: MatSnackBar;

    beforeEach(() => {
      snackBar = TestBed.inject(MatSnackBar);
      spyOn(snackBar, 'open');
      spyOn(console, 'error');
      
      component.tableData = [];
      component.isRefreshing = false;
    });

    it('should set isRefreshing to true when loading starts', () => {
      const movimientosSubject = new Subject<RegistroMovimientoResponse>();
      spyOn(service, 'getListaMovimientos').and.returnValue(movimientosSubject.asObservable());
      
      component.cargarListaMovimientos();
      
      expect(component.isRefreshing).toBeTrue();
      
      movimientosSubject.next(mockMovimientos);
      movimientosSubject.complete();
    });

    it('should set tableData with API response on success', fakeAsync(() => {
      spyOn(service, 'getListaMovimientos').and.returnValue(of(mockMovimientos));
      
      component.cargarListaMovimientos();
      tick();
      
      expect(component.isRefreshing).toBeFalse();
      expect(component.tableData).toEqual(mockMovimientos.movimientos);
      expect(snackBar.open).not.toHaveBeenCalled();
    }));

    it('should set isRefreshing to false after success', fakeAsync(() => {
      spyOn(service, 'getListaMovimientos').and.returnValue(of(mockMovimientos));
      
      component.cargarListaMovimientos();
      tick();
      
      expect(component.isRefreshing).toBeFalse();
    }));

    it('should handle API error and show snackbar message', fakeAsync(() => {
      const errorResponse = new Error('API Error');
      spyOn(service, 'getListaMovimientos').and.returnValue(throwError(() => errorResponse));
      
      component.cargarListaMovimientos();
      tick();
      
      expect(component.isRefreshing).toBeFalse();
      expect(console.error).toHaveBeenCalledWith('Error loading movements:', errorResponse);
      expect(snackBar.open).toHaveBeenCalledWith(
        'Error al cargar los movimientos', 
        'Cerrar', 
        { duration: 5000, panelClass: ['error-snackbar'] }
      );
    }));

    it('should set isRefreshing to true when loading starts', fakeAsync(() => {
      spyOn(service, 'getListaMovimientos').and.returnValue(
        of(mockMovimientos).pipe(delay(1))
      );
      
      component.cargarListaMovimientos();
      
      expect(component.isRefreshing).toBeTrue();
      
      tick(1);
    }));

    it('should not modify tableData on error', fakeAsync(() => {
      const initialData: RegistroMovimiento[] = [{
        fecha: '2025-04-30T09:00:00',
        nombre_producto: 'Chocolisto',
        nombre_bodega: 'Bodega Principal',
        tipo_movimiento: TipoMovimiento.INGRESO,
        cantidad: 3,
        usuario: '5729c444-170c-4397-a6c0-b50bde8da214'
      }];
      
      component.tableData = initialData;
      spyOn(service, 'getListaMovimientos').and.returnValue(throwError(() => new Error('API Error')));
      
      component.cargarListaMovimientos();
      tick();
      
      expect(component.tableData).toEqual(initialData);
    }));
  });

  describe('activarCamposAdicionales', () => {
    beforeEach(() => {
      component.registroMovimientoInventarioForm = new FormGroup({
        fieldProducto: new FormControl(''),
        fieldBodega: new FormControl(null),
        fieldCantidad: new FormControl(null),
        fieldTipoMovimiento: new FormControl(null),
        fieldLimiteStock: new FormControl({value: null, disabled: true}),
        fieldNivelCritico: new FormControl({value: null, disabled: true}),
        fieldUbicacion: new FormControl({value: null, disabled: true}),
        fieldFechaVencimiento: new FormControl({value: null, disabled: true})
      });

      component.mostrarCamposAdicionales = false;
    });

    it('should toggle mostrarCamposAdicionales flag', () => {
      expect(component.mostrarCamposAdicionales).toBeFalse();
      
      component.activarCamposAdicionales();
      expect(component.mostrarCamposAdicionales).toBeTrue();
      
      component.activarCamposAdicionales();
      expect(component.mostrarCamposAdicionales).toBeFalse();
    });

    it('should enable additional fields when mostrarCamposAdicionales is true', () => {
      component.activarCamposAdicionales();
      
      expect(component.registroMovimientoInventarioForm.get('fieldLimiteStock')?.enabled).toBeTrue();
      expect(component.registroMovimientoInventarioForm.get('fieldNivelCritico')?.enabled).toBeTrue();
      expect(component.registroMovimientoInventarioForm.get('fieldUbicacion')?.enabled).toBeTrue();
      expect(component.registroMovimientoInventarioForm.get('fieldFechaVencimiento')?.enabled).toBeTrue();
    });

    it('should disable additional fields when mostrarCamposAdicionales is false', () => {
      component.activarCamposAdicionales();
      expect(component.mostrarCamposAdicionales).toBeTrue();
      
      component.activarCamposAdicionales();
      
      expect(component.registroMovimientoInventarioForm.get('fieldLimiteStock')?.disabled).toBeTrue();
      expect(component.registroMovimientoInventarioForm.get('fieldNivelCritico')?.disabled).toBeTrue();
      expect(component.registroMovimientoInventarioForm.get('fieldUbicacion')?.disabled).toBeTrue();
      expect(component.registroMovimientoInventarioForm.get('fieldFechaVencimiento')?.disabled).toBeTrue();
    });

    it('should not throw errors when additional fields are missing from the form', () => {
      component.registroMovimientoInventarioForm.removeControl('fieldLimiteStock');
      
      expect(() => component.activarCamposAdicionales()).not.toThrow();
      expect(component.mostrarCamposAdicionales).toBeTrue();

      expect(component.registroMovimientoInventarioForm.get('fieldNivelCritico')?.enabled).toBeTrue();
    });

    it('should handle case when form is not initialized', () => {
      component.registroMovimientoInventarioForm = null as any;
      
      expect(() => component.activarCamposAdicionales()).not.toThrow();
      expect(component.mostrarCamposAdicionales).toBeTrue();
      
      expect(() => component.activarCamposAdicionales()).not.toThrow();
      expect(component.mostrarCamposAdicionales).toBeFalse();
    });
  });

  describe('onSubmit', () => {
    const mockProduct: Producto = {
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
    };

    const mockBodega: Bodega = {
      id: "06e5eb12-6b13-4b3c-b2a2-fc0f0da48783",
      name: "Bodega Norte"
    };

    let snackBar: MatSnackBar;

    beforeEach(() => {
      component.registroMovimientoInventarioForm = new FormGroup({
        fieldProducto: new FormControl('', Validators.required),
        fieldBodega: new FormControl('', Validators.required),
        fieldCantidad: new FormControl('', [Validators.required, Validators.min(1)]),
        fieldTipoMovimiento: new FormControl('', Validators.required),
        fieldLimiteStock: new FormControl({value: null, disabled: true}),
        fieldNivelCritico: new FormControl({value: null, disabled: true}),
        fieldUbicacion: new FormControl({value: null, disabled: true}),
        fieldFechaVencimiento: new FormControl({value: null, disabled: true})
      });

      component.listaProductos = [mockProduct];
      component.listaBodegas = [mockBodega];
      component.isSubmitting = false;

      snackBar = TestBed.inject(MatSnackBar);

      spyOn(snackBar, 'open');
      spyOn(component, 'clearAll');
      spyOn(component, 'cargarListaMovimientos');
    });

    it('should not submit if form is invalid', () => {
      spyOn(service, 'postData');
      
      component.onSubmit();
      
      expect(service.postData).not.toHaveBeenCalled();
      expect(snackBar.open).toHaveBeenCalledWith(
        'Por favor complete todos los campos requeridos', 
        'Cerrar', 
        { duration: 5000, panelClass: ['error-snackbar'] }
      );
    });

    it('should not submit if already submitting', () => {
      component.isSubmitting = true;
      spyOn(service, 'postData');
      
      component.onSubmit();
      
      expect(service.postData).not.toHaveBeenCalled();
    });

    it('should handle case when no product is selected', () => {
      component.registroMovimientoInventarioForm.patchValue({
        fieldProducto: 'Non-existent product',
        fieldBodega: mockBodega.id,
        fieldCantidad: 5,
        fieldTipoMovimiento: 'INGRESO'
      });
      
      spyOn(service, 'postData');
      spyOn(console, 'error');
      
      component.onSubmit();
      
      expect(service.postData).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('No product selected or product not found');
    });

    it('should submit valid form data successfully', fakeAsync(() => {
      component.registroMovimientoInventarioForm.patchValue({
        fieldProducto: mockProduct.name,
        fieldBodega: mockBodega.id,
        fieldCantidad: 5,
        fieldTipoMovimiento: 'INGRESO'
      });
      
      const mockResponse = { success: true };
      spyOn(service, 'postData').and.returnValue(of(mockResponse));
      
      component.onSubmit();
      tick();
      
      expect(component.isSubmitting).toBeFalse();
      expect(service.postData).toHaveBeenCalledWith({
        fieldProducto: mockProduct.name,
        fieldBodega: mockBodega.id,
        fieldCantidad: 5,
        fieldTipoMovimiento: 'INGRESO',
        idProducto: mockProduct.id,
        threshold_stock: undefined,
        critical_level: undefined,
        location: undefined,
        expiration_date: null
      });
      expect(snackBar.open).toHaveBeenCalledWith(
        'Movimiento registrado exitosamente', 
        'Cerrar', 
        { duration: 5000, panelClass: ['success-snackbar'] }
      );
      expect(component.clearAll).toHaveBeenCalled();
      expect(component.cargarListaMovimientos).toHaveBeenCalled();
    }));

    it('should include additional fields when mostrarCamposAdicionales is true', fakeAsync(() => {
      component.registroMovimientoInventarioForm.patchValue({
        fieldProducto: mockProduct.name,
        fieldBodega: mockBodega.id,
        fieldCantidad: 5,
        fieldTipoMovimiento: 'INGRESO'
      });
      
      component.mostrarCamposAdicionales = true;
      component.registroMovimientoInventarioForm.get('fieldLimiteStock')?.enable();
      component.registroMovimientoInventarioForm.get('fieldNivelCritico')?.enable();
      component.registroMovimientoInventarioForm.get('fieldUbicacion')?.enable();
      component.registroMovimientoInventarioForm.get('fieldFechaVencimiento')?.enable();
      
      component.registroMovimientoInventarioForm.patchValue({
        fieldLimiteStock: 10,
        fieldNivelCritico: 5,
        fieldUbicacion: 'Estante A1',
        fieldFechaVencimiento: '2025-12-31'
      });
      
      const mockResponse = { success: true };
      spyOn(service, 'postData').and.returnValue(of(mockResponse));
      
      component.onSubmit();
      tick();
      
      expect(service.postData).toHaveBeenCalledWith(jasmine.objectContaining({
        threshold_stock: 10,
        critical_level: 5,
        location: 'Estante A1',
        expiration_date: '2025-12-31T00:00:00'
      }));
    }));

    it('should handle API error during submission', fakeAsync(() => {
      component.registroMovimientoInventarioForm.patchValue({
        fieldProducto: mockProduct.name,
        fieldBodega: mockBodega.id,
        fieldCantidad: 5,
        fieldTipoMovimiento: 'INGRESO'
      });
      
      spyOn(service, 'postData').and.returnValue(throwError(() => new Error('API Error')));
      spyOn(console, 'error');
      
      component.onSubmit();
      tick();
      
      expect(component.isSubmitting).toBeFalse();
      expect(console.error).toHaveBeenCalledWith('Error recording movement', jasmine.any(Error));
      expect(snackBar.open).toHaveBeenCalledWith(
        'Error al registrar el movimiento', 
        'Cerrar', 
        { duration: 5000, panelClass: ['error-snackbar'] }
      );
      expect(component.clearAll).not.toHaveBeenCalled();
      expect(component.cargarListaMovimientos).not.toHaveBeenCalled();
    }));

    it('should handle date conversion for expiration_date', fakeAsync(() => {
      component.registroMovimientoInventarioForm.patchValue({
        fieldProducto: mockProduct.name,
        fieldBodega: mockBodega.id,
        fieldCantidad: 5,
        fieldTipoMovimiento: 'INGRESO',
        fieldFechaVencimiento: new Date('2025-12-31')
      });
      component.mostrarCamposAdicionales = true;
      component.registroMovimientoInventarioForm.get('fieldFechaVencimiento')?.enable();
      
      const mockResponse = { success: true };
      spyOn(service, 'postData').and.returnValue(of(mockResponse));
      
      component.onSubmit();
      tick();
      
      expect(service.postData).toHaveBeenCalledWith(jasmine.objectContaining({
        expiration_date: '2025-12-31T00:00:00'
      }));
    }));

    it('should not include disabled additional fields in the request', fakeAsync(() => {
      component.registroMovimientoInventarioForm.patchValue({
        fieldProducto: mockProduct.name,
        fieldBodega: mockBodega.id,
        fieldCantidad: 5,
        fieldTipoMovimiento: 'INGRESO',
        fieldLimiteStock: 10, // Se fija el valor pero está deshabilitado
        fieldNivelCritico: 5  // SE fija el valor pero está deshabilitado
      });
      
      const mockResponse = { success: true };
      const postDataSpy = spyOn(service, 'postData').and.returnValue(of(mockResponse));
      
      component.onSubmit();
      tick();
      
      const requestData = postDataSpy.calls.first().args[0];
      expect(requestData.threshold_stock).toBeUndefined();
      expect(requestData.critical_level).toBeUndefined();
    }));
  });

  describe('clearAll', () => {
    it('should reset the form to its initial state', () => {
      component.registroMovimientoInventarioForm.patchValue({
        fieldProducto: 'Producto Prueba',
        fieldBodega: 'Bodega Principal',
        fieldCantidad: 5,
        fieldTipoMovimiento: 'INGRESO'
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

  describe('tableColumns', () => {
    const mockApiResponseRow = {
      fecha: '2023-05-01T10:00:00',
      nombre_producto: 'Chocolisto',
      nombre_bodega: 'bbce3fb9-ade4-4fc4-946a-0e49604df59a',
      tipo_movimiento: 'Ingreso',
      cantidad: 5,
      usuario: 'test@example.com'
    };

    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should have the correct number of columns', () => {
      expect(component.tableColumns.length).toBe(6);
    });

    it('should have the correct column structure', () => {
      const expectedColumns = [
        { name: 'fecha', header: 'Fecha' },
        { name: 'nombre_producto', header: 'Producto' },
        { name: 'nombre_bodega', header: 'Bodega' },
        { name: 'tipo_movimiento', header: 'Movimiento' },
        { name: 'cantidad', header: 'Cantidad' },
        { name: 'usuario', header: 'Responsable' }
      ];

      component.tableColumns.forEach((col, index) => {
        expect(col.name).toBe(expectedColumns[index].name);
        expect(col.header).toBe(expectedColumns[index].header);
        expect(col.cell).toBeDefined();
      });
    });

    it('should correctly render timestamp cell', () => {
      const timestampColumn = component.tableColumns.find(c => c.name === 'fecha');
      expect(timestampColumn).toBeDefined();
      
      const renderedValue = timestampColumn!.cell(mockApiResponseRow);
      expect(renderedValue).toBe(mockApiResponseRow.fecha.toString());
    });

    it('should correctly render product_id cell', () => {
      const productColumn = component.tableColumns.find(c => c.name === 'nombre_producto');
      expect(productColumn).toBeDefined();
      
      const renderedValue = productColumn!.cell(mockApiResponseRow);
      expect(renderedValue).toBe(mockApiResponseRow.nombre_producto.toString());
    });

    it('should correctly render warehouse_id cell', () => {
      const warehouseColumn = component.tableColumns.find(c => c.name === 'nombre_bodega');
      expect(warehouseColumn).toBeDefined();
      
      const renderedValue = warehouseColumn!.cell(mockApiResponseRow);
      expect(renderedValue).toBe(mockApiResponseRow.nombre_bodega.toString());
    });

    it('should correctly render movement_type cell', () => {
      const movementColumn = component.tableColumns.find(c => c.name === 'tipo_movimiento');
      expect(movementColumn).toBeDefined();
      
      const renderedValue = movementColumn!.cell(mockApiResponseRow);
      expect(renderedValue).toBe(mockApiResponseRow.tipo_movimiento.toString());
    });

    it('should correctly render number cell', () => {
      const quantityColumn = component.tableColumns.find(c => c.name === 'cantidad');
      expect(quantityColumn).toBeDefined();
      
      const renderedValue = quantityColumn!.cell(mockApiResponseRow);
      expect(renderedValue).toBe(mockApiResponseRow.cantidad.toString());
    });

    it('should correctly render user cell', () => {
      const userColumn = component.tableColumns.find(c => c.name === 'usuario');
      expect(userColumn).toBeDefined();
      
      const renderedValue = userColumn!.cell(mockApiResponseRow);
      expect(renderedValue).toBe(mockApiResponseRow.usuario.toString());
    });

    it('should match visibleColumns with tableColumns names', () => {
      const columnNames = component.tableColumns.map(c => c.name);
      expect(component.visibleColumns).toEqual(columnNames);
    });
  });
});

/* tslint:disable:no-unused-variable */
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { OptimizacionComprasComponent } from './optimizacion-compras.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subscription, throwError } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { OptimizacionComprasService } from './optimizacion-compras.service';
import { ComprasModule } from '../compras.module';

describe('OptimizacionComprasComponent', () => {
  let component: OptimizacionComprasComponent;
  let fixture: ComponentFixture<OptimizacionComprasComponent>;
  let service: OptimizacionComprasService;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OptimizacionComprasComponent],
      imports: [
        ComprasModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [OptimizacionComprasService]
    }).compileComponents();

    fixture = TestBed.createComponent(OptimizacionComprasComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(OptimizacionComprasService);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initializeForm', () => {
    it('should initialize the form with empty controls', () => {
      component.initializeForm();

      expect(component.optimizacionComprasForm).toBeDefined();
      expect(component.optimizacionComprasForm.get('fieldProducto')?.value).toBe('');
      expect(component.optimizacionComprasForm.get('fieldFabricante')?.value).toBe('');
    });
  });

  describe('cargarFabricantes', () => {
    it('should load manufacturers and update the form', () => {
      const mockResponse: any = { providers: [{ id: '1', name: 'Test' }] };
      spyOn(service, 'getListaFabricantes').and.returnValue(of(mockResponse));

      component.cargarFabricantes();

      expect(service.getListaFabricantes).toHaveBeenCalled();
      expect(component.listaFabricantes).toEqual(mockResponse.providers);
      expect(component.optimizacionComprasForm.get('fieldFabricante')?.value).toBe('');
    });
  });

  describe('_filtrarNombresProductos', () => {
    it('should filter product names based on input value', () => {
      component.listaProductos = [
        { id: '1', name: 'Product A' },
        { id: '2', name: 'Product B' }
      ];

      const result = component._filtrarNombresProductos('a');

      expect(result).toEqual(['Product A']);
    });

    it('should return all products when empty string is provided', () => {
      component.listaProductos = [
        { id: '1', name: 'Product A' },
        { id: '2', name: 'Product B' }
      ];

      const result = component._filtrarNombresProductos('');

      expect(result).toEqual(['Product A', 'Product B']);
    });
  });

  describe('conProductoSeleccionado', () => {
    beforeEach(() => {
      component.listaProductos = [
        { id: '123', name: 'Test Product' },
        { id: '456', name: 'Another Product' }
      ];
    });
    
    it('should set selected product ID when valid product is selected', () => {
      component.listaProductos = [{ id: '123', name: 'Test Product' }];
      const mockEvent = { option: { value: 'Test Product' } };

      component.conProductoSeleccionado(mockEvent as any);

      expect(component.idProductoSeleccionado).toBe('123');
    });

    it('should reset when invalid product is selected', () => {
      component.listaProductos = [{ id: '123', name: 'Test Product' }];
      const mockEvent = { option: { value: 'Invalid Product' } };

      component.conProductoSeleccionado(mockEvent as any);

      expect(component.idProductoSeleccionado).toBeNull();
    });

    it('should handle object value with name property', () => {
      const mockEvent = { 
        option: { 
          value: { name: 'Test Product' } 
        } 
      };

      component.conProductoSeleccionado(mockEvent as any);

      expect(component.idProductoSeleccionado).toBe('123');
      expect(component.optimizacionComprasForm.get('fieldProducto')?.value).toBe('Test Product');
    });

    it('should reset when option value is invalid', () => {
      const mockEvent = { 
        option: { 
          value: null 
        } 
      };
      spyOn(component.optimizacionComprasForm.get('fieldProducto')!, 'setValue');

      component.conProductoSeleccionado(mockEvent as any);

      expect(component.idProductoSeleccionado).toBeNull();
      expect(component.optimizacionComprasForm.get('fieldProducto')?.setValue).toHaveBeenCalledWith('');
    });

    it('should log when product is not found', () => {
      const mockEvent = { 
        option: { 
          value: 'Non-existent Product' 
        } 
      };
      spyOn(console, 'log');

      component.conProductoSeleccionado(mockEvent as any);

      expect(console.log).toHaveBeenCalledWith('Product not found!');
    });
  });

  describe('ngOnInit', () => {
    let mockSubscription: Subscription;

    beforeEach(() => {
      mockSubscription = new Subscription();
      spyOn(component, 'initializeForm');
      spyOn(component, 'cargarFabricantes');
      spyOn(component, 'cargarProductos').and.callFake((callback: any) => {
        if (callback) callback();
      });
      spyOn(component, 'autoCompletar');
      spyOn(component, 'subscribirseQueryParams');
      spyOn(component, 'cargarSugerenciasCompras');
    });

    it('should call all initialization methods', () => {
      spyOn(route.queryParams, 'subscribe').and.returnValue(mockSubscription);

      component.ngOnInit();

      expect(component.initializeForm).toHaveBeenCalled();
      expect(component.cargarFabricantes).toHaveBeenCalled();
      expect(component.cargarProductos).toHaveBeenCalled();
      expect(component.autoCompletar).toHaveBeenCalled();
      expect(component.subscribirseQueryParams).toHaveBeenCalled();
      expect(component.cargarSugerenciasCompras).toHaveBeenCalled();
    });

    it('should subscribe to queryParams and call aplicarQueryParams when params exist', () => {
      const mockParams = { product_id: '123', provider_id: '456' };
      spyOn(route.queryParams, 'subscribe').and.callFake((callback: (params: any) => void) => {
        callback(mockParams);
        return mockSubscription;
      });
      spyOn(component, 'aplicarQueryParams');

      component.ngOnInit();

      expect(component.aplicarQueryParams).toHaveBeenCalledWith('123', '456');
    });

    it('should not call aplicarQueryParams when no params exist', () => {
      spyOn(route.queryParams, 'subscribe').and.callFake((callback: (params: any) => void) => {
        callback({});
        return mockSubscription;
      });
      spyOn(component, 'aplicarQueryParams');

      component.ngOnInit();
      expect(component.aplicarQueryParams).not.toHaveBeenCalled();
    });
  });

  describe('onSubmit', () => {
    it('should call router.navigate with correct parameters', () => {
      spyOn(router, 'navigate');
      component.idProductoSeleccionado = '123';
      component.optimizacionComprasForm.get('fieldFabricante')?.setValue('456');

      component.onSubmit();

      expect(router.navigate).toHaveBeenCalledWith([], {
        relativeTo: route,
        queryParams: { product_id: '123', provider_id: '456' },
        queryParamsHandling: 'merge'
      });
    });
  });

  describe('clearAll', () => {
    it('should reset form and call router.navigate', () => {
      spyOn(router, 'navigate');
      component.idProductoSeleccionado = '123';
      component.optimizacionComprasForm.get('fieldProducto')?.setValue('Test');
      component.optimizacionComprasForm.get('fieldFabricante')?.setValue('456');

      component.clearAll();

      expect(component.idProductoSeleccionado).toBeNull();
      expect(component.optimizacionComprasForm.get('fieldProducto')?.value).toBeNull();
      expect(component.optimizacionComprasForm.get('fieldFabricante')?.value).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith([], {
        relativeTo: route,
        queryParams: {},
        queryParamsHandling: 'merge'
      });
    });
  });

  describe('cargarProductos', () => {
    it('should load products and call callback functions', fakeAsync(() => {
      const mockResponse = { products: [{ id: '1', name: 'Product A' }] };
      spyOn(service, 'getListaProductosStock').and.returnValue(of(mockResponse));
      const callbackSpy = jasmine.createSpy('callback');
      
      component.cargarProductos(callbackSpy);
      tick();

      expect(component.isRefreshing).toBeFalse();
      expect(service.getListaProductosStock).toHaveBeenCalled();
      expect(callbackSpy).toHaveBeenCalled();
      expect(component.listaProductos).toEqual(mockResponse.products);
      expect(component.optimizacionComprasForm.get('fieldProducto')?.value).toBe('');
    }));

    it('should handle error when loading products', () => {
      spyOn(service, 'getListaProductosStock').and.returnValue(throwError(() => new Error('Error')));
      spyOn(console, 'error');
      
      component.cargarProductos();

      expect(service.getListaProductosStock).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('Failed to load products', jasmine.any(Error));
    });
  });

  describe('autoCompletar', () => {
    it('should initialize filtered product names observable', () => {
      component.listaProductos = [
        { id: '1', name: 'Product A' },
        { id: '2', name: 'Product B' }
      ];

      component.autoCompletar();
      
      expect(component.nombresProductosFiltrados).toBeDefined();
      component.nombresProductosFiltrados.subscribe(result => {
        expect(result).toEqual(['Product A', 'Product B']);
      });
    });
  });

  describe('subscribirseQueryParams', () => {
    let mockSubscription: Subscription;

    beforeEach(() => {
      mockSubscription = new Subscription();
    });

    it('should call aplicarQueryParams when queryParams exist', () => {
      spyOn(component, 'aplicarQueryParams');
      const mockSubscription = new Subscription();
      spyOn(route.queryParams, 'subscribe').and.callFake((callback: (value: any) => void) => {
        callback({ product_id: '123', provider_id: '456' });
        return mockSubscription;
      });

      component.subscribirseQueryParams();

      expect(component.aplicarQueryParams).toHaveBeenCalledWith('123', '456');
    });

    it('should call clearAll when no queryParams exist', () => {
      spyOn(component, 'clearAll');
      const mockSubscription = new Subscription();
      spyOn(route.queryParams, 'subscribe').and.callFake((callback: (value: any) => void) => {
        callback({});
        return mockSubscription;
      });
      
      component.subscribirseQueryParams();

      expect(component.clearAll).toHaveBeenCalled();
    });

    it('should handle queryParams subscription in ngOnInit', () => {
      const mockParams = { product_id: '123', provider_id: '456' };
      const component = TestBed.createComponent(OptimizacionComprasComponent).componentInstance;
      const route = TestBed.inject(ActivatedRoute);
      
      spyOn(route.queryParams, 'subscribe').and.callFake((callback: (params: any) => void) => {
        callback(mockParams);
        return mockSubscription;
      });
      spyOn(component, 'aplicarQueryParams');

      component.ngOnInit();

      expect(component.aplicarQueryParams).toHaveBeenCalledWith('123', '456');
    });
  });

  describe('cargarSugerenciasCompras', () => {
    it('should load purchase suggestions with product and provider filters', fakeAsync(() => {
      const mockResponse = { 
        suggested_purchases: [{ 
          product_name: 'Test', 
          suggested_qtty: 10, 
          motive: 'Low stock' 
        }] 
      };
      spyOn(service, 'getComprasSugeridas').and.returnValue(of(mockResponse));
      component.idProductoSeleccionado = '123';
      component.optimizacionComprasForm.get('fieldFabricante')?.setValue('456');
      
      component.cargarSugerenciasCompras();
      tick();

      expect(component.isRefreshing).toBeFalse();
      expect(service.getComprasSugeridas).toHaveBeenCalledWith('123', '456');
      expect(component.tableData).toEqual(mockResponse.suggested_purchases);
    }));

    it('should handle empty response', () => {
      spyOn(service, 'getComprasSugeridas').and.returnValue(of({ suggested_purchases: [] }));

      component.cargarSugerenciasCompras();

      expect(component.tableData).toEqual([]);
    });

    it('should handle error', () => {
      spyOn(service, 'getComprasSugeridas').and.returnValue(throwError(() => new Error('Error')));
      spyOn(console, 'error');
      
      component.cargarSugerenciasCompras();

      expect(console.error).toHaveBeenCalledWith('Error loading purchase suggestions:', jasmine.any(Error));
      expect(component.tableData).toEqual([]);
    });
  });

  describe('aplicarQueryParams', () => {
    beforeEach(() => {
      jasmine.clock().install();
      component.listaProductos = [
        { id: '123', name: 'Test Product' },
        { id: '456', name: 'Another Product' }
      ];
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    it('should set product and provider values when found', () => {
      spyOn(component, 'onSubmit');

      component.aplicarQueryParams('123', '789');

      expect(component.optimizacionComprasForm.get('fieldProducto')?.value).toBe('Test Product');
      expect(component.idProductoSeleccionado).toBe('123');
      expect(component.optimizacionComprasForm.get('fieldFabricante')?.value).toBe('789');
      expect(component.onSubmit).toHaveBeenCalled();
    });

    it('should retry when product is not found immediately', () => {
      spyOn(component, 'aplicarQueryParams').and.callThrough();

      component.aplicarQueryParams('999', '789');
      jasmine.clock().tick(101);

      expect(component.aplicarQueryParams).toHaveBeenCalledTimes(2);
    });
  });

  describe('navegarProductosCriticos', () => {
    it('should navigate to critical products page', () => {
      spyOn(router, 'navigate');
      
      component.navegarProductosCriticos();

      expect(router.navigate).toHaveBeenCalledWith(['/inventario/gestion_alertas_inventario_critico']);
    });
  });
});
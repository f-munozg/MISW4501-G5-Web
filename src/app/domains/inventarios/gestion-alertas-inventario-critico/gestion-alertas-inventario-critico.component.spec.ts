/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GestionAlertasInventarioCriticoComponent, TableRow } from './gestion-alertas-inventario-critico.component';
import { InventariosModule } from '../inventarios.module';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GestionAlertasInventarioCriticoService } from './gestion-alertas-inventario-critico.service';
import { delay, of, throwError } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

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

const mockProductosNivelCritico = {
  "message": "Critical stock detected", 
  "critical_products": [
    {
      "product_id": "9cb83fb9-cf61-4973-a1cc-5b83c9522113",
      "product_name": "Chocolisto", 
      "warehouse": "Bodega Centro", 
      "current_quantity": 1, 
      "threshold": 1, 
      "alert_message": 
      "Producto Chocolisto en bodega Bodega Centro alcanzó nivel crítico.",
      "suggested_action": "Generar orden de compra al proveedor"
    }
  ]
}

describe('GestionAlertasInventarioCriticoComponent', () => {
  let component: GestionAlertasInventarioCriticoComponent;
  let fixture: ComponentFixture<GestionAlertasInventarioCriticoComponent>;
  let service: GestionAlertasInventarioCriticoService;
  let httpMock: HttpTestingController;
  let router: Router;
  let snackBar: MatSnackBar;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionAlertasInventarioCriticoComponent ],
      imports: [ InventariosModule, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule],
      providers: [ GestionAlertasInventarioCriticoService ]
    })
    .compileComponents();

    service = TestBed.inject(GestionAlertasInventarioCriticoService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    snackBar = TestBed.inject(MatSnackBar);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionAlertasInventarioCriticoComponent);
    component = fixture.componentInstance;

    service = TestBed.inject(GestionAlertasInventarioCriticoService);
    httpMock = TestBed.inject(HttpTestingController);
    
    component.isRefreshing = false;
    fixture.detectChanges();
  });

  afterEach(() => {
    if (component) {
      component.isRefreshing = false;
    }
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

  describe('initializeForms', () => {
    it('should initialize the form with required controls', () => {
      component.initializeForms();
      
      expect(component.gestionAlertasInventarioCriticoForm).toBeDefined();
      expect(component.gestionAlertasInventarioCriticoForm.get('fieldProducto')).toBeTruthy();
      expect(component.gestionAlertasInventarioCriticoForm.get('fieldBodega')).toBeTruthy();
    });
  });

  describe('_filtrarNombresProductos', () => {
    it('should filter product names based on input value', () => {
      component.listaProductos = mockProductosResponse.products;
      
      const result1 = component._filtrarNombresProductos('Choco');
      expect(result1).toEqual(['Chocolisto']);
      
      const result2 = component._filtrarNombresProductos('Le');
      expect(result2).toEqual(['Leche']);
      
      const result3 = component._filtrarNombresProductos('NonExisting');
      expect(result3).toEqual([]);
    });
  });

  describe('conProductoSeleccionado', () => {
      beforeEach(() => {
        component.listaProductos = mockProductosResponse.products;
      });

    it('should set idProductoSeleccionado when a valid product is selected', () => {
      component.listaProductos = mockProductosResponse.products;
      const mockEvent = {
        option: {
          value: 'Chocolisto'
        }
      } as MatAutocompleteSelectedEvent;
      
      component.conProductoSeleccionado(mockEvent);
      
      expect(component.idProductoSeleccionado).toBe('27644658-6c5c-4643-8121-c30bed696f68');
      expect(component.gestionAlertasInventarioCriticoForm.get('fieldProducto')?.value).toBe('Chocolisto');
    });

    it('should reset when invalid product is selected', () => {
      const mockEvent = {
        option: {
          value: 'InvalidProduct'
        }
      } as MatAutocompleteSelectedEvent;
      
      component.conProductoSeleccionado(mockEvent);
      
      expect(component.idProductoSeleccionado).toBeNull();
      expect(component.gestionAlertasInventarioCriticoForm.get('fieldProducto')?.value).toBe('');
    });

    it('should handle event with product object', () => {
      const mockEvent = {
        option: {
          value: { name: 'Chocolisto' }
        }
      } as MatAutocompleteSelectedEvent;
      
      component.conProductoSeleccionado(mockEvent);
      
      expect(component.idProductoSeleccionado).toBe('27644658-6c5c-4643-8121-c30bed696f68');
      expect(component.gestionAlertasInventarioCriticoForm.get('fieldProducto')?.value).toBe('Chocolisto');
    });

    it('should reset when event value is invalid', () => {
      const mockEvent = {
        option: {
          value: null
        }
      } as MatAutocompleteSelectedEvent;
      
      component.conProductoSeleccionado(mockEvent);
      
      expect(component.idProductoSeleccionado).toBeNull();
      expect(component.gestionAlertasInventarioCriticoForm.get('fieldProducto')?.value).toBe('');
    });
  });

  describe('cargarProductos', () => {
    it('should load products and update listaProductos on success', fakeAsync(() => {
      component.isRefreshing = false;
      
      spyOn(service, 'getListaProductosStock').and.returnValue(
        of(mockProductosResponse).pipe(delay(0))
      );
      
      const callback = jasmine.createSpy('callback');
      
      component.cargarProductos(callback);
      
      expect(component.isRefreshing).toBeTrue();
      
      tick();
      
      expect(component.isRefreshing).toBeFalse();
      expect(component.listaProductos).toEqual(mockProductosResponse.products);
      expect(callback).toHaveBeenCalled();
    }));

    it('should handle error when loading products', () => {
      const consoleSpy = spyOn(console, 'error');
      spyOn(service, 'getListaProductosStock').and.returnValue(throwError(() => new Error('Error')));
      
      component.cargarProductos();
      
      expect(consoleSpy).toHaveBeenCalledWith('Failed to load products', jasmine.any(Error));
      expect(component.isRefreshing).toBeFalse();
    });
  });

  describe('cargarProductosCriticos', () => {
    it('should load critical products and update table data on success', fakeAsync(() => {
      component.isRefreshing = false; 
      component.listaProductosStock = []; 
      
      const mockResponse = {...mockProductosNivelCritico};
      spyOn(service, 'getProductosNivelCritico').and.returnValue(
        of(mockResponse).pipe(delay(0))
      );
      const snackBarSpy = spyOn(component, 'mostrarSnackBar');

      component.cargarProductosCriticos();

      expect(component.isRefreshing).toBeTrue();
      
      tick();
      
      expect(component.isRefreshing).toBeFalse();
      expect(component.listaProductosStock).toEqual(mockResponse.critical_products);
      expect(component.listaProductosStockFiltrados).toEqual(mockResponse.critical_products);
      expect(component.tableData).toEqual(mockResponse.critical_products);
      expect(snackBarSpy).toHaveBeenCalledWith(mockResponse.message);
    }));

    it('should handle error when loading critical products', () => {
      const consoleSpy = spyOn(console, 'error');
      const snackBarSpy = spyOn(component, 'mostrarSnackBar');
      spyOn(service, 'getProductosNivelCritico').and.returnValue(throwError(() => new Error('Error')));
      
      component.cargarProductosCriticos();
      
      expect(consoleSpy).toHaveBeenCalledWith('Error loading critical products:', jasmine.any(Error));
      expect(snackBarSpy).toHaveBeenCalledWith('Error al cargar productos críticos');
      expect(component.isRefreshing).toBeFalse();
    });
  });

  describe('ngOnInit', () => {
    let route: ActivatedRoute;

    beforeEach(() => {
      route = TestBed.inject(ActivatedRoute);
      spyOn(component, 'cargarProductos').and.callFake((callback?: () => void) => {
        if (callback) callback();
      });
      spyOn(component, 'autoCompletar');
      spyOn(component, 'cargarResultadosIniciales');
    });

    it('should call cargarProductos with callback that calls autoCompletar and cargarResultadosIniciales', () => {
      component.ngOnInit();
      
      expect(component.cargarProductos).toHaveBeenCalledWith(jasmine.any(Function));
      expect(component.autoCompletar).toHaveBeenCalled();
      expect(component.cargarResultadosIniciales).toHaveBeenCalled();
    });

    it('should call aplicarQueryParams when snapshot has product_id', () => {
      (route.queryParams as any) = of({ product_id: 'test-id' });
      (route.snapshot.queryParams as any) = { product_id: 'test-id' };
      spyOn(component, 'aplicarQueryParams');
      
      component.ngOnInit();

      const args = (component.aplicarQueryParams as jasmine.Spy).calls.argsFor(0);

      expect(args[0]).toBe('test-id');
      
      expect(args[1] === null || args[1] === undefined).toBeTrue();
    });

    it('should call cargarResultadosIniciales when no queryParams', () => {
      (route.queryParams as any) = of({});
      (route.snapshot.queryParams as any) = {};
      
      component.ngOnInit();
      
      expect(component.cargarResultadosIniciales).toHaveBeenCalled();
    });
  });

  describe('aplicarQueryParams', () => {
    beforeEach(() => {
      component.listaProductos = mockProductosResponse.products;
      component.listaBodegas = [
        { 
          id: '06e5eb12-6b13-4b3c-b2a2-fc0f0da48783', 
          name: 'Bodega Centro' 
        }
      ];
      spyOn(component, 'onSubmit');
    });

    it('should set product form value when product_id matches', () => {
      const productId = '27644658-6c5c-4643-8121-c30bed696f68';
      component.aplicarQueryParams(productId, null);
      
      expect(component.gestionAlertasInventarioCriticoForm.get('fieldProducto')?.value).toBe('Chocolisto');
      expect(component.idProductoSeleccionado).toBe(productId);
      expect(component.onSubmit).toHaveBeenCalled();
    });

    it('should not set product form value when product_id doesnt match', () => {
      const productId = 'non-existing-id';
      component.aplicarQueryParams(productId, null);
      
      expect(component.gestionAlertasInventarioCriticoForm.get('fieldProducto')?.value).toBe('');
      expect(component.idProductoSeleccionado).toBeNull();
      expect(component.onSubmit).toHaveBeenCalled();
    });

    it('should set warehouse form value when warehouse_id matches', () => {
      const warehouseId = '06e5eb12-6b13-4b3c-b2a2-fc0f0da48783';
      component.aplicarQueryParams(null, warehouseId);
      
      expect(component.gestionAlertasInventarioCriticoForm.get('fieldBodega')?.value).toBe(warehouseId);
      expect(component.onSubmit).toHaveBeenCalled();
    });
  });
  
  describe('onSubmit', () => {
    beforeEach(() => {
      component.listaProductosStock = mockProductosNivelCritico.critical_products;
      component.listaBodegas = [
        { 
          id: '06e5eb12-6b13-4b3c-b2a2-fc0f0da48783', 
          name: 'Bodega Centro', 
        }
      ];
      spyOn(router, 'navigate');
      spyOn(component, 'mostrarSnackBar');
    });

    it('should filter by product name only', () => {
      component.gestionAlertasInventarioCriticoForm.get('fieldProducto')?.setValue('Chocolisto');
      
      component.onSubmit();
      
      expect(component.listaProductosStockFiltrados.length).toBe(1);
      expect(component.tableData.length).toBe(1);
      expect(router.navigate).toHaveBeenCalled();
      expect(component.mostrarSnackBar).toHaveBeenCalledWith('Mostrando 1 productos críticos');
    });

    it('should filter by warehouse only', () => {
      component.gestionAlertasInventarioCriticoForm.get('fieldBodega')?.setValue('06e5eb12-6b13-4b3c-b2a2-fc0f0da48783');
      
      component.onSubmit();
      
      expect(component.listaProductosStockFiltrados.length).toBe(1);
      expect(component.tableData.length).toBe(1);
    });

    it('should filter by both product and warehouse', () => {
      component.gestionAlertasInventarioCriticoForm.get('fieldProducto')?.setValue('Chocolisto');
      component.gestionAlertasInventarioCriticoForm.get('fieldBodega')?.setValue('06e5eb12-6b13-4b3c-b2a2-fc0f0da48783');
      
      component.onSubmit();
      
      expect(component.listaProductosStockFiltrados.length).toBe(1);
    });

    it('should show message when no products match filters', () => {
      component.gestionAlertasInventarioCriticoForm.get('fieldProducto')?.setValue('NonExisting');
      
      component.onSubmit();
      
      expect(component.listaProductosStockFiltrados.length).toBe(0);
      expect(component.mostrarSnackBar).toHaveBeenCalledWith('No se encontraron productos críticos con los filtros seleccionados');
    });
  });

  describe('clearAll', () => {
    it('should reset form, clear filters and show snackbar', () => {
      spyOn(router, 'navigate');
      spyOn(component, 'mostrarSnackBar');
      component.listaProductosStock = mockProductosNivelCritico.critical_products;
      component.listaProductosStockFiltrados = [];
      
      component.clearAll();
      
      expect(component.gestionAlertasInventarioCriticoForm.get('fieldProducto')?.value).toBeNull();
      expect(component.gestionAlertasInventarioCriticoForm.get('fieldBodega')?.value).toBeNull();
      expect(component.idProductoSeleccionado).toBeNull();
      expect(router.navigate).toHaveBeenCalled();
      expect(component.listaProductosStockFiltrados).toEqual(mockProductosNivelCritico.critical_products);
      expect(component.tableData).toEqual(mockProductosNivelCritico.critical_products);
      expect(component.mostrarSnackBar).toHaveBeenCalledWith('Filtros limpiados');
    });
  });

  describe('navigation methods', () => {
      it('navegarRegistroMovimiento should navigate to registro_movimiento', () => {
        const navigateSpy = spyOn(router, 'navigate');
        component.navegarRegistroMovimiento();
        expect(navigateSpy).toHaveBeenCalledWith(['/inventario/registro_movimiento']);
      });

      it('navegarOptimizacionCompras should navigate to root', () => {
        const navigateSpy = spyOn(router, 'navigate');
        component.navegarOptimizacionCompras();
        expect(navigateSpy).toHaveBeenCalledWith(['/']);
      });
    });

  describe('mostrarSnackBar', () => {
    it('should open snackbar with given message', () => {
      const snackBarSpy = spyOn(snackBar, 'open');
      const message = 'Test message';
      
      component.mostrarSnackBar(message);
      
      expect(snackBarSpy).toHaveBeenCalledWith(message, 'Cerrar', {
        duration: 3000,
      });
    });
  });

  describe('tableColumns', () => {
    it('should have correct column definitions', () => {
      expect(component.tableColumns).toBeDefined();
      expect(component.tableColumns.length).toBe(5);

      expect(component.tableColumns[0].name).toBe('product_name');
      expect(component.tableColumns[0].header).toBe('Producto');
      expect(component.tableColumns[0].cell({product_name: 'Test Product'})).toBe('Test Product');

      expect(component.tableColumns[1].name).toBe('warehouse');
      expect(component.tableColumns[1].header).toBe('Bodega');
      expect(component.tableColumns[1].cell({warehouse: 'Test Warehouse'})).toBe('Test Warehouse');

      expect(component.tableColumns[2].name).toBe('current_quantity');
      expect(component.tableColumns[2].header).toBe('Cantidad');
      expect(component.tableColumns[2].cell({current_quantity: 10})).toBe('10');

      expect(component.tableColumns[3].name).toBe('alert_message');
      expect(component.tableColumns[3].header).toBe('Alerta');
      expect(component.tableColumns[3].cell({alert_message: 'Test Alert'})).toBe('Test Alert');

      expect(component.tableColumns[4].name).toBe('suggested_action');
      expect(component.tableColumns[4].header).toBe('Acción Sugerida');
      expect(component.tableColumns[4].cell({suggested_action: 'Test Action'})).toBe('Test Action');
    });
  });

  describe('assignAction', () => {
    it('should have correct action definitions', () => {
      expect(component.assignAction).toBeDefined();
      expect(component.assignAction.length).toBe(2);

      expect(component.assignAction[0].icon).toBe('Reordernar');
      expect(component.assignAction[0].tooltip).toBe('Reordernar');
      const navigateSpy1 = spyOn(component, 'navegarOptimizacionCompras');
      component.assignAction[0].action({} as TableRow);
      expect(navigateSpy1).toHaveBeenCalled();

      expect(component.assignAction[1].icon).toBe('Transferir');
      expect(component.assignAction[1].tooltip).toBe('Transferir');
      const navigateSpy2 = spyOn(component, 'navegarRegistroMovimiento');
      component.assignAction[1].action({} as TableRow);
      expect(navigateSpy2).toHaveBeenCalled();
    });
  });

  describe('visibleColumns', () => {
    it('should have correct visible columns', () => {
      expect(component.visibleColumns).toEqual([
        'product_name',
        'warehouse',
        'current_quantity',
        'alert_message',
        'suggested_action'
      ]);
    });
  });
});

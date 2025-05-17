/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ReporteRotacionInventarioComponent } from './reporte-rotacion-inventario.component';
import { ReportesModule } from '../reportes.module';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReporteRotacionInventarioService } from './reporte-rotacion-inventario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { TipoMovimiento } from '../../inventarios/inventario.model';
import { of } from 'rxjs';

const mockRotacionProductoResponse = {
  "product_id": "27644658-6c5c-4643-8121-c30bed696f68",
  "sku": "SKU-123",
  "name": "Chocolisto",
  "rotacion": {
      "porcentaje": 700,
      "texto": "700%",
      "nivel": "Alta"
  },
  "stock_inicial": 50,
  "stock_final": 7,
  "movimientos": [
      {
          "timestamp": "2025-04-18 15:34",
          "nombre_producto": "Chocolisto",
          "cantidad_ingreso": 50,
          "cantidad_salida": 0,
          "tipo_movimiento": TipoMovimiento.INGRESO,
          "stock_acumulado": 50
      },
      {
          "timestamp": "2025-04-18 15:36",
          "nombre_producto": "Chocolisto",
          "cantidad_ingreso": 0,
          "cantidad_salida": 5,
          "tipo_movimiento": TipoMovimiento.SALIDA,
          "stock_acumulado": 45
      },
      {
          "timestamp": "2025-05-04 00:41",
          "nombre_producto": "Chocolisto",
          "cantidad_ingreso": 0,
          "cantidad_salida": 38,
          "tipo_movimiento": TipoMovimiento.SALIDA,
          "stock_acumulado": 7
      }
  ]
};

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

describe('ReporteRotacionInventarioComponent', () => {
  let component: ReporteRotacionInventarioComponent;
  let fixture: ComponentFixture<ReporteRotacionInventarioComponent>;
  let service: ReporteRotacionInventarioService;
  let httpMock: HttpTestingController;
  let router: Router;
  let route: ActivatedRoute;
  let formBuilder: FormBuilder;

  beforeEach(waitForAsync(() => {
    const mockRoute = {
      queryParams: of({
        product_id: '27644658-6c5c-4643-8121-c30bed696f68',
        start_date: '2025-04-01',
        end_date: '2025-05-01'
      })
    };

    TestBed.overrideProvider(ActivatedRoute, { useValue: mockRoute });

    TestBed.configureTestingModule({
      declarations: [ ReporteRotacionInventarioComponent ],
      imports: [ 
        ReportesModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]) 
      ],
      providers: [
        ReporteRotacionInventarioService
      ]
    })
    .compileComponents();

    service = TestBed.inject(ReporteRotacionInventarioService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    formBuilder = TestBed.inject(FormBuilder);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteRotacionInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize form, setup autocomplete and load products', fakeAsync(() => {
      spyOn(component, 'initializeForm').and.callThrough();
      spyOn(component, 'autoCompletar').and.callThrough();
      spyOn(component, 'cargarProductos').and.callThrough();
      spyOn(component, 'setupValidacionFechas').and.callThrough();

      component.ngOnInit();
      tick();

      expect(component.initializeForm).toHaveBeenCalled();
      expect(component.autoCompletar).toHaveBeenCalled();
      expect(component.cargarProductos).toHaveBeenCalled();
      expect(component.setupValidacionFechas).toHaveBeenCalled();
    }));

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
      spyOn(component, 'actualizarUrlConParams').and.callThrough();

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
      expect(component.actualizarUrlConParams).toHaveBeenCalled();
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
    beforeEach(() => {
      component.listaProductos = mockProductosResponse.products;
    });

    it('should set idProductoSeleccionado when product is found', () => {
      component.conProductoSeleccionado('Chocolisto');
      
      expect(component.idProductoSeleccionado).toBe('27644658-6c5c-4643-8121-c30bed696f68');
    });

    it('should set idProductoSeleccionado to null when product is not found', () => {
      component.conProductoSeleccionado('No existe');
      
      expect(component.idProductoSeleccionado).toBeNull();
    });

    it('should handle empty string input', () => {
      component.conProductoSeleccionado('');
      
      expect(component.idProductoSeleccionado).toBeNull();
    });

    it('should handle case sensitivity', () => {
      component.conProductoSeleccionado('CHOCOLISTO');
      
      expect(component.idProductoSeleccionado).toBeNull();
      
    });

    it('should work correctly with empty product list', () => {
      component.listaProductos = [];
      component.conProductoSeleccionado('Chocolisto');
      
      expect(component.idProductoSeleccionado).toBeNull();
    });
  });

  describe('actualizarUrlConParams', () => {
    it('should update form values from query params', fakeAsync(() => {
      spyOn(service, 'getListaProductos').and.returnValue(of(mockProductosResponse));
      
      component.cargarProductos();
      tick();
      
      component.actualizarUrlConParams();
      tick();
      
      expect(component.idProductoSeleccionado).toBe('27644658-6c5c-4643-8121-c30bed696f68');
      expect(component.reporteRotacionInventarioForm.value.fieldProducto).toBe('Chocolisto');
      expect(component.reporteRotacionInventarioForm.value.fieldDesde).toEqual(new Date(2025, 3, 1)); 
      expect(component.reporteRotacionInventarioForm.value.fieldHasta).toEqual(new Date(2025, 4, 1));
    }));
  });


  describe('parsearFechaComoString', () => {
    it('should parse YYYY-MM-DD format correctly', () => {
      const date = component.parsearFechaComoString('2025-04-01');
      expect(date.getFullYear()).toBe(2025);
      expect(date.getMonth()).toBe(3); // Abril es mes 3 (0-indexed)
      expect(date.getDate()).toBe(1);
    });

    it('should handle other date formats', () => {
      const dateStr = '2025-04-01T00:00:00';
      const date = component.parsearFechaComoString(dateStr);
      expect(date).toEqual(new Date(dateStr));
    });
  });


  describe('onSubmit', () => {
    it('should not submit if form is invalid', () => {
      spyOn(router, 'navigate');
      spyOn(service, 'getRotacionProducto');
      
      component.reporteRotacionInventarioForm.setErrors({ invalid: true });
      component.onSubmit();
      
      expect(router.navigate).not.toHaveBeenCalled();
      expect(service.getRotacionProducto).not.toHaveBeenCalled();
    });

    it('should navigate and fetch data when form is valid', fakeAsync(() => {
      spyOn(router, 'navigate').and.callThrough();
      
      component.listaProductos = mockProductosResponse.products;
      component.idProductoSeleccionado = '27644658-6c5c-4643-8121-c30bed696f68';
      
      component.reporteRotacionInventarioForm.patchValue({
        fieldProducto: 'Chocolisto',
        fieldDesde: new Date('2025-04-01'),
        fieldHasta: new Date('2025-05-01')
      });
      
      component.onSubmit();
      tick();
      
      expect(router.navigate).toHaveBeenCalled();
      
      const req = httpMock.expectOne(
        req => req.url.includes('/stock/product_rotation')
      );
      req.flush(mockRotacionProductoResponse);
      tick();
      
      expect(component.tableData.length).toBe(3);
      expect(component.stockInicial).toBe(50);
      expect(component.stockFinal).toBe(7);
      expect(component.rotacion).toBe('700%');
    }));

    it('should handle error when fetching rotation data', fakeAsync(() => {
      spyOn(console, 'log');
      
      component.listaProductos = mockProductosResponse.products;
      component.idProductoSeleccionado = '27644658-6c5c-4643-8121-c30bed696f68';
      
      component.reporteRotacionInventarioForm.patchValue({
        fieldProducto: 'Chocolisto',
        fieldDesde: new Date('2025-04-01'),
        fieldHasta: new Date('2025-05-01')
      });
      
      component.onSubmit();
      tick();
      
      const req = httpMock.expectOne(
        req => req.url.includes('/stock/product_rotation')
      );
      req.error(new ErrorEvent('Error'));
      tick();
      
      expect(console.log).toHaveBeenCalled();
    }));
  });

  describe('formatoFecha', () => {
    it('should format Date object to YYYY-MM-DD string', () => {
      const date = new Date(2025, 3, 1); // Abril 1, 2025
      const result = component.formatoFecha(date);
      expect(result).toBe('2025-04-01');
    });

    it('should return YYYY-MM-DD string as is', () => {
      const result = component.formatoFecha('2025-04-01');
      expect(result).toBe('2025-04-01');
    });

    it('should throw error for invalid date', () => {
      expect(() => component.formatoFecha('invalid-date')).toThrowError('Invalid date');
    });
  });


  describe('setupValidacionFechas', () => {
    it('should set up date validation', fakeAsync(() => {
      component.setupValidacionFechas();
      
      component.reporteRotacionInventarioForm.patchValue({
        fieldDesde: new Date('2025-05-01'),
        fieldHasta: new Date('2025-04-01')
      });
      tick();
      
      const fieldHasta = component.reporteRotacionInventarioForm.get('fieldHasta');
      expect(fieldHasta?.errors).toEqual({ invalidDate: true });
    }));
  });

  describe('validarFechas', () => {
    it('should set error when end date is before start date', () => {
      component.reporteRotacionInventarioForm.patchValue({
        fieldDesde: new Date('2025-05-01'),
        fieldHasta: new Date('2025-04-01')
      });
      
      component.validarFechas();
      
      expect(component.reporteRotacionInventarioForm.get('fieldHasta')?.errors).toEqual({ invalidDate: true });
    });

    it('should clear error when dates are valid', () => {
      component.reporteRotacionInventarioForm.patchValue({
        fieldDesde: new Date('2025-04-01'),
        fieldHasta: new Date('2025-05-01')
      });
      
      component.validarFechas();
      
      expect(component.reporteRotacionInventarioForm.get('fieldHasta')?.errors).toBeNull();
    });

    it('should do nothing when dates are not both set', () => {
      component.reporteRotacionInventarioForm.patchValue({
        fieldDesde: new Date('2025-04-01'),
        fieldHasta: null
      });
      
      component.validarFechas();
      
      const errors = component.reporteRotacionInventarioForm.get('fieldHasta')?.errors;
      expect(errors).toEqual({ required: true });
    });
  });

  describe('table behavior', () => {
    it('should display table data correctly', fakeAsync(() => {
      component.tableData = mockRotacionProductoResponse.movimientos;
      fixture.detectChanges();
      
      const tableRows = fixture.debugElement.queryAll(By.css('table tr'));
      expect(tableRows.length).toBe(4);
      
      const firstDataRow = tableRows[1].queryAll(By.css('td'));
      expect(firstDataRow[0].nativeElement.textContent).toContain('2025-04-18 15:34');
      expect(firstDataRow[2].nativeElement.textContent).toContain('50');
    }));
  });
});

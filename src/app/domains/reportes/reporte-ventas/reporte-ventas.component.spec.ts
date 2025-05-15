/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ReporteVentasComponent } from './reporte-ventas.component';
import { ReportesModule } from '../reportes.module';
import { ReporteVentasService } from './reporte-ventas.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

const mockReporteVentasResponse = [
    { 
      "producto": "Chocolisto", 
      "vendedor": "Test User 1", 
      "unidades_vendidas": 6.0, 
      "ingresos": 90000.0, 
      "primera_venta": "2025-05-10", 
      "ultima_venta": "2025-05-10"
    }, 
    {
      "producto": "Arroz", 
      "vendedor": "Test User 1", 
      "unidades_vendidas": 4.0, 
      "ingresos": 48000.0, 
      "primera_venta": "2025-05-11", 
      "ultima_venta": "2025-05-11"
    }
]

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

const mockVendedoresResponse = {
  sellers: [
    {
      id: "1e783abf-b6ae-4df3-80f4-c3936645389e",
      identification_number: 123456789,
      name: "Test User 1",
      email: "test1@testmail.com",
      address: "Calle 140, Bogotá",
      phone: "1234567890",
      zone: "Norte",
      user_id: "Vendedor123456789"
    },
    {
      id: "2e783abf-b6ae-4df3-80f4-c3936645389f",
      identification_number: 987654321,
      name: "Test User 2",
      email: "test2@testmail.com",
      address: "Calle 32, Bogotá",
      phone: "0987654321",
      zone: "Sur",
      user_id: "Vendedor987654321"
    }
  ]
};

describe('ReporteVentasComponent', () => {
  let component: ReporteVentasComponent;
  let fixture: ComponentFixture<ReporteVentasComponent>;
  let service: ReporteVentasService;
  let httpMock: HttpTestingController;
  let router: Router;
  let route: ActivatedRoute;
  let formBuilder: FormBuilder;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteVentasComponent ],
      imports: [ ReportesModule, HttpClientTestingModule, RouterTestingModule.withRoutes([]) ],
      providers: [ ReporteVentasService ]
    })
    .compileComponents();

    service = TestBed.inject(ReporteVentasService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    formBuilder = TestBed.inject(FormBuilder);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

  // ---------------------------------------------

  describe('autoCompletarVendedor', () => {
    it('should initialize filtered products observable', () => {
      component.listaVendedores = mockVendedoresResponse.sellers;
      component.autoCompletarVendedor();
      
      expect(component.numerosIdentificacionFiltrados).toBeDefined();
      
      component.numerosIdentificacionFiltrados.subscribe(result => {
        expect(result.length).toBe(2);
        expect(result).toEqual([123456789, 987654321]);
      });
    });
  });

  describe('_filtrarNumerosIdentificacion', () => {
    it('should filter sellers by identification number', () => {
      component.listaVendedores = mockVendedoresResponse.sellers;
      
      const result = component._filtrarNumerosIdentificacion('12345');
      expect(result.length).toBe(1);
      expect(result[0]).toBe(123456789);
    });

    it('should return empty array if no match', () => {
      component.listaVendedores = mockVendedoresResponse.sellers;
      
      const result = component._filtrarNumerosIdentificacion('XYZ');
      expect(result.length).toBe(0);
    });

    it('should return all sellers if empty filter', () => {
      component.listaVendedores = mockVendedoresResponse.sellers;
      
      const result = component._filtrarNumerosIdentificacion('');
      expect(result.length).toBe(2);
    });
  });

  describe('cargarVendedores', () => {
    it('should load sellers and update filtered list', fakeAsync(() => {
      spyOn(component, 'autoCompletarVendedor').and.callThrough();

      component.listaVendedores = [];
      
      component.cargarVendedores();
      tick();
      
      const reqs = httpMock.match(req => req.url.includes('/sellers'));
      expect(reqs.length).toBeGreaterThanOrEqual(1);
      
      reqs.forEach(req => {
        expect(req.request.method).toBe('GET');
        req.flush(mockVendedoresResponse);
      });
      tick();

      expect(component.listaVendedores.length).toBe(2);
      expect(component.autoCompletarVendedor).toHaveBeenCalled();
    }));

    it('should handle error when loading sellers', fakeAsync(() => {
      spyOn(console, 'error');
      
      component.listaVendedores = [];
      
      component.cargarVendedores();
      tick(); 
      
      const reqs = httpMock.match(req => req.url.includes('/sellers'));
      expect(reqs.length).toBeGreaterThanOrEqual(1);
      
      reqs.forEach(req => {
        req.error(new ErrorEvent('Error loading sellers'));
      });
      tick();
      
      expect(console.error).toHaveBeenCalled();
    }));
  });


  // ---------------------------------------------

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

  describe('conVendedorSeleccionado', () => {
    beforeEach(() => {
      component.listaVendedores = mockVendedoresResponse.sellers;
    });

    it('should set idVendedorSeleccionado when seller is found', () => {
      component.conVendedorSeleccionado(123456789);
      expect(component.idVendedorSeleccionado).toBe('1e783abf-b6ae-4df3-80f4-c3936645389e');
    });

    it('should set idVendedorSeleccionado to null when seller is not found', () => {
      component.conVendedorSeleccionado(999999999);
      expect(component.idVendedorSeleccionado).toBeNull();
    });

    it('should handle empty input', () => {
      component.conVendedorSeleccionado(NaN);
      expect(component.idVendedorSeleccionado).toBeNull();
    });

    it('should work correctly with empty sellers list', () => {
      component.listaVendedores = [];
      component.conVendedorSeleccionado(123456789);
      expect(component.idVendedorSeleccionado).toBeNull();
    });

    it('should handle string input by converting to number', () => {
      component.conVendedorSeleccionado(parseInt('123456789'));
      expect(component.idVendedorSeleccionado).toBe('1e783abf-b6ae-4df3-80f4-c3936645389e');
    });
  });

  describe('actualizarUrlConParams', () => {
    it('should update form values from query params', fakeAsync(() => {
      const queryParams = {
        producto: '27644658-6c5c-4643-8121-c30bed696f68',
        vendedor: '1e783abf-b6ae-4df3-80f4-c3936645389e',
        fecha_inicio: '2025-04-01',
        fecha_fin: '2025-05-01'
      };
      
      Object.defineProperty(route, 'queryParams', { 
        writable: true,
        value: of(queryParams)
      });
      
      spyOn(service, 'getListaProductos').and.returnValue(of(mockProductosResponse));
      spyOn(service, 'getListaVendedores').and.returnValue(of(mockVendedoresResponse));
      
      component.initializeForm();
      
      component.cargarProductos();
      component.cargarVendedores();
      tick();
      
      component.actualizarUrlConParams();
      tick();
      
      expect(component.idProductoSeleccionado).toBe('27644658-6c5c-4643-8121-c30bed696f68');
      expect(component.idVendedorSeleccionado).toBe('1e783abf-b6ae-4df3-80f4-c3936645389e');
      
      expect(component.reporteVentasForm.value).toEqual({
        fieldProducto: 'Chocolisto',
        fieldVendedor: '123456789',
        fieldDesde: new Date(2025, 3, 1), // April 1, 2025
        fieldHasta: new Date(2025, 4, 1)  // May 1, 2025
      });
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
    beforeEach(() => {
      component.initializeForm();
      component.listaProductos = mockProductosResponse.products;
      component.listaVendedores = mockVendedoresResponse.sellers;
      fixture.detectChanges();
    });

    function adjustDateForTimezone(date: Date): string {
      const timezoneOffset = date.getTimezoneOffset() * 60000;
      const adjustedDate = new Date(date.getTime() - timezoneOffset);
      return adjustedDate.toISOString().split('T')[0];
    }

    it('should submit form with valid data and update URL', fakeAsync(() => {
      spyOn(router, 'navigate').and.callThrough();
      spyOn(service, 'getReporteVentas').and.returnValue(of(mockReporteVentasResponse));

      const startDate = new Date(2025, 3, 1); // Abril 1, 2025
      const endDate = new Date(2025, 5, 1); // Junio 1, 2025

      const expectedStartDate = adjustDateForTimezone(startDate);
      const expectedEndDate = adjustDateForTimezone(endDate);
      
      component.reporteVentasForm.patchValue({
        fieldDesde: startDate,
        fieldHasta: endDate,
        fieldProducto: 'Chocolisto',
        fieldVendedor: '123456789'
      });
      
      component.conProductoSeleccionado('Chocolisto');
      component.conVendedorSeleccionado(123456789);
      
      component.onSubmit();
      tick();
      
      expect(router.navigate).toHaveBeenCalledWith([], {
        relativeTo: route,
        queryParams: jasmine.objectContaining({
          fecha_inicio: expectedStartDate,
          fecha_fin: expectedEndDate,
          producto: '27644658-6c5c-4643-8121-c30bed696f68',
          vendedor: '1e783abf-b6ae-4df3-80f4-c3936645389e'
        }),
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
      
      expect(service.getReporteVentas).toHaveBeenCalledWith(
        expectedStartDate,
        expectedEndDate,
        '27644658-6c5c-4643-8121-c30bed696f68',
        '1e783abf-b6ae-4df3-80f4-c3936645389e'
      );
      
      expect(component.tableData).toEqual(mockReporteVentasResponse);
    }));

    it('should handle form submission without optional fields', fakeAsync(() => {
      spyOn(router, 'navigate').and.callThrough();
      spyOn(service, 'getReporteVentas').and.returnValue(of(mockReporteVentasResponse));

      const startDate = new Date(2025, 3, 1); // Abril 1, 2025
      const endDate = new Date(2025, 5, 1); // Junio 1, 2025
      
      const expectedStartDate = adjustDateForTimezone(startDate);
      const expectedEndDate = adjustDateForTimezone(endDate);
      
      component.reporteVentasForm.patchValue({
        fieldDesde: startDate,
        fieldHasta: endDate,
        fieldProducto: '',
        fieldVendedor: ''
      });
      
      component.onSubmit();
      tick();
      
      expect(router.navigate).toHaveBeenCalledWith([], {
        relativeTo: route,
        queryParams: jasmine.objectContaining({
          fecha_inicio: expectedStartDate,
          fecha_fin: expectedEndDate
        }),
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
      
      expect(service.getReporteVentas).toHaveBeenCalledWith(
        expectedStartDate,
        expectedEndDate,
        null,
        null
      );
    }));

    it('should handle API errors when getting sales report', fakeAsync(() => {
      const startDate = new Date(2025, 3, 1); // Abril 1, 2025
      const endDate = new Date(2025, 5, 1); // Junio 1, 2025
      
      component.reporteVentasForm.patchValue({
        fieldDesde: startDate,
        fieldHasta: endDate
      });

      const errorResponse = new ErrorEvent('API error', {
        message: 'Failed to load sales report'
      });
      spyOn(service, 'getReporteVentas').and.returnValue(
        throwError(() => errorResponse)
      );
      spyOn(console, 'log');

      component.onSubmit();
      tick();

      expect(service.getReporteVentas).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith(errorResponse);
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
      
      component.reporteVentasForm.patchValue({
        fieldDesde: new Date('2025-05-01'),
        fieldHasta: new Date('2025-04-01')
      });
      tick();
      
      const fieldHasta = component.reporteVentasForm.get('fieldHasta');
      expect(fieldHasta?.errors).toEqual({ invalidDate: true });
    }));
  });

  describe('validarFechas', () => {
    it('should set error when end date is before start date', () => {
      component.reporteVentasForm.patchValue({
        fieldDesde: new Date('2025-05-01'),
        fieldHasta: new Date('2025-04-01')
      });
      
      component.validarFechas();
      
      expect(component.reporteVentasForm.get('fieldHasta')?.errors).toEqual({ invalidDate: true });
    });

    it('should clear error when dates are valid', () => {
      component.reporteVentasForm.patchValue({
        fieldDesde: new Date('2025-04-01'),
        fieldHasta: new Date('2025-05-01')
      });
      
      component.validarFechas();
      
      expect(component.reporteVentasForm.get('fieldHasta')?.errors).toBeNull();
    });

    it('should do nothing when dates are not both set', () => {
      component.reporteVentasForm.patchValue({
        fieldDesde: new Date('2025-04-01'),
        fieldHasta: null
      });
      
      component.validarFechas();
      
      const errors = component.reporteVentasForm.get('fieldHasta')?.errors;
      expect(errors).toEqual({ required: true });
    });
  });

  describe('table behavior', () => {
    it('should display table data correctly', fakeAsync(() => {
      component.tableData = mockReporteVentasResponse;
      fixture.detectChanges();
      
      const tableRows = fixture.debugElement.queryAll(By.css('table tr'));
      expect(tableRows.length).toBe(3);
      
      const firstDataRow = tableRows[1].queryAll(By.css('td'));
      expect(firstDataRow[0].nativeElement.textContent).toContain('Chocolisto');
      expect(firstDataRow[2].nativeElement.textContent).toContain(6);
    }));
  });

});

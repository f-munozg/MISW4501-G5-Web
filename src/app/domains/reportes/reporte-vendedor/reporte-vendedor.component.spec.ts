/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { ReporteVendedorComponent } from './reporte-vendedor.component';
import { ReportesModule } from '../reportes.module';
import { ReporteVendedorService } from './reporte-vendedor.service';

const mockVendedoresResponse = {
  sellers: [
    { id: '1', identification_number: 123456, name: 'John Doe', email: 'john@test.com', address: '123 St', phone: '123', zone: 'North', user_id: 'user1' },
    { id: '2', identification_number: 789012, name: 'Jane Smith', email: 'jane@test.com', address: '456 St', phone: '456', zone: 'South', user_id: 'user2' }
  ]
};

const mockReporteVendedorResponse = {
  resumen: {
    total_ventas: 1000,
    total_ventas_plan: 1200,
    clientes_atendidos: 10,
    clientes_visitados: 15,
    tasa_conversion: '66.67%',
    plan: {
      periodo: '2025-05',
      producto: 'Product A',
      meta: '1200',
      cumplimiento: '83.33%'
    }
  },
  detalle_productos: [
    { producto: 'Product A', fecha_venta: '2025-05-01', cantidad: 5, valor_unitario: 100, valor_total: 500 },
    { producto: 'Product B', fecha_venta: '2025-05-02', cantidad: 2, valor_unitario: 250, valor_total: 500 }
  ]
};

describe('ReporteVendedorComponent', () => {
  let component: ReporteVendedorComponent;
  let fixture: ComponentFixture<ReporteVendedorComponent>;
  let service: ReporteVendedorService;
  let httpMock: HttpTestingController;
  let router: Router;
  let route: ActivatedRoute;
  let formBuilder: FormBuilder;

  beforeEach(waitForAsync(() => {
    const mockRoute = {
      queryParams: of({
        vendedor: '1',
        start_date: '2025-05-01',
        end_date: '2025-05-31'
      })
    };

    TestBed.overrideProvider(ActivatedRoute, { useValue: mockRoute });

    TestBed.configureTestingModule({
      declarations: [ ReporteVendedorComponent ],
      imports: [ 
        ReportesModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]) 
      ],
      providers: [
        ReporteVendedorService,
        FormBuilder
      ]
    })
    .compileComponents();

    service = TestBed.inject(ReporteVendedorService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    formBuilder = TestBed.inject(FormBuilder);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteVendedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*
  afterEach(() => {
    httpMock.verify();
  });
  */

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize form, setup autocomplete and load sellers', fakeAsync(() => {
      spyOn(component, 'initializeForm').and.callThrough();
      spyOn(component, 'autoCompletarVendedor').and.callThrough();
      spyOn(component, 'cargarVendedores').and.callThrough();
      spyOn(component, 'setupValidacionFechas').and.callThrough();

      component.ngOnInit();
      tick();

      expect(component.initializeForm).toHaveBeenCalled();
      expect(component.autoCompletarVendedor).toHaveBeenCalled();
      expect(component.cargarVendedores).toHaveBeenCalled();
      expect(component.setupValidacionFechas).toHaveBeenCalled();
    }));
  });

  describe('initializeForm', () => {
    it('should initialize the form with required validators', () => {
      component.initializeForm();
      
      expect(component.reporteVendedorForm).toBeDefined();
      expect(component.reporteVendedorForm.get('fieldDesde')?.validator).toBeTruthy();
      expect(component.reporteVendedorForm.get('fieldHasta')?.validator).toBeTruthy();
      expect(component.reporteVendedorForm.get('fieldVendedor')?.validator).toBeTruthy();
    });
  });

  describe('autoCompletarVendedor', () => {
    it('should initialize filtered identification numbers observable', () => {
      component.listaVendedores = mockVendedoresResponse.sellers;
      component.autoCompletarVendedor();
      
      expect(component.numerosIdentificacionFiltrados).toBeDefined();
      
      component.numerosIdentificacionFiltrados.subscribe(result => {
        expect(result.length).toBe(2);
        expect(result).toEqual([123456, 789012]);
      });
    });
  });

  describe('_filtrarNumerosIdentificacion', () => {
    it('should filter sellers by identification number', () => {
      component.listaVendedores = mockVendedoresResponse.sellers;
      
      const result = component._filtrarNumerosIdentificacion('123');
      expect(result.length).toBe(1);
      expect(result[0]).toBe(123456);
    });

    it('should return empty array if no match', () => {
      component.listaVendedores = mockVendedoresResponse.sellers;
      
      const result = component._filtrarNumerosIdentificacion('999');
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
      spyOn(component, 'actualizarUrlConParams').and.callThrough();

      component.listaVendedores = [];
      
      component.cargarVendedores();
      tick();
      
      const reqs = httpMock.match(req => req.url.includes('/sellers'));
      expect(reqs.length).toBe(2);

      // Respond to all matching requests
      reqs.forEach(req => req.flush(mockVendedoresResponse));
      tick();

      expect(component.listaVendedores.length).toBe(2);
      expect(component.autoCompletarVendedor).toHaveBeenCalled();
      expect(component.actualizarUrlConParams).toHaveBeenCalled();
    }));

    it('should handle error when loading sellers', fakeAsync(() => {
      spyOn(console, 'error');
      
      component.cargarVendedores();
      tick();
      
      const reqs = httpMock.match(req => req.url.includes('/sellers'));
      expect(reqs.length).toBe(2);
      
      reqs.forEach(req => req.error(new ErrorEvent('Error loading sellers')));
      tick();
      
      expect(console.error).toHaveBeenCalled();
    }));
  });

  describe('conVendedorSeleccionado', () => {
    beforeEach(() => {
      component.listaVendedores = mockVendedoresResponse.sellers;
    });

    it('should set idVendedorSeleccionado when seller is found', () => {
      component.conVendedorSeleccionado(123456);
      
      expect(component.idVendedorSeleccionado).toBe('1');
    });

    it('should set idVendedorSeleccionado to null when seller is not found', () => {
      component.conVendedorSeleccionado(999999);
      
      expect(component.idVendedorSeleccionado).toBeNull();
    });
  });

  describe('actualizarUrlConParams', () => {
    it('should update form values from query params', fakeAsync(() => {
      spyOn(service, 'getListaVendedores').and.returnValue(of(mockVendedoresResponse));
      
      component.cargarVendedores();
      tick();
      
      component.actualizarUrlConParams();
      tick();
      
      expect(component.idVendedorSeleccionado).toBe('1');
      expect(component.reporteVendedorForm.value.fieldVendedor).toBe('123456');
      expect(component.reporteVendedorForm.value.fieldDesde).toEqual(new Date(2025, 4, 1));
      expect(component.reporteVendedorForm.value.fieldHasta).toEqual(new Date(2025, 4, 31));
    }));
  });

  describe('parsearFechaComoString', () => {
    it('should parse YYYY-MM-DD format correctly', () => {
      const date = component.parsearFechaComoString('2025-05-01');
      expect(date.getFullYear()).toBe(2025);
      expect(date.getMonth()).toBe(4); // May is month 4 (0-indexed)
      expect(date.getDate()).toBe(1);
    });

    it('should handle other date formats', () => {
      const dateStr = '2025-05-01T00:00:00';
      const date = component.parsearFechaComoString(dateStr);
      expect(date).toEqual(new Date(dateStr));
    });
  });

  describe('formatoFecha', () => {
    it('should format Date object to YYYY-MM-DD string', () => {
      const date = new Date(2025, 4, 1); // May 1, 2025
      const result = component.formatoFecha(date);
      expect(result).toBe('2025-05-01');
    });

    it('should return YYYY-MM-DD string as is', () => {
      const result = component.formatoFecha('2025-05-01');
      expect(result).toBe('2025-05-01');
    });

    it('should throw error for invalid date', () => {
      expect(() => component.formatoFecha('invalid-date')).toThrowError('Invalid date');
    });
  });

  describe('onSubmit', () => {
    it('should not submit if form is invalid', () => {
      spyOn(router, 'navigate');
      spyOn(service, 'getReporteVendedor');
      
      component.reporteVendedorForm.setErrors({ invalid: true });
      component.onSubmit();
      
      expect(router.navigate).not.toHaveBeenCalled();
      expect(service.getReporteVendedor).not.toHaveBeenCalled();
    });

    it('should navigate and fetch data when form is valid', fakeAsync(() => {
      spyOn(router, 'navigate').and.callThrough();
      
      const initialReq = httpMock.expectOne(req => req.url.includes('/sellers'));
      initialReq.flush(mockVendedoresResponse);
      tick();
      
      component.listaVendedores = mockVendedoresResponse.sellers;
      component.idVendedorSeleccionado = '1';
      
      component.reporteVendedorForm.patchValue({
        fieldVendedor: '123456',
        fieldDesde: new Date('2025-05-01'),
        fieldHasta: new Date('2025-05-31')
      });
      
      component.onSubmit();
      tick();
      
      expect(router.navigate).toHaveBeenCalled();
      
      const reportReq = httpMock.expectOne(
        req => req.url.includes('/reports/reporte_vendedor')
      );
      reportReq.flush(mockReporteVendedorResponse);
      tick();
      
      expect(component.tableData.length).toBe(2);
      expect(component.totalVentas).toBe(1000);
      expect(component.clientesAtendidos).toBe(10);
      expect(component.cumplimientoMetas).toBe('83.33%');
    }));
  });

  describe('validarFechas', () => {
    it('should set error when end date is before start date', () => {
      component.reporteVendedorForm.patchValue({
        fieldDesde: new Date('2025-05-31'),
        fieldHasta: new Date('2025-05-01')
      });
      
      component.validarFechas();
      
      expect(component.reporteVendedorForm.get('fieldHasta')?.errors).toEqual({ invalidDate: true });
    });

    it('should clear error when dates are valid', () => {
      component.reporteVendedorForm.patchValue({
        fieldDesde: new Date('2025-05-01'),
        fieldHasta: new Date('2025-05-31')
      });
      
      component.validarFechas();
      
      expect(component.reporteVendedorForm.get('fieldHasta')?.errors).toBeNull();
    });
  });
});
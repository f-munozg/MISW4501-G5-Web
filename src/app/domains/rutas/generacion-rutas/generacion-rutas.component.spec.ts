/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { GeneracionRutasComponent } from './generacion-rutas.component';
import { GeneracionRutasService } from './generacion-rutas.service';
import { Orden, OrdenResponse } from '../../pedidos/pedidos.model';
import { VendedoresResponse, ClientesResponse } from '../../vendedores/vendedores.model';
import { RutasModule } from '../rutas.module';
import { environment } from '../../../../environments/environment'

const mockOrdenesResponse: OrdenResponse = {
  orders: [
    {
      status: 'created',
      date_delivery: '2025-05-20T00:00:00',
      date_order: '2025-05-18T00:00:00',
      seller_id: 'seller1',
      id: 'order1',
      customer_id: 'customer1'
    },
    {
      status: 'created',
      date_delivery: '2025-05-20T00:00:00',
      date_order: '2025-05-19T00:00:00',
      seller_id: 'seller2',
      id: 'order2',
      customer_id: 'customer2'
    },
    {
      status: 'delivered',
      date_delivery: '2025-05-20T00:00:00',
      date_order: '2025-05-17T00:00:00',
      seller_id: 'seller1',
      id: 'order3',
      customer_id: 'customer3'
    }
  ]
};

const mockVendedoresResponse: VendedoresResponse = {
  sellers: [
    {
      id: 'seller1',
      identification_number: 123,
      name: 'Vendedor 1',
      email: 'v1@test.com',
      address: 'addr1',
      phone: '123',
      zone: 'zone1',
      user_id: 'user1'
    },
    {
      id: 'seller2',
      identification_number: 456,
      name: 'Vendedor 2',
      email: 'v2@test.com',
      address: 'addr2',
      phone: '456',
      zone: 'zone2',
      user_id: 'user2'
    }
  ]
};

const mockClientesResponse: ClientesResponse = {
  customers: [
    {
      id: 'customer1',
      name: 'Cliente 1',
      identification_number: '111',
      observations: 'obs1',
      user_id: 'user1',
      email: 'c1@test.com'
    },
    {
      id: 'customer2',
      name: 'Cliente 2',
      identification_number: '222',
      observations: 'obs2',
      user_id: 'user2',
      email: 'c2@test.com'
    }
  ]
};

const mockRouteResponse = {
  message: "route created",
  id: "route1",
  stops: [],
  map: "base64encodedimage"
};

describe('GeneracionRutasComponent', () => {
  let component: GeneracionRutasComponent;
  let fixture: ComponentFixture<GeneracionRutasComponent>;
  let service: GeneracionRutasService;
  let httpMock: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneracionRutasComponent ],
      imports: [
        RutasModule,
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatDatepickerModule,
        MatNativeDateModule
      ],
      providers: [
        GeneracionRutasService
      ]
    })
    .compileComponents();

    service = TestBed.inject(GeneracionRutasService);
    httpMock = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneracionRutasComponent);
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
    it('should initialize form and load sellers/customers', () => {
      spyOn(component, 'initializeForm');
      spyOn(component, 'cargarVendedoresClientes');

      component.ngOnInit();

      expect(component.initializeForm).toHaveBeenCalled();
      expect(component.cargarVendedoresClientes).toHaveBeenCalled();
    });
  });

  describe('initializeForm', () => {
    it('should create form with required fieldFechaEntrega', () => {
      component.initializeForm();

      expect(component.generacionRutasForm).toBeTruthy();
      expect(component.generacionRutasForm.get('fieldFechaEntrega')?.validator).toBeTruthy();
    });
  });

  describe('cargarVendedoresClientes', () => {
    it('should load sellers and customers', fakeAsync(() => {
      fixture.detectChanges();
      
      const sellerReq = httpMock.expectOne(`${environment.apiUrlSellers}/sellers`);
      const customerReq = httpMock.expectOne(`${environment.apiUrlCustomers}/customers`);
      
      sellerReq.flush(mockVendedoresResponse);
      customerReq.flush(mockClientesResponse);
      
      tick();
      fixture.detectChanges();
      
      expect(component.listaVendedores.length).toBe(2);
      expect(component.listaClientes.length).toBe(2);
      expect(component.isRefreshing).toBeFalse();
    }));

    it('should handle error when loading sellers', fakeAsync(() => {
      spyOn(console, 'error');
      
      fixture.detectChanges();
      
      const sellerReq = httpMock.expectOne(`${environment.apiUrlSellers}/sellers`);
      const customerReq = httpMock.expectOne(`${environment.apiUrlCustomers}/customers`);
      
      sellerReq.error(new ErrorEvent('Network error'));
      customerReq.flush(mockClientesResponse);
      
      tick();
      fixture.detectChanges();
      
      expect(console.error).toHaveBeenCalled();
      expect(component.listaVendedores.length).toBe(0);
      expect(component.listaClientes.length).toBe(2);
      expect(component.isRefreshing).toBeFalse(); 
    }));
  });

  describe('onSubmit', () => {
    it('should not submit if form is invalid', () => {
      spyOn(component, 'cargarOrdenesPorFechaEntrega');
      
      component.generacionRutasForm.setErrors({ invalid: true });
      component.onSubmit();
      
      expect(component.cargarOrdenesPorFechaEntrega).not.toHaveBeenCalled();
    });

    it('should set selectedDate and load orders when form is valid', () => {
      spyOn(component, 'cargarOrdenesPorFechaEntrega');
      
      const testDate = new Date('2025-05-20');
      component.generacionRutasForm.patchValue({ fieldFechaEntrega: testDate });
      
      component.onSubmit();
      
      expect(component.selectedDate).toEqual(testDate);
      expect(component.cargarOrdenesPorFechaEntrega).toHaveBeenCalled();
    });
  });

  describe('cargarOrdenesPorFechaEntrega', () => {
    it('should filter orders by selected date and status', fakeAsync(() => {
      console.log('=== STARTING TEST ===');
      
      component.selectedDate = new Date(Date.UTC(2025, 4, 20));
      console.log('Selected date object:', component.selectedDate);
      
      component.listaVendedores = mockVendedoresResponse.sellers;
      component.listaClientes = mockClientesResponse.customers;

      console.log('Calling cargarOrdenesPorFechaEntrega()');
      component.cargarOrdenesPorFechaEntrega();
      
      const req = httpMock.expectOne(`${environment.apiUrlOrders}/orders`);
      console.log('HTTP request intercepted');

      const testData = {
        orders: [
          {
            status: 'created',
            date_delivery: '2025-05-20T00:00:00.000Z',
            date_order: '2025-05-18T00:00:00.000Z',
            seller_id: 'seller1',
            id: 'order1',
            customer_id: 'customer1'
          },
          {
            status: 'created',
            date_delivery: '2025-05-20T00:00:00.000Z',
            date_order: '2025-05-19T00:00:00.000Z',
            seller_id: 'seller2',
            id: 'order2',
            customer_id: 'customer2'
          },
          {
            status: 'delivered',
            date_delivery: '2025-05-20T00:00:00.000Z',
            date_order: '2025-05-17T00:00:00.000Z',
            seller_id: 'seller1',
            id: 'order3',
            customer_id: 'customer3'
          }
        ]
      };
      req.flush(testData);
      console.log('Flushed test data:', testData);
      
      tick();
      fixture.detectChanges();

      console.log('=== COMPONENT STATE ===');
      console.log('listaOrdenes:', component.listaOrdenes);
      console.log('tableData:', component.tableData);
      console.log('isRefreshing:', component.isRefreshing);

      expect(component.listaOrdenes.length).toBe(2, 'Should find 2 matching orders');
      expect(component.tableData.length).toBe(2, 'Should create 2 table rows');
      expect(component.isRefreshing).toBeFalse();
      
      console.log('=== TEST COMPLETE ===');
    }));

    it('should handle error when loading orders', fakeAsync(() => {
      spyOn(console, 'error');
      component.selectedDate = new Date('2025-05-20');
      
      component.cargarOrdenesPorFechaEntrega();
      
      const req = httpMock.expectOne(req => req.url.includes('/orders'));
      req.error(new ErrorEvent('Error'));
      
      tick();
      
      expect(console.error).toHaveBeenCalled();
      expect(component.isRefreshing).toBeFalse();
    }));
  });

  describe('prepararInfoTabla', () => {
    beforeEach(() => {
      component.listaOrdenes = mockOrdenesResponse.orders;
      component.listaVendedores = mockVendedoresResponse.sellers;
      component.listaClientes = mockClientesResponse.customers;
    });

    it('should prepare table data with correct mappings', () => {
      component.prepararInfoTabla();
      
      expect(component.tableData.length).toBe(2); // Solo status de 'created'
      expect(component.tableData[0].seller).toBe('Vendedor 1');
      expect(component.tableData[0].customer).toBe('Cliente 1');
      expect(component.tableData[0].date_delivery).toBe('2025-05-20');
    });

    it('should handle unknown seller/customer', () => {
      component.listaVendedores = [];
      component.listaClientes = [];
      
      component.prepararInfoTabla();
      
      expect(component.tableData[0].seller).toBe('Desconocido');
      expect(component.tableData[0].customer).toBe('Desconocido');
    });
  });

  describe('generarRuta', () => {
    beforeEach(() => {
      component.listaOrdenes = mockOrdenesResponse.orders;
      component.ordenesSeleccionadas = [
        { 
          id: 'order1', 
          customer: 'Cliente 1', 
          seller: 'Vendedor 1', 
          status: 'created',
          date_delivery: '2025-05-20',
          date_order: '2025-05-18'
        }
      ];
    });

    it('should not generate route if no orders selected', () => {
      component.ordenesSeleccionadas = [];
      spyOn(service, 'postDeliveryRoute');
      
      component.generarRuta();
      
      expect(service.postDeliveryRoute).not.toHaveBeenCalled();
    });

    it('should generate route and update state on success', fakeAsync(() => {
      component.listaOrdenes = mockOrdenesResponse.orders.filter(o => o.status === 'created');
      component.listaVendedores = mockVendedoresResponse.sellers;
      component.listaClientes = mockClientesResponse.customers;
      component.prepararInfoTabla();
      
      component.ordenesSeleccionadas = [component.tableData[0]];
      
      component.generarRuta();
      
      const req = httpMock.expectOne(`${environment.apiUrlRoutes}/routes/delivery`);
      req.flush(mockRouteResponse);
      
      tick();
      
      expect(component.tableData.length).toBe(1);
      expect(component.isGeneratingRoute).toBeFalse();
      expect(component.isMapLoading).toBeFalse();
    }));


    it('should handle error when generating route', fakeAsync(() => {
      spyOn(console, 'error');
      
      component.generarRuta();
      
      const req = httpMock.expectOne(req => req.url.includes('/routes/delivery'));
      req.error(new ErrorEvent('Error'));
      
      tick();
      
      expect(console.error).toHaveBeenCalled();
      expect(component.isGeneratingRoute).toBeFalse();
      expect(component.isMapLoading).toBeFalse();
    }));
  });

  describe('getCustomerIdDesdeOrden', () => {
    it('should return customer_id for given order id', () => {
      component.listaOrdenes = mockOrdenesResponse.orders;
      
      const result = component.getCustomerIdDesdeOrden('order1');
      expect(result).toBe('customer1');
    });

    it('should return empty string if order not found', () => {
      component.listaOrdenes = mockOrdenesResponse.orders;
      
      const result = component.getCustomerIdDesdeOrden('nonexistent');
      expect(result).toBe('');
    });
  });
});
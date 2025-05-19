/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { GeneracionRutasService } from './generacion-rutas.service';
import { environment } from '../../../../environments/environment'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OrdenResponse } from '../../pedidos/pedidos.model';
import { ClientesResponse, VendedoresResponse } from '../../vendedores/vendedores.model';

describe('Service: GeneracionRutas', () => {
  let service: GeneracionRutasService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GeneracionRutasService]
    });
    service = TestBed.inject(GeneracionRutasService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verify that no unmatched requests are outstanding
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getOrdenes', () => {
    it('should fetch orders with correct URL and method', () => {
      const mockResponse: OrdenResponse = {
        orders: [
          {
            status: 'pending',
            date_delivery: '2025-05-20',
            date_order: '2025-05-19',
            seller_id: '1',
            id: '101',
            customer_id: '201'
          }
        ]
      };

      service.getOrdenes().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrlOrders}/orders`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle empty orders response', () => {
      const mockResponse: OrdenResponse = { orders: [] };

      service.getOrdenes().subscribe(response => {
        expect(response.orders.length).toBe(0);
      });

      const req = httpMock.expectOne(`${environment.apiUrlOrders}/orders`);
      req.flush(mockResponse);
    });
  });

  describe('getListaVendedores', () => {
    it('should fetch sellers with correct URL and method', () => {
      const mockResponse: VendedoresResponse = {
        sellers: [
          {
            id: '1',
            identification_number: 123456789,
            name: 'John Doe',
            email: 'john@example.com',
            address: '123 Main St',
            phone: '555-1234',
            zone: 'North',
            user_id: 'user1'
          }
        ]
      };

      service.getListaVendedores().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrlSellers}/sellers`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle empty sellers response', () => {
      const mockResponse: VendedoresResponse = { sellers: [] };

      service.getListaVendedores().subscribe(response => {
        expect(response.sellers.length).toBe(0);
      });

      const req = httpMock.expectOne(`${environment.apiUrlSellers}/sellers`);
      req.flush(mockResponse);
    });
  });

  describe('getClientes', () => {
    it('should fetch customers with correct URL and method', () => {
      const mockResponse: ClientesResponse = {
        customers: [
          {
            id: '201',
            name: 'Acme Corp',
            identification_number: '987654321',
            observations: 'Regular customer',
            user_id: 'user1',
            email: 'acme@example.com'
          }
        ]
      };

      service.getClientes().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrlCustomers}/customers`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle empty customers response', () => {
      const mockResponse: ClientesResponse = { customers: [] };

      service.getClientes().subscribe(response => {
        expect(response.customers.length).toBe(0);
      });

      const req = httpMock.expectOne(`${environment.apiUrlCustomers}/customers`);
      req.flush(mockResponse);
    });
  });

  describe('postDeliveryRoute', () => {
    it('should post delivery route with correct URL and method', () => {
      const mockBody = {
        route_name: 'Morning Delivery',
        date: '2025-05-20',
        orders: ['101', '102']
      };
      const mockResponse = { success: true };

      service.postDeliveryRoute(mockBody).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrlRoutes}/routes/delivery`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockBody);
      req.flush(mockResponse);
    });

    it('should handle error response from delivery route post', () => {
      const mockBody = {
        route_name: 'Morning Delivery',
        date: '2025-05-20',
        orders: ['101', '102']
      };
      const mockError = { status: 400, statusText: 'Bad Request' };

      service.postDeliveryRoute(mockBody).subscribe({
        error: (err) => {
          expect(err.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrlRoutes}/routes/delivery`);
      req.flush(null, mockError);
    });
  });
});
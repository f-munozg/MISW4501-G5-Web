/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { ReporteVendedorService } from './reporte-vendedor.service';
import { VendedoresResponse } from '../../vendedores/vendedores.model';
import { environment } from '../../../../environments/environment';
import { ReporteVendedorResponse } from '../reportes.model';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('Service: ReporteVendedor', () => {
  let service: ReporteVendedorService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReporteVendedorService]
    });

    service = TestBed.inject(ReporteVendedorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getListaVendedores', () => {
    it('should make a GET request to fetch sellers', () => {
      const mockResponse: VendedoresResponse = {
        sellers: [
          {
            id: '1',
            identification_number: 123,
            name: 'Test Seller',
            email: 'test@example.com',
            address: '123 Test St',
            phone: '555-1234',
            zone: 'Test Zone',
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
  });

  describe('getReporteVendedor', () => {
    it('should make a GET request with date parameters', () => {
      const mockResponse: ReporteVendedorResponse = {
        resumen: {
          total_ventas: 1000,
          total_ventas_plan: 1200,
          clientes_atendidos: 10,
          clientes_visitados: 15,
          tasa_conversion: '66.67%',
          plan: {
            periodo: '2025-05',
            producto: 'Test Product',
            meta: '1000',
            cumplimiento: '100%'
          }
        },
        detalle_productos: []
      };

      const fecha_inicio = '2025-01-01';
      const fecha_fin = '2025-01-31';
      const idVendedor = 'cad4bda4-b46a-46d5-9c7f-d8b4c1369de8'

      service.getReporteVendedor(fecha_inicio, fecha_fin, idVendedor).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        req => req.url === `${environment.apiUrlReports}/reports/reporte_vendedor` &&
               req.params.get('fecha_inicio') === fecha_inicio &&
               req.params.get('fecha_fin') === fecha_fin &&
               req.params.get('seller_id') === idVendedor
      );

      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should include seller_id parameter when provided', () => {
      const mockResponse: ReporteVendedorResponse = {
        resumen: {
          total_ventas: 1000,
          total_ventas_plan: 1200,
          clientes_atendidos: 10,
          clientes_visitados: 15,
          tasa_conversion: '66.67%',
          plan: {
            periodo: '2025-05',
            producto: 'Test Product',
            meta: '1000',
            cumplimiento: '100%'
          }
        },
        detalle_productos: []
      };

      const fecha_inicio = '2025-01-01';
      const fecha_fin = '2025-01-31';
      const idVendedor = '123';

      service.getReporteVendedor(fecha_inicio, fecha_fin, idVendedor).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        req => req.url === `${environment.apiUrlReports}/reports/reporte_vendedor` &&
               req.params.get('fecha_inicio') === fecha_inicio &&
               req.params.get('fecha_fin') === fecha_fin &&
               req.params.get('seller_id') === idVendedor
      );

      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
});

/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { ConsultaProductoBodegaService } from './consulta-producto-bodega.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BodegasResponse } from '../../bodegas/bodegas.model';
import { environment } from '../../../../environments/environment'

describe('Service: ConsultaProductoBodega', () => {
  let service: ConsultaProductoBodegaService;
  let httpMock: HttpTestingController;
  let apiUrlStock = environment.apiUrlStock
  let apiUrlWarehouses = apiUrlStock + '/stock/get_warehouses';

  const mockWarehouse1 = {
    name: "Bodega Norte",
    id: "0f0cce29-af3c-4169-9ff6-0041e41b9b7f"
  };

  const mockWarehouse2 = {
    name: "Bodega Sur",
    id: "46b8f660-2006-45de-ad57-1764607876ac"
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConsultaProductoBodegaService]
    });

    service = TestBed.inject(ConsultaProductoBodegaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

/*
  afterEach(() => {
    httpMock.verify();
  });
*/

  describe('getListaBodegas', () => {
    it('should return a list of providers', () => {
      const mockResponse: BodegasResponse = {
        Warehouses: [
          { id: '46b8f660-2006-45de-ad57-1764607876ac', name: 'Jane Doe' },
          { id: '8c90da50-70b6-409f-9bd4-3afaea5baa81', name: 'John Doe' },
          { id: '0f0cce29-af3c-4169-9ff6-0041e41b9b7f', name: 'Doe Doe' }
        ]
      };

      service.getListaBodegas().subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.Warehouses.length).toBe(3);
        expect(response.Warehouses[0].name).toBe('Jane Doe');
      });

      const req = httpMock.expectOne(apiUrlWarehouses);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle empty options array', () => {
      const mockResponse: BodegasResponse = { Warehouses: [] };
    
      service.getListaBodegas().subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.Warehouses.length).toBe(0);
      });
    
      const req = httpMock.expectOne(apiUrlWarehouses);
      req.flush(mockResponse);
    });

    it('should handle HTTP error', () => {
      const errorMessage = '404 Not Found';
    
      service.getListaBodegas().subscribe({
        next: () => fail('expected to fail'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        }
      });
    
      const req = httpMock.expectOne(apiUrlWarehouses);
      req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    });

  });

  describe('getData', () => {
    it('should create request with only required fields', () => {
      const formData = {
        fieldProducto: 'Producto1',
        fieldBodega: mockWarehouse2.id
      };

      service.getData(formData).subscribe();

      const req = httpMock.expectOne(
        apiUrlStock + `/stock/product_location?product=Producto1&warehouse_id=46b8f660-2006-45de-ad57-1764607876ac`
      );
      expect(req.request.method).toBe('GET');
      req.flush({});
    });
    
  });
});

/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { ConsultaInventarioService } from './consulta-inventario.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FabricantesResponse,ApiResponse, InventoryItem, CategoriaProductos } from '../inventario.model';
import { environment } from '../../../../environments/environment'

describe('Service: ConsultaInventario', () => {
  let service: ConsultaInventarioService;
  let httpMock: HttpTestingController;
  let apiUrlProviders = environment.apiUrlProviders + `/providers`;

  const mockPlant1 = {
    name: "Production Line 1",
    id: "0f0cce29-af3c-4169-9ff6-0041e41b9b7f"
  };

  const mockPlant2 = {
    name: "Production Line 2",
    id: "46b8f660-2006-45de-ad57-1764607876ac"
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConsultaInventarioService]
    });

    service = TestBed.inject(ConsultaInventarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  describe('getData', () => {

    it('should create request with only required fields', () => {
      const formData = {
        fieldProducto: 'production',
      };

      service.getData(formData).subscribe();

      const req = httpMock.expectOne(
        environment.apiUrlStock + `/stock/query?product=production`
      );
      expect(req.request.method).toBe('GET');
      req.flush({});
    });

    it('should combine plant ID and status enum', () => {
      const formData = {
        fieldProducto: 'universal',
        fieldFabricante: mockPlant1.id,
        fieldCategoria: CategoriaProductos.LIMPIEZA
      };

      service.getData(formData).subscribe();

      const expectedUrl = environment.apiUrlStock + `/stock/query?product=universal` +
                         `&provider=${mockPlant1.id}` +
                         `&category=${CategoriaProductos.LIMPIEZA}`;
      
      const req = httpMock.expectOne(expectedUrl);

      expect(req.request.method).toBe('GET');
      expect(req.request.urlWithParams).toBe(expectedUrl);
      expect(req.request.headers.get('Content-Type')).toBe('application/json');

      req.flush({});
    });

  });

  describe('getListaFabricante', () => {
    it('should return a list of providers', () => {
      const mockResponse: FabricantesResponse = {
        providers: [
          { id: '46b8f660-2006-45de-ad57-1764607876ac', name: 'Jane Doe' },
          { id: '8c90da50-70b6-409f-9bd4-3afaea5baa81', name: 'John Doe' },
          { id: '0f0cce29-af3c-4169-9ff6-0041e41b9b7f', name: 'Doe Doe' }
        ]
      };
    
      service.getListaFabricantes().subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.providers.length).toBe(3);
        expect(response.providers[0].name).toBe('Jane Doe');
      });
    
      const req = httpMock.expectOne(apiUrlProviders);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle empty options array', () => {
      const mockResponse: FabricantesResponse = { providers: [] };
    
      service.getListaFabricantes().subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.providers.length).toBe(0);
      });
    
      const req = httpMock.expectOne(apiUrlProviders);
      req.flush(mockResponse);
    });

    it('should handle HTTP error', () => {
      const errorMessage = '404 Not Found';
    
      service.getListaFabricantes().subscribe({
        next: () => fail('expected to fail'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        }
      });
    
      const req = httpMock.expectOne(apiUrlProviders);
      req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    });

  });
});

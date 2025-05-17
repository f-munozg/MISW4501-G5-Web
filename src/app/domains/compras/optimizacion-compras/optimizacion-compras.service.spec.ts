import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OptimizacionComprasService } from './optimizacion-compras.service';
import { environment } from '../../../../environments/environment';
import { OptimizacionComprasResponse } from '../compras.model';
import { FabricantesResponse } from '../../fabricantes/fabricantes.model';
import { ProductosResponse } from '../../productos/producto.model';

describe('Service: OptimizacionCompras', () => {
  let service: OptimizacionComprasService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OptimizacionComprasService]
    });
    service = TestBed.inject(OptimizacionComprasService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('getListaFabricantes', () => {
    it('should make a GET request to the providers endpoint', () => {
      const mockResponse: FabricantesResponse = { 
        providers: 
        [
          {
          id: '1',
          name: 'Test Provider',
          }
        ]
      };

      service.getListaFabricantes().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(environment.apiUrlProviders + '/providers');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle errors when getting fabricantes', () => {
      service.getListaFabricantes().subscribe(
        () => fail('should have failed with 404 error'),
        (error) => {
          expect(error.status).toBe(404);
        }
      );

      const req = httpMock.expectOne(environment.apiUrlProviders + '/providers');
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getListaProductosStock', () => {
    it('should return a list of products', () => {
      const mockResponse: ProductosResponse = {
        products: [
          { 
            id: 'a80bed0a-d948-41f3-94bf-9fed902beb31', 
            sku: 'SKU001', 
            name: 'Product 1', 
            unit_value: 10, 
            storage_conditions: 'Dry', 
            product_features: 'Feature 1', 
            provider_id: '2e23886e-2723-4c4c-9256-d4f63591dc25', 
            estimated_delivery_time: '2025-05-16', 
            photo: 'photo1.jpg', 
            description: 'Desc 1', 
            category: 'Alimentación' 
          },
          { 
            id: '0f3ce17e-367e-44dc-b0e8-237a0776d486', 
            sku: 'SKU002', 
            name: 'Product 2', 
            unit_value: 20, 
            storage_conditions: 'Cold', 
            product_features: 'Feature 2', 
            provider_id: '2e23886e-2723-4c4c-9256-d4f63591dc25', 
            estimated_delivery_time: '2025-05-16', 
            photo: 'photo2.jpg', 
            description: 'Desc 2', 
            category: 'Alimentación' 
          }
        ]
      };

      service.getListaProductosStock().subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.products.length).toBe(2);
        expect(response.products[0].name).toBe('Product 1');
        expect(response.products[1].sku).toBe('SKU002');
      });

      const req = httpMock.expectOne(`${environment.apiUrlProducts}/products`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle empty products array', () => {
      const mockResponse: ProductosResponse = { products: [] };
    
      service.getListaProductosStock().subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.products.length).toBe(0);
      });
    
      const req = httpMock.expectOne(`${environment.apiUrlProducts}/products`);
      req.flush(mockResponse);
    });
  });

  describe('getComprasSugeridas', () => {
    it('should make a GET request with product_id parameter when provided', () => {
      const mockResponse: OptimizacionComprasResponse = {
        suggested_purchases: [
          { product_name: 'Product 1', suggested_qtty: 10, motive: 'Low stock' }
        ]
      };
      const productId = '123';

      service.getComprasSugeridas(productId, '').subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${environment.apiUrlStock}/stock/optimize_purchases?product_id=${productId}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should make a GET request with provider_id parameter when provided', () => {
      const mockResponse: OptimizacionComprasResponse = {
        suggested_purchases: [
          { product_name: 'Product 1', suggested_qtty: 10, motive: 'Low stock' }
        ]
      };
      const providerId = '456';

      service.getComprasSugeridas('', providerId).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${environment.apiUrlStock}/stock/optimize_purchases?provider_id=${providerId}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should make a GET request with both parameters when provided', () => {
      const mockResponse: OptimizacionComprasResponse = {
        suggested_purchases: [
          { product_name: 'Product 1', suggested_qtty: 10, motive: 'Low stock' },
          { product_name: 'Product 2', suggested_qtty: 5, motive: 'Promotion' }
        ]
      };
      const productId = '123';
      const providerId = '456';

      service.getComprasSugeridas(productId, providerId).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${environment.apiUrlStock}/stock/optimize_purchases?product_id=${productId}&provider_id=${providerId}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should include Content-Type header in the request', () => {
      service.getComprasSugeridas('123', '456').subscribe();

      const req = httpMock.expectOne(
        `${environment.apiUrlStock}/stock/optimize_purchases?product_id=123&provider_id=456`
      );
      expect(req.request.headers.has('Content-Type')).toBeTruthy();
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush({});
    });

    it('should handle empty response', () => {
      service.getComprasSugeridas('', '').subscribe(response => {
        expect(response).toEqual({ suggested_purchases: [] });
      });

      const req = httpMock.expectOne(
        `${environment.apiUrlStock}/stock/optimize_purchases?`
      );
      req.flush({ suggested_purchases: [] });
    });
  });
});
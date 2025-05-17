/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { GestionAlertasInventarioCriticoService } from './gestion-alertas-inventario-critico.service';
import { environment } from '../../../../environments/environment'
import { BodegasResponse } from '../../bodegas/bodegas.model';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductosResponse } from '../../productos/producto.model';
import { CriticalStockResponse } from '../inventario.model';
import { TableRow } from './gestion-alertas-inventario-critico.component';

describe('Service: GestionAlertasInventarioCritico', () => {
  let service: GestionAlertasInventarioCriticoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GestionAlertasInventarioCriticoService]
    });

    service = TestBed.inject(GestionAlertasInventarioCriticoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

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

      const req = httpMock.expectOne(`${environment.apiUrlStock}/stock/get_warehouses`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle empty options array', () => {
      const mockResponse: BodegasResponse = { Warehouses: [] };
    
      service.getListaBodegas().subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.Warehouses.length).toBe(0);
      });
    
      const req = httpMock.expectOne(`${environment.apiUrlStock}/stock/get_warehouses`);
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
    
      const req = httpMock.expectOne(`${environment.apiUrlStock}/stock/get_warehouses`);
      req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
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

    it('should handle HTTP error', () => {
      const errorMessage = '500 Internal Server Error';
    
      service.getListaProductosStock().subscribe({
        next: () => fail('expected to fail'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        }
      });
    
      const req = httpMock.expectOne(`${environment.apiUrlProducts}/products`);
      req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getProductosNivelCritico', () => {
    it('should return critical stock products', () => {
      const mockResponse: CriticalStockResponse<TableRow> = {
        critical_products: [
          { 
            product_id: 'a80bed0a-d948-41f3-94bf-9fed902beb31', 
            product_name: 'Product 1', 
            warehouse: 'Warehouse A', 
            current_quantity: 5, 
            threshold: 10, 
            alert_message: 'Critical stock', 
            suggested_action: 'Reordenar' 
          },
          { 
            product_id: '0f3ce17e-367e-44dc-b0e8-237a0776d486', 
            product_name: 'Product 2', 
            warehouse: 'Warehouse B', 
            current_quantity: 2, 
            threshold: 5, 
            alert_message: 'Critical stock', 
            suggested_action: 'Transferir' 
          }
        ],
        message: 'Critical products retrieved successfully'
      };

      service.getProductosNivelCritico().subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.critical_products?.length).toBe(2);
        expect(response.critical_products?.[0].product_name).toBe('Product 1');
        expect(response.critical_products?.[1].alert_message).toBe('Critical stock');
        expect(response.message).toBe('Critical products retrieved successfully');
      });

      const req = httpMock.expectOne(`${environment.apiUrlStock}/stock/critical`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should handle empty critical products array', () => {
      const mockResponse: CriticalStockResponse<TableRow> = { 
        critical_products: [],
        message: 'No critical products found'
      };
    
      service.getProductosNivelCritico().subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.critical_products?.length).toBe(0);
        expect(response.message).toBe('No critical products found');
      });
    
      const req = httpMock.expectOne(`${environment.apiUrlStock}/stock/critical`);
      req.flush(mockResponse);
    });

    it('should handle HTTP error', () => {
      const errorMessage = '401 Unauthorized';
    
      service.getProductosNivelCritico().subscribe({
        next: () => fail('expected to fail'),
        error: (error) => {
          expect(error.status).toBe(401);
          expect(error.statusText).toBe('Unauthorized');
        }
      });
    
      const req = httpMock.expectOne(`${environment.apiUrlStock}/stock/critical`);
      req.flush(errorMessage, { status: 401, statusText: 'Unauthorized' });
    });
  });
});

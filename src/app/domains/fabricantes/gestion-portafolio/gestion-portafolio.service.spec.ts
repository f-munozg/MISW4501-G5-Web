/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { GestionPortafolioService } from './gestion-portafolio.service';
import { Producto } from '../../productos/producto.model';

describe('Service: GestionPortafolio', () => {
  let service: GestionPortafolioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [GestionPortafolioService]
    });

    service = TestBed.inject(GestionPortafolioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();

  });

  describe('eliminarProducto', () => {
    it('should make a DELETE request to the correct endpoint', () => {
      const mockProductId = 'prod123';
      const mockDeletedProduct: Producto = {
        id: 'prod123',
        sku: 'SKU-001',
        name: 'Test Product',
        unit_value: 100,
        storage_conditions: 'Room temperature',
        product_features: 'Test features',
        provider_id: 'prov456',
        estimated_delivery_time: '2 days',
        photo: 'product.jpg',
        description: 'Test description',
        category: 'Test category'
      };

      service.eliminarProducto(mockProductId).subscribe((deletedProduct) => {
        expect(deletedProduct).toEqual(mockDeletedProduct);
        expect(deletedProduct.id).toBe(mockProductId);
      });

      const req = httpMock.expectOne(
        `${environment.apiUrlProducts}/products/${mockProductId}`
      );
      
      expect(req.request.method).toBe('DELETE');
      req.flush(mockDeletedProduct);

    });

    it('should include the product ID in the URL', () => {
      const mockProductId = '456';
      
      service.eliminarProducto(mockProductId).subscribe();

      const req = httpMock.expectOne(
        req => req.url === `${environment.apiUrlProducts}/products/${mockProductId}`
      );
      expect(req).toBeTruthy();
      req.flush({});
    });
  })
});

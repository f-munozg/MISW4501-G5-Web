/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { RegistroMovimientoInventarioService } from './registro-movimiento-inventario.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';

describe('Service: RegistroMovimientoInventario', () => {
  let service: RegistroMovimientoInventarioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RegistroMovimientoInventarioService]
    });

    service = TestBed.inject(RegistroMovimientoInventarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should post basic data without optional fields', () => {
    const mockFormData = {
      idProducto: '1cfda3dd-d72e-4619-a5e1-af84bff0a044',
      fieldBodega: '40184401-cb1e-48a5-8438-a6c58e416e9a',
      fieldCantidad: 10,
      fieldTipoMovimiento: 'Ingreso',
      threshold_stock: null,
      critical_level: null,
      location: null,
      expiration_date: null
    };

    service.postData(mockFormData).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.apiUrlStock}/stock/movement`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      product_id: '1cfda3dd-d72e-4619-a5e1-af84bff0a044',
      warehouse_id: '40184401-cb1e-48a5-8438-a6c58e416e9a',
      quantity: 10,
      user: '3fa97477-cdf8-462d-970c-f7b49b25df3a',
      movement_type: 'Ingreso'
    });

    req.flush({});
  });

  it('should post data with all optional fields', () => {
    const mockFormData = {
      idProducto: '1cfda3dd-d72e-4619-a5e1-af84bff0a044',
      fieldBodega: '40184401-cb1e-48a5-8438-a6c58e416e9a',
      fieldCantidad: 10,
      fieldTipoMovimiento: 'Ingreso',
      fieldLimiteStock: 5,
      fieldNivelCritico: 2,
      fieldUbicacion: 'Estante 1',
      expiration_date: '2025-12-31',
      threshold_stock: true,
      critical_level: true,
      location: true
    };

    service.postData(mockFormData).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.apiUrlStock}/stock/movement`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      product_id: '1cfda3dd-d72e-4619-a5e1-af84bff0a044',
      warehouse_id: '40184401-cb1e-48a5-8438-a6c58e416e9a',
      quantity: 10,
      user: '3fa97477-cdf8-462d-970c-f7b49b25df3a',
      movement_type: 'Ingreso',
      threshold_stock: 5,
      critical_level: 2,
      location: 'Estante 1',
      expiration_date: '2025-12-31'
    });

    req.flush({});
  });

  it('should post data with some optional fields', () => {
    const mockFormData = {
      idProducto: '1cfda3dd-d72e-4619-a5e1-af84bff0a044',
      fieldBodega: '40184401-cb1e-48a5-8438-a6c58e416e9a',
      fieldCantidad: 10,
      fieldTipoMovimiento: 'Ingreso',
      fieldLimiteStock: 5,
      fieldNivelCritico: null,
      fieldUbicacion: 'Estante 1',
      expiration_date: null,
      threshold_stock: true,
      critical_level: null,
      location: true
    };

    service.postData(mockFormData).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.apiUrlStock}/stock/movement`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      product_id: '1cfda3dd-d72e-4619-a5e1-af84bff0a044',
      warehouse_id: '40184401-cb1e-48a5-8438-a6c58e416e9a',
      quantity: 10,
      user: '3fa97477-cdf8-462d-970c-f7b49b25df3a',
      movement_type: 'Ingreso',
      threshold_stock: 5,
      location: 'Estante 1'
    });

    req.flush({});
  });
});
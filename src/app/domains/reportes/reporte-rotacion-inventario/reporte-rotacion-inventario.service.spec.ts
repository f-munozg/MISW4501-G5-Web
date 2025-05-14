/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { environment } from '../../../../environments/environment';
import { ReporteRotacionInventarioService } from './reporte-rotacion-inventario.service';
import { TipoMovimiento } from '../../inventarios/inventario.model';

describe('Service: ReporteRotacionInventario', () => {
  let service: ReporteRotacionInventarioService;
  let httpMock: HttpTestingController;

  const mockRotacionProductoResponse = {
      "product_id": "27644658-6c5c-4643-8121-c30bed696f68",
      "sku": "SKU-123",
      "name": "Chocolisto",
      "rotacion": {
          "porcentaje": 700,
          "texto": "700%",
          "nivel": "Alta"
      },
      "stock_inicial": 50,
      "stock_final": 7,
      "movimientos": [
          {
              "timestamp": "2025-04-18 15:34",
              "nombre_producto": "Chocolisto",
              "cantidad_ingreso": 50,
              "cantidad_salida": 0,
              "tipo_movimiento": TipoMovimiento.INGRESO,
              "stock_acumulado": 50
          },
          {
              "timestamp": "2025-04-18 15:36",
              "nombre_producto": "Chocolisto",
              "cantidad_ingreso": 0,
              "cantidad_salida": 5,
              "tipo_movimiento": TipoMovimiento.SALIDA,
              "stock_acumulado": 45
          },
          {
              "timestamp": "2025-05-04 00:41",
              "nombre_producto": "Chocolisto",
              "cantidad_ingreso": 0,
              "cantidad_salida": 38,
              "tipo_movimiento": TipoMovimiento.SALIDA,
              "stock_acumulado": 7
          }
      ]
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule, HttpClientTestingModule],
      providers: [ReporteRotacionInventarioService]
    });

    service = TestBed.inject(ReporteRotacionInventarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should ...', inject([ReporteRotacionInventarioService], (service: ReporteRotacionInventarioService) => {
    expect(service).toBeTruthy();
  }));

  describe('getRotacionProducto', () => {
    it('calls the API endpoint with appropriate data and receive mockRotacionProductoResponse as result', () => {
      // 1. Inicialización de datos de prueba
      const product_id = "27644658-6c5c-4643-8121-c30bed696f68";
      const start_date = "2025-04-01";
      const end_date = "2025-05-01";

      // 2. Ejecución de métodos/funciones
      service.getRotacionProducto(product_id, start_date, end_date).subscribe(response => {
        // 3. Validación
        expect(response).toEqual(mockRotacionProductoResponse);
      });

      const req = httpMock.expectOne(
        `${environment.apiUrlStock}/stock/product_rotation?product_id=${product_id}&start_date=${start_date}&end_date=${end_date}`
      );
      expect(req.request.method).toBe('GET');
      
      req.flush(mockRotacionProductoResponse);
    });

    it('calls the API endpoint but the product_id is missing', () => {
      // 1. Inicialización de datos de prueba
      const product_id = "";
      const start_date = "2025-04-01";
      const end_date = "2025-05-01";

      // 2. Ejecución de métodos/funciones
      service.getRotacionProducto(product_id, start_date, end_date).subscribe(
        () => fail('should have failed with 400 error'),
        (error: HttpErrorResponse) => {
          // 3. Validación
          expect(error.status).toBe(400);
          expect(error.error).toEqual({ message: 'product_id is required' });
        }
      );

      // Mock the HTTP request
      const req = httpMock.expectOne(
        `${environment.apiUrlStock}/stock/product_rotation?product_id=${product_id}&start_date=${start_date}&end_date=${end_date}`
      );
      expect(req.request.method).toBe('GET');
      
      // Provide mock error response
      req.flush({ message: 'product_id is required' }, { status: 400, statusText: 'Bad Request' });
    });

  });
});

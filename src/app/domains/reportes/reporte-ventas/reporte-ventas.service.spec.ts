/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { ReporteVentasService } from './reporte-ventas.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

describe('Service: ReporteVentas', () => {
  let service: ReporteVentasService;
  let httpMock: HttpTestingController;

  const mockReporteVentasResponse = [
    { 
      "producto": "Chocolisto", 
      "vendedor": "Test User 1", 
      "unidades_vendidas": 6.0, 
      "ingresos": 90000.0, 
      "primera_venta": "2025-05-10", 
      "ultima_venta": "2025-05-10"
    }, 
    {
      "producto": "Arroz", 
      "vendedor": "Test User 1", 
      "unidades_vendidas": 4.0, 
      "ingresos": 48000.0, 
      "primera_venta": "2025-05-11", 
      "ultima_venta": "2025-05-11"
    }
  ]
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule, HttpClientTestingModule ],
      providers: [ReporteVentasService]
    });

    service = TestBed.inject(ReporteVentasService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should ...', inject([ReporteVentasService], (service: ReporteVentasService) => {
    expect(service).toBeTruthy();
  }));

  describe('getReporteVentas', () => {
    it('sends full request and the backend response is equal to the mock response', () => {
      // 1. Inicialización de datos de prueba
      const producto = "27644658-6c5c-4643-8121-c30bed696f68";
      const vendedor = "78a66222-8a32-450e-8b85-2ffefcd23f4b";
      const fecha_inicio = "2025-04-01";
      const fecha_fin = "2025-05-30";

      // 2. Ejecución de métodos/funciones
      service.getReporteVentas(fecha_inicio, fecha_fin, producto, vendedor).subscribe(response => {
        // 3. Validación
        expect(response).toEqual(mockReporteVentasResponse);
      });

      const req = httpMock.expectOne(
        `${environment.apiUrlReports}/reports/reporte_ventas?fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}&producto=${producto}&vendedor=${vendedor}`
      );
      expect(req.request.method).toBe('GET');

      req.flush(mockReporteVentasResponse);
    });

    it('sends incomplete data with the request so there is an error response', () => {
      const producto = "27644658-6c5c-4643-8121-c30bed696f68";
      const fecha_inicio = "";
      const fecha_fin = "2025-05-30";

      service.getReporteVentas(fecha_inicio, fecha_fin, producto, null).subscribe({
        next: () => fail('Should have failed with 400 error'),
        error: (err) => {
          expect(err.error).toEqual({ error: "fecha_inicio y fecha_fin son requeridos" });
        }
      });

    });
  });
});

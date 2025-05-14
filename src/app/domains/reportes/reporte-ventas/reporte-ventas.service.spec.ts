/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { ReporteVentasService } from './reporte-ventas.service';

describe('Service: ReporteVentas', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReporteVentasService]
    });
  });

  it('should ...', inject([ReporteVentasService], (service: ReporteVentasService) => {
    expect(service).toBeTruthy();
  }));
});

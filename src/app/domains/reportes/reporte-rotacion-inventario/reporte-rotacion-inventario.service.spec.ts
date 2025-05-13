/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { ReporteRotacionInventarioService } from './reporte-rotacion-inventario.service';

describe('Service: ReporteRotacionInventario', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReporteRotacionInventarioService]
    });
  });

  it('should ...', inject([ReporteRotacionInventarioService], (service: ReporteRotacionInventarioService) => {
    expect(service).toBeTruthy();
  }));
});

/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { ReporteVendedorService } from './reporte-vendedor.service';

describe('Service: ReporteVendedor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReporteVendedorService]
    });
  });

  it('should ...', inject([ReporteVendedorService], (service: ReporteVendedorService) => {
    expect(service).toBeTruthy();
  }));
});

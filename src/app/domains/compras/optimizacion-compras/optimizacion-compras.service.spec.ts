/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { OptimizacionComprasService } from './optimizacion-compras.service';

describe('Service: OptimizacionCompras', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OptimizacionComprasService]
    });
  });

  it('should ...', inject([OptimizacionComprasService], (service: OptimizacionComprasService) => {
    expect(service).toBeTruthy();
  }));
});

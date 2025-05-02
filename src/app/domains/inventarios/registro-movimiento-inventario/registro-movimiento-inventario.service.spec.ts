/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { RegistroMovimientoInventarioService } from './registro-movimiento-inventario.service';

describe('Service: RegistroMovimientoInventario', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RegistroMovimientoInventarioService]
    });
  });

  it('should ...', inject([RegistroMovimientoInventarioService], (service: RegistroMovimientoInventarioService) => {
    expect(service).toBeTruthy();
  }));
});

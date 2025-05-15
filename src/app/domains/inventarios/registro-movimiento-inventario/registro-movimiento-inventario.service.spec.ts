/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { RegistroMovimientoInventarioService } from './registro-movimiento-inventario.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Service: RegistroMovimientoInventario', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RegistroMovimientoInventarioService]
    });
  });

  it('should ...', inject([RegistroMovimientoInventarioService], (service: RegistroMovimientoInventarioService) => {
    expect(service).toBeTruthy();
  }));
});

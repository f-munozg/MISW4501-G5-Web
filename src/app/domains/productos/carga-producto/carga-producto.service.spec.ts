/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { CargaProductoService } from './carga-producto.service';

describe('Service: CargaProducto', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CargaProductoService]
    });
  });

  it('should ...', inject([CargaProductoService], (service: CargaProductoService) => {
    expect(service).toBeTruthy();
  }));
});

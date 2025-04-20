/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { CargaMasivaProductosService } from './carga-masiva-productos.service';

describe('Service: CargaMasivaProductos', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CargaMasivaProductosService]
    });
  });

  it('should ...', inject([CargaMasivaProductosService], (service: CargaMasivaProductosService) => {
    expect(service).toBeTruthy();
  }));
});

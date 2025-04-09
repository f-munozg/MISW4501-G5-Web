/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { ConsultaInventarioService } from './consulta-inventario.service';

describe('Service: ConsultaInventario', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConsultaInventarioService]
    });
  });

  it('should ...', inject([ConsultaInventarioService], (service: ConsultaInventarioService) => {
    expect(service).toBeTruthy();
  }));
});

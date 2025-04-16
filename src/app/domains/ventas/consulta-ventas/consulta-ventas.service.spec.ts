/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { ConsultaVentasService } from './consulta-ventas.service';

describe('Service: ConsultaVentas', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConsultaVentasService]
    });
  });

  it('should ...', inject([ConsultaVentasService], (service: ConsultaVentasService) => {
    expect(service).toBeTruthy();
  }));
});

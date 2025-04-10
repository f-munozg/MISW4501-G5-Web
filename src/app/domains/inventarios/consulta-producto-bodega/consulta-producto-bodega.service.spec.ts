/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { ConsultaProductoBodegaService } from './consulta-producto-bodega.service';

describe('Service: ConsultaProductoBodega', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConsultaProductoBodegaService]
    });
  });

  it('should ...', inject([ConsultaProductoBodegaService], (service: ConsultaProductoBodegaService) => {
    expect(service).toBeTruthy();
  }));
});

/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { ConsultaProductoBodegaService } from './consulta-producto-bodega.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('Service: ConsultaProductoBodega', () => {
  let service: ConsultaProductoBodegaService;
  let httpMock: HttpTestingController;
  let apiUrlWarehouses = '';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConsultaProductoBodegaService]
    });

    service = TestBed.inject(ConsultaProductoBodegaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should ...', () => {
    expect(service).toBeTruthy();
  });
});

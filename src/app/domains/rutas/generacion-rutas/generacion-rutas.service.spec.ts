/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { GeneracionRutasService } from './generacion-rutas.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('Service: GeneracionRutas', () => {
  let service: GeneracionRutasService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GeneracionRutasService]
    });
    service = TestBed.inject(GeneracionRutasService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should ...', inject([GeneracionRutasService], (service: GeneracionRutasService) => {
    expect(service).toBeTruthy();
  }));
});

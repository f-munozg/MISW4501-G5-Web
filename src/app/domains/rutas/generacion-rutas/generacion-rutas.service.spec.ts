/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { GeneracionRutasService } from './generacion-rutas.service';

describe('Service: GeneracionRutas', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GeneracionRutasService]
    });
  });

  it('should ...', inject([GeneracionRutasService], (service: GeneracionRutasService) => {
    expect(service).toBeTruthy();
  }));
});

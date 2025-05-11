/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { ReglasComercialesService } from './reglas-comerciales.service';

describe('Service: ReglasComerciales', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReglasComercialesService]
    });
  });

  it('should ...', inject([ReglasComercialesService], (service: ReglasComercialesService) => {
    expect(service).toBeTruthy();
  }));
});

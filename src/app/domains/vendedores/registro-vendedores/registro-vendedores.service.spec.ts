/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { RegistroVendedoresService } from './registro-vendedores.service';

describe('Service: RegistroVendedores', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RegistroVendedoresService]
    });
  });

  it('should ...', inject([RegistroVendedoresService], (service: RegistroVendedoresService) => {
    expect(service).toBeTruthy();
  }));
});

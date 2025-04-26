/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { PlanesDeVentaService } from './planes-de-venta.service';

describe('Service: PlanesDeVenta', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlanesDeVentaService]
    });
  });

  it('should ...', inject([PlanesDeVentaService], (service: PlanesDeVentaService) => {
    expect(service).toBeTruthy();
  }));
});

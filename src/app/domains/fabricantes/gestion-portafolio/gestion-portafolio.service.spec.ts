/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { GestionPortafolioService } from './gestion-portafolio.service';

describe('Service: GestionPortafolio', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GestionPortafolioService]
    });
  });

  it('should ...', inject([GestionPortafolioService], (service: GestionPortafolioService) => {
    expect(service).toBeTruthy();
  }));
});

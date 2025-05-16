/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { GestionAlertasInventarioCriticoService } from './gestion-alertas-inventario-critico.service';

describe('Service: GestionAlertasInventarioCritico', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GestionAlertasInventarioCriticoService]
    });
  });

  it('should ...', inject([GestionAlertasInventarioCriticoService], (service: GestionAlertasInventarioCriticoService) => {
    expect(service).toBeTruthy();
  }));
});

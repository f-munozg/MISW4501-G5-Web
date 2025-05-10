/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { ReglasTributariasService } from './reglas-tributarias.service';

describe('Service: ReglasTributarias', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReglasTributariasService]
    });
  });

  it('should ...', inject([ReglasTributariasService], (service: ReglasTributariasService) => {
    expect(service).toBeTruthy();
  }));
});

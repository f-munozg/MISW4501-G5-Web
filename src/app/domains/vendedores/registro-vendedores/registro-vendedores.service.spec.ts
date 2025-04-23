/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment'

import { RegistroVendedoresService } from './registro-vendedores.service';
import { Observable } from 'rxjs';

describe('Service: RegistroVendedores', () => {
    let service: RegistroVendedoresService;
    let httpMock: HttpTestingController;
    
    const apiUrl = environment.apiUrlSellers + `/sellers/add`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [RegistroVendedoresService]
    });

    service = TestBed.inject(RegistroVendedoresService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('postData', () => {
    it('should send a successful request if all field values are valid', () => {
      const mockFormData = {
        fieldNumeroIdentificacion: '1529463860',
        fieldNombre: 'Mateo D.',
        fieldCorreoElectronico: 'mateo@test.com',
        fieldDireccion: 'Calle 85 15, Bogotá',
        fieldTelefono: '5063490',
        fieldZona: 'NORTE'
      }

      const expectedResponse = {message: 'Seller created successfully'}

      service.postData(mockFormData).subscribe(response => {
        expect(response).toEqual(expectedResponse);
      });
      
      const req = httpMock.expectOne(apiUrl);
      req.flush(expectedResponse)
    });

    it('should receive an invalid response if there is a missing value in the payload', () => {
      const mockFormData = {
        fieldNumeroIdentificacion: '1529463860',
        fieldCorreoElectronico: 'mateo@test.com',
        fieldDireccion: 'Calle 85 15, Bogotá',
        fieldTelefono: '5063490',
        fieldZona: 'NORTE'
      }

      const expectedResponse = {message: 'Missing required fields: name'}

      service.postData(mockFormData).subscribe({
        next: () => fail('Should have failed with 400 error'),
        error: (err) => {
          expect(err.status).toBe(400);
          expect(err.error).toEqual(expectedResponse);
        }
      });
      
      const req = httpMock.expectOne(apiUrl);
      req.flush(expectedResponse, {status: 400, statusText: 'Bad Request'});
    });

    it('should receive an invalid response if the zone value is missing', () => {
      const mockFormData = {
        fieldNumeroIdentificacion: '1529463860',
        fieldCorreoElectronico: 'mateo@test.com',
        fieldDireccion: 'Calle 85 15, Bogotá',
        fieldTelefono: '5063490',
      }

      const expectedResponse = {message: "Missing required field: zone"}

      service.postData(mockFormData).subscribe({
        next: () => fail('Should have failed with 400 error'),
        error: (err) => {
          expect(err.status).toBe(400);
          expect(err.error).toEqual(expectedResponse);
        }
      });
      
      const req = httpMock.expectOne(apiUrl);
      req.flush(expectedResponse, {status: 400, statusText: 'Bad Request'});
    });

    it('should hanlde server errors', () => {
      const mockFormData = {
        fieldNumeroIdentificacion: '1529463860',
        fieldNombre: 'Mateo D.',
        fieldCorreoElectronico: 'mateo@test.com',
        fieldDireccion: 'Calle 85 15, Bogotá',
        fieldTelefono: '5063490',
        fieldZona: 'NORTE'
      };

      service.postData(mockFormData).subscribe({
        next: () => fail('Should have failed with 500 error'),
        error: (err) => {
          expect(err.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush('Server Error', { 
        status: 500, 
        statusText: 'Internal Server Error' 
      });
    });

  })
});

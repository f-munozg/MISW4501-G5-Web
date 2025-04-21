import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment'

import { CargaMasivaProductosService } from './carga-masiva-productos.service';

describe('CargaMasivaProductosService', () => {
  let service: CargaMasivaProductosService;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  
  const apiUrl = environment.apiUrlProducts + `/products/upload`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [
        CargaMasivaProductosService
      ]
    });

    service = TestBed.inject(CargaMasivaProductosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();

    
  });


  describe('postData', () => {
    it('should upload file', fakeAsync(() => {
      const testFile = [
        new File([''], 'products.csv'),
      ];

      testFile.forEach(file => {
        const mockFormData = {
          fieldFabricante: '123',
          productsFile: file
        };

        service.postData(mockFormData).subscribe();

        const req = httpMock.expectOne(apiUrl);
        expect(req.request.method).toBe('POST');
        req.flush({ success: true });
        tick();
      });
    }));

    it('should throw error when no file selected', fakeAsync(() => {
      const mockFormData = {
        fieldFabricante: '123',
        productsFile: null
      };

      let error: Error | undefined;
      service.postData(mockFormData).subscribe({
        error: (err) => error = err
      });
      tick();

      expect(error?.message).toBe('Archivo no ha sido seleccionado');
      httpMock.expectNone(apiUrl);
    }));

    it('should include provider_id and file in FormData', fakeAsync(() => {
      const mockFile = new File([''], 'products.csv');
      const mockFormData = {
        fieldFabricante: '456',
        productsFile: mockFile
      };

      service.postData(mockFormData).subscribe();
      
      const req = httpMock.expectOne(apiUrl);
      const formData = req.request.body as FormData;
      
      const providerId = formData.get('provider_id');
      const file = formData.get('file');
      
      expect(providerId).toBe('456');
      expect(file).toBeInstanceOf(File);
      if (file instanceof File) {
        expect(file.name).toBe('products.csv');
      }
      
      req.flush({});
      tick();
    }));

    it('should handle server errors', fakeAsync(() => {
      const mockFile = new File([''], 'products.csv');
      const mockFormData = {
        fieldFabricante: '789',
        productsFile: mockFile
      };

      let errorResponse: any;
      service.postData(mockFormData).subscribe({
        error: (error) => errorResponse = error
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush('Server Error', { 
        status: 500, 
        statusText: 'Internal Server Error' 
      });
      tick();

      expect(errorResponse.status).toBe(500);
    }));
  });

});
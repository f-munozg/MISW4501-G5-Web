/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { ReglasComercialesService } from './reglas-comerciales.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { Paises, TipoReglaComercial, ReglaComercial, ReglaComercialResponse } from '../reglas.model';

describe('Service: ReglasComerciales', () => {
  let service: ReglasComercialesService;
  let httpMock: HttpTestingController;

  // Datos iniciales de prueba
  const mockReglaComercial: ReglaComercial = {
    id: '1',
    pais: Paises.ARGENTINA,
    tipo_regla_comercial: TipoReglaComercial.DESCUENTO,
    descripcion: 'Descripción de Pruebna'
  };

  const mockReglaComercialResponse: ReglaComercialResponse = {
    rules: [mockReglaComercial]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [ReglasComercialesService]
    });

    service = TestBed.inject(ReglasComercialesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  })

  describe('postData', () => {
    it('should post data successfully', () => {
      // 1. Inicialización de datos de prueba
      const formData = {
        fieldPais: Paises.ARGENTINA,
        fieldTipoReglaComercial: TipoReglaComercial.DESCUENTO,
        fieldDescripcion: 'Regla de prueba'
      };
      const mockResponse = { success: true };

      // 2. Ejecución de métodos/funciones
      service.postData(formData).subscribe(response => {
        // 3. Validación
        expect(response).toEqual(mockResponse);
      });

      // 3. Validación
      const req = httpMock.expectOne(`${environment.apiUrlProviders}/rules/commercial/add`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        country: formData.fieldPais,
        type_commercial_rule: formData.fieldTipoReglaComercial,
        description: formData.fieldDescripcion
      });

      req.flush(mockResponse);
    });

    it('should handle 400 error when posting data', () => {
      const formData = {
        fieldPais: Paises.ARGENTINA,
        fieldTipoReglaComercial: TipoReglaComercial.DESCUENTO,
        fieldDescripcion: 'Regla de prueba'
      };
      const mockErrorResponse = { status: 400, statusText: 'Bad Request' };

      service.postData(formData).subscribe({
        next: () => fail('should have failed with 400 error'),
        error: (error) => {
          
          expect(error.status).toEqual(400);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrlProviders}/rules/commercial/add`);
      req.flush('Invalid request', mockErrorResponse);
    });

    it('should handle 500 error when posting data', () => {
      const formData = {
        fieldPais: Paises.ARGENTINA,
        fieldTipoReglaComercial: TipoReglaComercial.DESCUENTO,
        fieldDescripcion: 'Regla de prueba'
      };
      const mockErrorResponse = { status: 500, statusText: 'Server Error' };
      
      service.postData(formData).subscribe({
        next: () => fail('should have failed with 500 error'),
        error: (error) => {
          
          expect(error.status).toEqual(500);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrlProviders}/rules/commercial/add`);
      req.flush('Server error', mockErrorResponse);
    });
  });

  describe('updateReglaComercial', () => {
    it('should update commercial rule successfully', () => {
      const formData = {
        id: '1',
        fieldPais: Paises.ARGENTINA,
        fieldTipoReglaComercial: TipoReglaComercial.DESCUENTO,
        fieldDescripcion: 'Regla actualizada'
      };
      const mockResponse = { success: true };
   
      service.updateReglaComercial(formData).subscribe(response => {

        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrlProviders}/rules/commercial/update/${formData.id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({
        country: formData.fieldPais,
        type_commercial_rule: formData.fieldTipoReglaComercial,
        description: formData.fieldDescripcion
      });

      req.flush(mockResponse);
    });

    it('should handle 400 error when updating commercial rule', () => {
      const formData = {
        id: '1',
        fieldPais: Paises.ARGENTINA,
        fieldTipoReglaComercial: TipoReglaComercial.DESCUENTO,
        fieldDescripcion: 'Regla actualizada'
      };
      const mockErrorResponse = { status: 400, statusText: 'Bad Request' };

      service.updateReglaComercial(formData).subscribe({
        next: () => fail('should have failed with 400 error'),
        error: (error) => {
          
          expect(error.status).toEqual(400);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrlProviders}/rules/commercial/update/${formData.id}`);
      req.flush('Invalid request', mockErrorResponse);
    });

    it('should handle 404 error when updating commercial rule', () => {
      const formData = {
        id: '1',
        fieldPais: Paises.ARGENTINA,
        fieldTipoReglaComercial: TipoReglaComercial.DESCUENTO,
        fieldDescripcion: 'Regla actualizada'
      };
      const mockErrorResponse = { status: 404, statusText: 'Not Found' };
 
      service.updateReglaComercial(formData).subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          
          expect(error.status).toEqual(404);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrlProviders}/rules/commercial/update/${formData.id}`);
      req.flush('Not found', mockErrorResponse);
    });

    it('should handle 500 error when updating commercial rule', () => {
      const formData = {
        id: '1',
        fieldPais: Paises.ARGENTINA,
        fieldTipoReglaComercial: TipoReglaComercial.DESCUENTO,
        fieldDescripcion: 'Regla actualizada'
      };
      const mockErrorResponse = { status: 500, statusText: 'Server Error' };

      service.updateReglaComercial(formData).subscribe({
        next: () => fail('should have failed with 500 error'),
        error: (error) => {
          
          expect(error.status).toEqual(500);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrlProviders}/rules/commercial/update/${formData.id}`);
      req.flush('Server error', mockErrorResponse);
    });
  });

  describe('getListaReglasComerciales', () => {
    it('should get commercial rules successfully', () => {
      service.getListaReglasComerciales().subscribe(response => {
        expect(response).toEqual(mockReglaComercialResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrlProviders}/rules/commercial/get`);
      expect(req.request.method).toBe('GET');
      req.flush(mockReglaComercialResponse);
    });

    it('should handle error when getting commercial rules', () => {
      const mockErrorResponse = { status: 500, statusText: 'Server Error' };

      service.getListaReglasComerciales().subscribe({
        next: () => fail('should have failed with 500 error'),
        error: (error) => {
          expect(error.status).toEqual(500);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrlProviders}/rules/commercial/get`);
      req.flush('Server error', mockErrorResponse);
    });
  });

  describe('eliminarReglaComercial', () => {
    it('should delete commercial rule successfully', () => {
      const reglaId = '1';
      const mockResponse: ReglaComercial = {
        id: reglaId,
        pais: Paises.ARGENTINA,
        tipo_regla_comercial: TipoReglaComercial.DESCUENTO,
        descripcion: 'Regla de prueba'
      };
      
      service.eliminarReglaComercial(reglaId).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });
    
      const req = httpMock.expectOne(`${environment.apiUrlProviders}/rules/commercial/delete/${reglaId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });

    it('should handle 400 error when deleting commercial rule', () => {
      const reglaId = '1';
      const mockErrorResponse = { status: 400, statusText: 'Bad Request' };
      
      service.eliminarReglaComercial(reglaId).subscribe({
        next: () => fail('should have failed with 400 error'),
        error: (error) => {
          
          expect(error.status).toEqual(400);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrlProviders}/rules/commercial/delete/${reglaId}`);
      req.flush('Invalid request', mockErrorResponse);
    });

    it('should handle 500 error when deleting commercial rule', () => {
      const reglaId = '1';
      const mockErrorResponse = { status: 500, statusText: 'Server Error' };

      service.eliminarReglaComercial(reglaId).subscribe({
        next: () => fail('should have failed with 500 error'),
        error: (error) => {
          
          expect(error.status).toEqual(500);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrlProviders}/rules/commercial/delete/${reglaId}`);
      req.flush('Server error', mockErrorResponse);
    });
  });
});
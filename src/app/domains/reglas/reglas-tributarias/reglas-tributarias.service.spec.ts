/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { ReglasTributariasService } from './reglas-tributarias.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { ReglaTributaria, ReglaTributariaResponse, Paises, TipoImpuesto } from '../reglas.model';

describe('Service: ReglasTributarias', () => {
  let service: ReglasTributariasService;
  let httpMock: HttpTestingController;

  // Datos iniciales de prueba
  const mockReglaTributaria: ReglaTributaria = {
    id: '1',
    pais: Paises.ARGENTINA,
    tipo_impuesto: TipoImpuesto.RENTA_PERSONAS_FISICAS,
    valor: 25,
    descripcion: 'Test rule'
  };

  const mockReglaTributariaResponse: ReglaTributariaResponse = {
    rules: [mockReglaTributaria]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [ReglasTributariasService]
    });

    service = TestBed.inject(ReglasTributariasService);
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
        fieldTipoImpuesto: TipoImpuesto.RENTA_PERSONAS_FISICAS,
        fieldValor: 25,
        fieldDescripcion: 'Test rule'
      };
      const mockResponse = { success: true };

      // 2. Ejecución de métodos/funciones
      service.postData(formData).subscribe(response => {
        // 3. Validación
        expect(response).toEqual(mockResponse);
      });

      // 3. Validación
      const req = httpMock.expectOne(`${environment.apiUrlProviders}/rules/tax/add`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        country: formData.fieldPais,
        type_tax: formData.fieldTipoImpuesto,
        value_tax: formData.fieldValor,
        description: formData.fieldDescripcion
      });

      req.flush(mockResponse);
    });

    it('should handle 400 error when posting data', () => {
      const formData = {
        fieldPais: Paises.ARGENTINA,
        fieldTipoImpuesto: TipoImpuesto.RENTA_PERSONAS_FISICAS,
        fieldValor: 25,
        fieldDescripcion: 'Regla de prueba'
      };
      const mockErrorResponse = { status: 400, statusText: 'Bad Request' };

      service.postData(formData).subscribe({
        next: () => fail('should have failed with 400 error'),
        error: (error) => {
          
          expect(error.status).toEqual(400);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrlProviders}/rules/tax/add`);
      req.flush('Invalid request', mockErrorResponse);
    });

    it('should handle 500 error when posting data', () => {
      const formData = {
        fieldPais: Paises.ARGENTINA,
        fieldTipoImpuesto: TipoImpuesto.RENTA_PERSONAS_FISICAS,
        fieldValor: 25,
        fieldDescripcion: 'Regla de prueba'
      };
      const mockErrorResponse = { status: 500, statusText: 'Server Error' };
      
      service.postData(formData).subscribe({
        next: () => fail('should have failed with 500 error'),
        error: (error) => {
          
          expect(error.status).toEqual(500);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrlProviders}/rules/tax/add`);
      req.flush('Server error', mockErrorResponse);
    });
  });

  describe('updateTributo', () => {
    it('should update tax rule successfully', () => {
      const formData = {
        id: '1',
        fieldPais: Paises.ARGENTINA,
        fieldTipoImpuesto: TipoImpuesto.RENTA_PERSONAS_FISICAS,
        fieldValor: 30,
        fieldDescripcion: 'Regla actualizada'
      };
      const mockResponse = { success: true };
   
      service.updateTributo(formData).subscribe(response => {

        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrlProviders}/rules/tax/update/${formData.id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({
        country: formData.fieldPais,
        type_tax: formData.fieldTipoImpuesto,
        value_tax: formData.fieldValor,
        description: formData.fieldDescripcion
      });

      req.flush(mockResponse);
    });

    it('should handle 400 error when updating tax rule', () => {
      const formData = {
        id: '1',
        fieldPais: Paises.ARGENTINA,
        fieldTipoImpuesto: TipoImpuesto.RENTA_PERSONAS_FISICAS,
        fieldValor: 30,
        fieldDescripcion: 'Regla actualizada'
      };
      const mockErrorResponse = { status: 400, statusText: 'Bad Request' };

      service.updateTributo(formData).subscribe({
        next: () => fail('should have failed with 400 error'),
        error: (error) => {
          
          expect(error.status).toEqual(400);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrlProviders}/rules/tax/update/${formData.id}`);
      req.flush('Invalid request', mockErrorResponse);
    });

    it('should handle 404 error when updating tax rule', () => {
      const formData = {
        id: '1',
        fieldPais: Paises.ARGENTINA,
        fieldTipoImpuesto: TipoImpuesto.RENTA_PERSONAS_FISICAS,
        fieldValor: 30,
        fieldDescripcion: 'Regla actualizada'
      };
      const mockErrorResponse = { status: 404, statusText: 'Not Found' };
 
      service.updateTributo(formData).subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          
          expect(error.status).toEqual(404);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrlProviders}/rules/tax/update/${formData.id}`);
      req.flush('Not found', mockErrorResponse);
    });

    it('should handle 500 error when updating tax rule', () => {
      const formData = {
        id: '1',
        fieldPais: Paises.ARGENTINA,
        fieldTipoImpuesto: TipoImpuesto.RENTA_PERSONAS_FISICAS,
        fieldValor: 30,
        fieldDescripcion: 'Regla actualizada'
      };
      const mockErrorResponse = { status: 500, statusText: 'Server Error' };

      service.updateTributo(formData).subscribe({
        next: () => fail('should have failed with 500 error'),
        error: (error) => {
          
          expect(error.status).toEqual(500);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrlProviders}/rules/tax/update/${formData.id}`);
      req.flush('Server error', mockErrorResponse);
    });
  });

  describe('getListaTributos', () => {
    it('should get tax rules successfully', () => {
      service.getListaTributos().subscribe(response => {
        expect(response).toEqual(mockReglaTributariaResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrlProviders}/rules/tax/get`);
      expect(req.request.method).toBe('GET');
      req.flush(mockReglaTributariaResponse);
    });

    it('should handle error when getting tax rules', () => {
      const mockErrorResponse = { status: 500, statusText: 'Server Error' };

      service.getListaTributos().subscribe({
        next: () => fail('should have failed with 500 error'),
        error: (error) => {
          expect(error.status).toEqual(500);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrlProviders}/rules/tax/get`);
      req.flush('Server error', mockErrorResponse);
    });
  });

  describe('eliminarTributo', () => {
    it('should delete tax rule successfully', () => {
      const reglaId = '1';
      const mockResponse: ReglaTributaria = {
        id: reglaId,
        pais: Paises.ARGENTINA,
        tipo_impuesto: TipoImpuesto.RENTA_PERSONAS_FISICAS,
        valor: 25,
        descripcion: 'Regla de prueba'
      };
      
      service.eliminarTributo(reglaId).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });
    
      const req = httpMock.expectOne(`${environment.apiUrlProviders}/rules/tax/delete/${reglaId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });

    it('should handle 400 error when deleting tax rule', () => {
      const reglaId = '1';
      const mockErrorResponse = { status: 400, statusText: 'Bad Request' };
      
      service.eliminarTributo(reglaId).subscribe({
        next: () => fail('should have failed with 400 error'),
        error: (error) => {
          
          expect(error.status).toEqual(400);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrlProviders}/rules/tax/delete/${reglaId}`);
      req.flush('Invalid request', mockErrorResponse);
    });

    it('should handle 500 error when deleting tax rule', () => {
      const reglaId = '1';
      const mockErrorResponse = { status: 500, statusText: 'Server Error' };

      service.eliminarTributo(reglaId).subscribe({
        next: () => fail('should have failed with 500 error'),
        error: (error) => {
          
          expect(error.status).toEqual(500);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrlProviders}/rules/tax/delete/${reglaId}`);
      req.flush('Server error', mockErrorResponse);
    });
  });
});
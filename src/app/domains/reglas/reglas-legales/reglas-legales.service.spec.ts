/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { ReglasLegalesService } from './reglas-legales.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { ReglaLegal, ReglaLegalResponse, Paises, TipoRegla} from '../reglas.model';
import { CategoriaProductos } from '../../productos/producto.model';

describe('Service: ReglasLegales', () => {
  let service: ReglasLegalesService;
  let httpMock: HttpTestingController;

  const mockReglaLegal: ReglaLegal = {
    id: '1',
    pais: Paises.COLOMBIA,
    categoria_producto: CategoriaProductos.ALIMENTACIÓN,
    descripcion: 'INVIMA Alimentos'
  }

  const mockReglaLegalResponse: ReglaLegalResponse = {
    rules: [mockReglaLegal]
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [ReglasLegalesService]
    });

    service = TestBed.inject(ReglasLegalesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  })

  describe('getListaReglasLegales', () => {
      it('should get legal rules successfully', () => {
        service.getListaReglasLegales().subscribe(response => {
          expect(response).toEqual(mockReglaLegalResponse);
        });
  
        const req = httpMock.expectOne(`${environment.apiUrlProviders}/rules/legal/get`);
        expect(req.request.method).toBe('GET');
        req.flush(mockReglaLegalResponse);
      });
  
      it('should handle error when getting legal rules', () => {
        const mockErrorResponse = { status: 500, statusText: 'Server Error' };
  
        service.getListaReglasLegales().subscribe({
          next: () => fail('should have failed with 500 error'),
          error: (error) => {
            expect(error.status).toEqual(500);
          }
        });
  
        const req = httpMock.expectOne(`${environment.apiUrlProviders}/rules/legal/get`);
        req.flush('Server error', mockErrorResponse);
      });
    });
  
    describe('eliminarReglaLegal', () => {
      it('should delete legal rule successfully', () => {
        const reglaId = '1';
        const mockResponse: ReglaLegal = {
          id: reglaId,
          pais: Paises.COLOMBIA,
          categoria_producto: CategoriaProductos.FARMACIA,
          descripcion: 'INVIMA Salud'
        };
        
        service.eliminarReglaLegal(reglaId).subscribe(response => {
          expect(response).toEqual(mockResponse);
        });
      
        const req = httpMock.expectOne(`${environment.apiUrlProviders}/rules/legal/delete/${reglaId}`);
        expect(req.request.method).toBe('DELETE');
        req.flush(mockResponse);
      });
  
      it('should handle 400 error when deleting legal rule', () => {
        const reglaId = '1';
        const mockErrorResponse = { status: 400, statusText: 'Bad Request' };
        
        service.eliminarReglaLegal(reglaId).subscribe({
          next: () => fail('should have failed with 400 error'),
          error: (error) => {
            
            expect(error.status).toEqual(400);
          }
        });
  
        const req = httpMock.expectOne(`${environment.apiUrlProviders}/rules/legal/delete/${reglaId}`);
        req.flush('Invalid request', mockErrorResponse);
      });
  
      it('should handle 500 error when deleting legal rule', () => {
        const reglaId = '1';
        const mockErrorResponse = { status: 500, statusText: 'Server Error' };
  
        service.eliminarReglaLegal(reglaId).subscribe({
          next: () => fail('should have failed with 500 error'),
          error: (error) => {
            
            expect(error.status).toEqual(500);
          }
        });
  
        const req = httpMock.expectOne(`${environment.apiUrlProviders}/rules/legal/delete/${reglaId}`);
        req.flush('Server error', mockErrorResponse);
      });
    });
});

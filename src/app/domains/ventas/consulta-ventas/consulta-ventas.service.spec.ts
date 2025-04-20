/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { ConsultaVentasService } from './consulta-ventas.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment'
import { CategoriaProductos, Venta } from '../ventas.model';

describe('Service: ConsultaVentas', () => {
  let service: ConsultaVentasService;
  let httpMock: HttpTestingController;
  let apiUrlSales = environment.apiUrlSales;
  
  const mockPlant1 = {
    name: "Production Line 1",
    id: "0f0cce29-af3c-4169-9ff6-0041e41b9b7f"
  };

  const mockPlant2 = {
    name: "Production Line 2",
    id: "46b8f660-2006-45de-ad57-1764607876ac"
  };

  const requestResult1 = {
    "total_quantity": 30.0,
    "purchase_date": "2025-04-01",
    "name": "Desinfectante",
    "unit_value": 29.99,
    "id": "dc33d2de-28de-4728-aa6c-30fd3a26dc36"
  }

  const requestResult2 = {
    "total_quantity": 20.0,
    "purchase_date": "2025-04-02",
    "name": "Camiseta de f\u00fatbol",
    "unit_value": 129.99,
    "id": "299814bb-d133-4bf1-ab1a-ca2110d29f6e"
  }

  const requestResult3 = {
    "total_quantity": 20.0,
    "purchase_date": "2025-04-03",
    "name": "Camiseta de f\u00fatbol",
    "unit_value": 129.99,
    "id": "299814bb-d133-4bf1-ab1a-ca2110d29f6e"
  }

  const requestResult4 = {
    "total_quantity": 20.0,
    "purchase_date": "2025-04-04",
    "name": "Camiseta de f\u00fatbol",
    "unit_value": 129.99,
    "id": "299814bb-d133-4bf1-ab1a-ca2110d29f6e"
  }

  const requestResult5 = {
    "total_quantity": 20.0,
    "purchase_date": "2025-04-05",
    "name": "Camiseta de f\u00fatbol",
    "unit_value": 129.99,
    "id": "8f163008-1666-483a-8e40-c0d7309baf6c"
  }


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConsultaVentasService]
    });

    service = TestBed.inject(ConsultaVentasService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  })

  describe('getData', () => {
    let responseResults: Venta[] = [];
    let mockResponse: Venta[] = [];

    it('should create request with no params', () => {
      mockResponse = [requestResult1, requestResult2, requestResult3, requestResult4, requestResult5]
      
      const formData = {}

      service.getData(formData).subscribe(response => {
        responseResults = response;
      });

      const req = httpMock.expectOne({
        method: 'GET',
        url: apiUrlSales + `/sales?`
      });

      req.flush(mockResponse);

      expect(req.request.method).toBe('GET');
      expect(responseResults).toEqual(mockResponse);
    });

    it('should create request with only product and provider', () => {
      mockResponse = [requestResult2, requestResult3, requestResult4]
      
      const formData = {
        fieldProducto: '299814bb-d133-4bf1-ab1a-ca2110d29f6e',
        fieldFabricante: mockPlant1.id
      }

      service.getData(formData).subscribe(response => {
        responseResults = response;
      });

      const req = httpMock.expectOne({
        method: 'GET',
        url: apiUrlSales + `/sales?product=${formData.fieldProducto}&provider=${formData.fieldFabricante}`
      });

      req.flush(mockResponse);

      expect(req.request.method).toBe('GET');
      expect(responseResults).toEqual(mockResponse);
    });

    it('should create request with product, provider and category', () => {
      mockResponse = [requestResult1]
    
      const formData = {
        fieldProducto: 'dc33d2de-28de-4728-aa6c-30fd3a26dc36',
        fieldFabricante: mockPlant2.id,
        fieldCategoria: CategoriaProductos.LIMPIEZA
      }

      service.getData(formData).subscribe(response => {
        responseResults = response;
      });

      const req = httpMock.expectOne({
        method: 'GET',
        url: apiUrlSales + `/sales?product=${formData.fieldProducto}&provider=${formData.fieldFabricante}&category=${formData.fieldCategoria}`
      });

      req.flush(mockResponse);

      expect(req.request.method).toBe('GET');
      expect(responseResults).toEqual(mockResponse);
    });

    it('should create request with all parameters', () => {
      mockResponse = [requestResult2, requestResult3]

      const formData = {
        fieldProducto: '299814bb-d133-4bf1-ab1a-ca2110d29f6e',
        fieldFabricante: mockPlant1.id,
        fieldCategoria: CategoriaProductos.ROPA,
        fieldDesde: '2025-04-02',
        fieldHasta: '2025-04-03'
      }

      service.getData(formData).subscribe(response => {
        responseResults = response;
      });

      const req = httpMock.expectOne({
        method: 'GET',
        url: apiUrlSales + `/sales?product=${formData.fieldProducto}&provider=${formData.fieldFabricante}&category=${formData.fieldCategoria}&initial_date=${formData.fieldDesde}&final_date=${formData.fieldHasta}`
      });

      req.flush(mockResponse);

      expect(req.request.method).toBe('GET');
      expect(responseResults).toEqual(mockResponse);
    });

  });

});

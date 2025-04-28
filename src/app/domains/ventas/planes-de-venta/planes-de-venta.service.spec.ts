/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

import { PlanesDeVentaService } from './planes-de-venta.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('Service: PlanesDeVenta', () => {
  let service: PlanesDeVentaService;
  let httpMock: HttpTestingController;

  const apiUrl = environment.apiUrlSales + `/sales-plans/add`;
  const apiUrlSellers = environment.apiUrlSellers + `/sellers`;
  const apiUrlProducts = environment.apiUrlProducts + `/products`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [PlanesDeVentaService]
    });

    service = TestBed.inject(PlanesDeVentaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('postPlanVentas', () => {
    it('should send a successful request if all field values are valid', () => {
      const mockData = {
          seller_id: 'e08952e6-a5b7-43b7-95df-a22f1a42b46a',
          target: 150000,
          product_id: 'b81b3e18-5de8-455e-add9-dd348c3b2399',
          period: 'ANUAL'
      }

      const expectResponse = {message: "Sales period created successfully", id: "8358b80e-abd1-4dbe-88da-eaa5ead38720"};

      service.postPlanVentas(mockData).subscribe(response => {
        expect(response).toEqual(expectResponse)
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(expectResponse);
    });

    it('should send an unsuccessful request if seller_id is not uuid', () => {
      const mockData = {
          seller_id: '++-*nqniohrs',
          target: 150000,
          product_id: 'b81b3e18-5de8-455e-add9-dd348c3b2399',
          period: 'ANUAL'
      }

      const expectResponse = {message: "invalid seller id"};

      service.postPlanVentas(mockData).subscribe(response => {
        expect(response).toEqual(expectResponse)
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(expectResponse);
    });

    it('should send an unsuccessful request if product_id is not uuid', () => {
      const mockData = {
          seller_id: 'e08952e6-a5b7-43b7-95df-a22f1a42b46a',
          target: 150000,
          product_id: '++-*nqniohrs',
          period: 'ANUAL'
      }

      const expectResponse = {message: "invalid product id"};

      service.postPlanVentas(mockData).subscribe(response => {
        expect(response).toEqual(expectResponse)
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(expectResponse);
    });

    it('should send an unsuccessful request if any field is missing', () => {
      const mockData = {
          seller_id: 'e08952e6-a5b7-43b7-95df-a22f1a42b46a',
          target: 150000,
          period: 'ANUAL'
      }

      const expectResponse = {message: "Missing required fields"};

      service.postPlanVentas(mockData).subscribe(response => {
        expect(response).toEqual(expectResponse)
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(expectResponse);
    });

    it('should send an unsuccessful request if a duplicate is tried to be added', () => {
      const mockDataOriginal = {
          seller_id: 'e08952e6-a5b7-43b7-95df-a22f1a42b46a',
          target: 150000,
          product_id: 'b81b3e18-5de8-455e-add9-dd348c3b2399',
          period: 'ANUAL'
      }

      const expectResponse = {message: "Sales period created successfully", id: "8358b80e-abd1-4dbe-88da-eaa5ead38720"};

      service.postPlanVentas(mockDataOriginal).subscribe(response => {
        expect(response).toEqual(expectResponse)
      });

      const reqOriginal = httpMock.expectOne(apiUrl);
      reqOriginal.flush(expectResponse);

      const mockDataDuplicate = {
          seller_id: 'e08952e6-a5b7-43b7-95df-a22f1a42b46a',
          target: 150000,
          product_id: 'b81b3e18-5de8-455e-add9-dd348c3b2399',
          period: 'ANUAL'
      }

      const expectResponseDuplicate = {message: "An active sales plan already exists for this seller and period."};

      service.postPlanVentas(mockDataDuplicate).subscribe(response => {
        expect(response).toEqual(expectResponseDuplicate)
      });

      const reqDuplicate = httpMock.expectOne(apiUrl);
      reqDuplicate.flush(expectResponseDuplicate);
    });
  })
});

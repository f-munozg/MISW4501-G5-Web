/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ConsultaVentasComponent } from './consulta-ventas.component';
import { VentasModule } from '../ventas.module';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CategoriaProductos } from '../ventas.model';
import { ConsultaVentasService } from './consulta-ventas.service';
import { environment } from '../../../../environments/environment';

describe('ConsultaVentasComponent', () => {
  let component: ConsultaVentasComponent;
  let fixture: ComponentFixture<ConsultaVentasComponent>;
  let service: ConsultaVentasService;
  let httpMock: HttpTestingController;

  let apiUrlProviders = environment.apiUrlProviders + `/providers`;
  let apiUrlProducts = environment.apiUrlProducts + `/products`;

  let apiUrlSales = environment.apiUrlSales;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultaVentasComponent ],
      imports: [ VentasModule, HttpClientTestingModule, ReactiveFormsModule, RouterTestingModule],
      providers: [ConsultaVentasService]    
    })
    .compileComponents();

    service = TestBed.inject(ConsultaVentasService);
    httpMock = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaVentasComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ConsultaVentasService);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();

    const req1 = httpMock.expectOne(apiUrlProducts);
    const req2 = httpMock.expectOne(apiUrlProviders);

    req1.flush({});
    req2.flush({});
    
  });

  it('should have correct column definitions', () => {
    expect(component.tableColumns.length).toBe(4);
    expect(component.tableColumns.map(c => c.name)).toEqual(['purchase_date', 'name', 'total_quantity', 'total_value']);
    expect(component.tableColumns.map(c => c.header)).toEqual(['Fecha', 'Producto', 'Unidades Vendidas', 'Ingresos']);
  
    const req1 = httpMock.expectOne(apiUrlProducts);
    const req2 = httpMock.expectOne(apiUrlProviders);

    req1.flush({});
    req2.flush({});
  });

  it('should have correct visible columns', () => {
    expect(component.visibleColumns).toEqual(['purchase_date', 'name', 'total_quantity', 'total_value']);
  
    const req1 = httpMock.expectOne(apiUrlProducts);
    const req2 = httpMock.expectOne(apiUrlProviders);

    req1.flush({});
    req2.flush({});
  });

  it('should initialize with empty table data', () => {
    expect(component.tableData).toEqual([]);
  
    const req1 = httpMock.expectOne(apiUrlProducts);
    const req2 = httpMock.expectOne(apiUrlProviders);

    req1.flush({});
    req2.flush({});
  });

  it('should initialize selectedValue as undefined', () => {
    expect(component.selectedValue).toBeUndefined();
  
    const req1 = httpMock.expectOne(apiUrlProducts);
    const req2 = httpMock.expectOne(apiUrlProviders);

    req1.flush({});
    req2.flush({});
  });

  it('should initialize categorias with 9 values', () => {
    expect(component.fileTypes).toEqual(Object.values(CategoriaProductos));
  
    const req1 = httpMock.expectOne(apiUrlProducts);
    const req2 = httpMock.expectOne(apiUrlProviders);

    req1.flush({});
    req2.flush({});
  });

  describe('with test data', () => {
    beforeEach(() => {
      component.tableData = [
        {id: 'dc33d2de-28de-4728-aa6c-30fd3a26dc36', name: 'Desinfectante', total_quantity: 20, unit_value: 100, purchase_date: '2025-04-01'},
        {id: '299814bb-d133-4bf1-ab1a-ca2110d29f6e', name: 'Camiseta de f\u00fatbol', total_quantity: 20, unit_value: 100, purchase_date: '2025-04-02'},
      ];
      fixture.detectChanges();
    });

    it('should render table rows with correct data', fakeAsync(() => {
      tick();
      fixture.detectChanges();

      const rows = fixture.nativeElement.querySelectorAll('tr[mat-row]');
      expect(rows.length).toBe(2);

      const cells = fixture.nativeElement.querySelectorAll('td[mat-cell]');
      expect(cells[0].textContent.trim()).toBe('2025-04-01');
      expect(cells[1].textContent.trim()).toBe('Desinfectante');
      expect(cells[5].textContent.trim()).toBe('Camiseta de fútbol');
      expect(cells[7].textContent.trim()).toBe('2000.00');

      const req1 = httpMock.expectOne(apiUrlProducts);
      const req2 = httpMock.expectOne(apiUrlProviders);
  
      req1.flush({});
      req2.flush({});
    }));

    it('should update table when data changes', fakeAsync(() => {
      component.tableData = [{id: 'b044be4c-9998-4da3-9e05-c43810dbda0e', name: 'Milo', total_quantity: 24, unit_value: 150, purchase_date: '2025-04-03'}]
      tick();
      fixture.detectChanges();

      const cells = fixture.nativeElement.querySelectorAll('td[mat-cell]');
      expect(cells[0].textContent.trim()).toBe('2025-04-03');
      expect(cells[1].textContent.trim()).toBe('Milo');
      expect(cells[2].textContent.trim()).toBe('24');
      expect(cells[3].textContent.trim()).toBe((24*150).toFixed(2));

      const req1 = httpMock.expectOne(apiUrlProducts);
      const req2 = httpMock.expectOne(apiUrlProviders);
  
      req1.flush({});
      req2.flush({});
    }));

    it('should call service with form data', () => {
      const testData = {fieldProducto: 'dc33d2de-28de-4728-aa6c-30fd3a26dc36', fieldFabricante: '0f0cce29-af3c-4169-9ff6-0041e41b9b7f', fieldCategoria: CategoriaProductos.ROPA, fieldDesde: '2025-04-01', fieldHasta: '2025-04-30'};
      const getDataSpy = spyOn(service, 'getData').and.callThrough();
      
      component.consultaVentasForm.setValue(testData);
      component.consultaVentasForm.setErrors(null);
      component.onSubmit();
      
      expect(getDataSpy).toHaveBeenCalledWith(testData);
  
      const req1 = httpMock.expectOne(apiUrlProducts);
      const req2 = httpMock.expectOne(apiUrlProviders);
  
      req1.flush({});
      req2.flush({});

      const req = httpMock.expectOne(apiUrlSales + `/sales?product=${testData.fieldProducto}&provider=${testData.fieldFabricante}&category=${testData.fieldCategoria}&initial_date=${testData.fieldDesde}&final_date=${testData.fieldHasta}`);
      req.flush({})
    });

  describe('formatDate', () => {
    it('should return the same string for valid YYYY-MM-DD format', () => {
      const input = '2023-05-15';
      const result = component.formatDate(input);
      expect(result).toBe(input);

      const req1 = httpMock.expectOne(apiUrlProducts);
      const req2 = httpMock.expectOne(apiUrlProviders);
  
      req1.flush({});
      req2.flush({});
    });
  
    it('should format a Date object correctly', () => {
      const input = new Date('2023-05-15T12:00:00');
      const expected = '2023-05-15';
      const result = component.formatDate(input);
      expect(result).toBe(expected);

      const req1 = httpMock.expectOne(apiUrlProducts);
      const req2 = httpMock.expectOne(apiUrlProviders);
  
      req1.flush({});
      req2.flush({});
    });
  
    it('should format a valid date string (non-ISO) correctly', () => {
      const input = 'May 15, 2023';
      const expected = '2023-05-15';
      const result = component.formatDate(input);
      expect(result).toBe(expected);

      const req1 = httpMock.expectOne(apiUrlProducts);
      const req2 = httpMock.expectOne(apiUrlProviders);
  
      req1.flush({});
      req2.flush({});
    });
  
    it('should throw an error for invalid date string', () => {
      const input = 'not-a-date';
      expect(() => component.formatDate(input)).toThrowError('Invalid date');

      const req1 = httpMock.expectOne(apiUrlProducts);
      const req2 = httpMock.expectOne(apiUrlProviders);
  
      req1.flush({});
      req2.flush({});
    });
  
    it('should handle month and day padding correctly', () => {
      const input = new Date(2023, 8, 5); // Septiembre 5 (El primer mes arranca en 0)
      const expected = '2023-09-05';
      const result = component.formatDate(input);
      expect(result).toBe(expected);

      const req1 = httpMock.expectOne(apiUrlProducts);
      const req2 = httpMock.expectOne(apiUrlProviders);
  
      req1.flush({});
      req2.flush({});
    });
  
    it('should handle leap year date correctly', () => {
      const input = new Date(2020, 1, 29); // Febrero 29, 2020
      const expected = '2020-02-29';
      const result = component.formatDate(input);
      expect(result).toBe(expected);

      const req1 = httpMock.expectOne(apiUrlProducts);
      const req2 = httpMock.expectOne(apiUrlProviders);
  
      req1.flush({});
      req2.flush({});
    });
  
    it('should handle minimum date value', () => {
      const input = new Date(-8640000000000000);
      const result = component.formatDate(input);
      expect(typeof result).toBe('string');
      expect(result).toMatch(/^-?\d+-\d{2}-\d{2}$/);

      const req1 = httpMock.expectOne(apiUrlProducts);
      const req2 = httpMock.expectOne(apiUrlProviders);
  
      req1.flush({});
      req2.flush({});
    });
  });

  });
});

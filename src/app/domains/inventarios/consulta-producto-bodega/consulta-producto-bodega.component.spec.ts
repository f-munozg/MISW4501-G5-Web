/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ConsultaProductoBodegaComponent } from './consulta-producto-bodega.component';
import { InventariosModule } from '../inventarios.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConsultaProductoBodegaService } from './consulta-producto-bodega.service';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '../../../../environments/environment'

describe('ConsultaProductoBodegaComponent', () => {
  let component: ConsultaProductoBodegaComponent;
  let fixture: ComponentFixture<ConsultaProductoBodegaComponent>;
  let service: ConsultaProductoBodegaService;
  let httpMock: HttpTestingController;

  let apiUrlStock = environment.apiUrlStock
  let apiUrlWarehouses = apiUrlStock + '/stock/get_warehouses';

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultaProductoBodegaComponent ],
      imports: [InventariosModule, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule],
      providers: [ConsultaProductoBodegaService]
    })
    .compileComponents();

    service = TestBed.inject(ConsultaProductoBodegaService);
    httpMock = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaProductoBodegaComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ConsultaProductoBodegaService);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();

    const req = httpMock.expectOne(apiUrlWarehouses);
    req.flush({});
  });

  it('should have correct column definitions', () => {
    expect(component.tableColumns.length).toBe(3);
    expect(component.tableColumns.map(c => c.name)).toEqual(['location', 'quantity', 'status']);
    expect(component.tableColumns.map(c => c.header)).toEqual(['Ubicación en Bodega', 'Cantidad Disponible', 'Estado']);
  
    const req = httpMock.expectOne(apiUrlWarehouses);
    req.flush({});
  });

  it('should have correct visible columns', () => {
    expect(component.visibleColumns).toEqual(['location', 'quantity', 'status']);
  
    const req = httpMock.expectOne(apiUrlWarehouses);
    req.flush({});
  });

  it('should initialize with empty table data', () => {
    expect(component.tableData).toEqual([]);
  
    const req = httpMock.expectOne(apiUrlWarehouses);
    req.flush({});
  });

  it('should initialize selectedValue as undefined', () => {
    expect(component.selectedValue).toBeUndefined();
  
    const req = httpMock.expectOne(apiUrlWarehouses);
    req.flush({});
  });

  describe('with test data', () => {
    beforeEach(() => {
      component.tableData = [
        { location: 'A2', quantity: 45, status: 'Vigente', sku: 'SKU-123', product: 'Camiseta' },
        { location: 'A3', quantity: 35, status: 'Vigente', sku: 'SKU-123', product: 'Camiseta' },
        { location: 'A1', quantity: 25, status: 'Vigente', sku: 'SKU-123', product: 'Camiseta' }
      ];
      fixture.detectChanges();
    });

    it('should render table headers correctly', fakeAsync(() => {
      tick(); // Para esperar en operaciones con async
      fixture.detectChanges();
      
      const headers = fixture.nativeElement.querySelectorAll('th[mat-header-cell]');
      expect(headers.length).toBe(3);
      expect(headers[0].textContent.trim()).toBe('Ubicación en Bodega');
      expect(headers[1].textContent.trim()).toBe('Cantidad Disponible');
    
      const req = httpMock.expectOne(apiUrlWarehouses);
      req.flush({});
    }));

    it('should render table rows with correct data', fakeAsync(() => {
      tick();
      fixture.detectChanges();
      
      const rows = fixture.nativeElement.querySelectorAll('tr[mat-row]');
      expect(rows.length).toBe(3);

      const cells = fixture.nativeElement.querySelectorAll('td[mat-cell]');
      expect(cells[0].textContent.trim()).toBe('A2');
      expect(cells[1].textContent.trim()).toBe('45');
      expect(cells[4].textContent.trim()).toBe('35');
      expect(cells[5].textContent.trim()).toBe('Vigente');
    
      const req = httpMock.expectOne(apiUrlWarehouses);
      req.flush({});
    }));

    it('should update table when data changes', fakeAsync(() => {
      component.tableData = [{ location: 'A4', quantity: 15, status: 'No Vigente', sku: 'SKU-123', product: 'Camiseta' }];
      tick();
      fixture.detectChanges();
      
      const cells = fixture.nativeElement.querySelectorAll('td[mat-cell]');
      expect(cells[0].textContent.trim()).toBe('A4');

      const req = httpMock.expectOne(apiUrlWarehouses);
      req.flush({});
    }));

    it('should update visible columns when changed', fakeAsync(() => {
      component.visibleColumns = ['location', 'quantity'];
      tick();
      fixture.detectChanges();
      
      const headers = fixture.nativeElement.querySelectorAll('th[mat-header-cell]');
      expect(headers.length).toBe(2);
      expect(headers[0].textContent.trim()).toBe('Ubicación en Bodega');
      expect(headers[1].textContent.trim()).toBe('Cantidad Disponible');
    
      const req = httpMock.expectOne(apiUrlWarehouses);
      req.flush({});
    }));

  });

  it('should not call service when form is invalid', () => {
    const getDataSpy = spyOn(service, 'getData');
    component.consultaProductoBodegaForm.setErrors({ invalid: true });
    component.onSubmit();
    expect(getDataSpy).not.toHaveBeenCalled();

    const req = httpMock.expectOne(apiUrlWarehouses);
    req.flush({});
  });

  it('should call service with form data', () => {
    const testData = { fieldProducto: 'value1', fieldBodega: 'value2' };
    const getDataSpy = spyOn(service, 'getData').and.callThrough();
    
    component.consultaProductoBodegaForm.setValue(testData);
    component.consultaProductoBodegaForm.setErrors(null);
    component.onSubmit();
    
    expect(getDataSpy).toHaveBeenCalledWith(testData);

    const req1 = httpMock.expectOne(apiUrlWarehouses);
    req1.flush({});
    const req2 = httpMock.expectOne(apiUrlStock + `/stock/product_location?product=value1&warehouse_id=value2`);
    req2.flush({})
  });

});

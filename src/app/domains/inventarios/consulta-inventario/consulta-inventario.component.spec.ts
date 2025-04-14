/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ConsultaInventarioComponent } from './consulta-inventario.component';
import { InventariosModule } from '../inventarios.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoriaProductos } from '../inventario.model';
import { ConsultaInventarioService } from './consulta-inventario.service';

describe('ConsultaInventarioComponent', () => {
  
  let component: ConsultaInventarioComponent;
  let fixture: ComponentFixture<ConsultaInventarioComponent>;
  let service: ConsultaInventarioService;
  let httpMock: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultaInventarioComponent ],
      imports: [InventariosModule, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule],
      providers: [ConsultaInventarioService]
    })
    .compileComponents();

    service = TestBed.inject(ConsultaInventarioService);
    httpMock = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaInventarioComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ConsultaInventarioService);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();

    const req = httpMock.expectOne('https://backend-providers-143596276526.us-central1.run.app/providers');
    req.flush({});
  });

  it('should have correct column definitions', () => {
    expect(component.tableColumns.length).toBe(4);
    expect(component.tableColumns.map(c => c.name)).toEqual(['warehouse', 'stock', 'estimated_delivery_time', 'date_update']);
    expect(component.tableColumns.map(c => c.header)).toEqual(['Bodega', 'Stock (Unidades)', 'Fecha Estimada Reposición', 'Última Actualización']);
  
    const req = httpMock.expectOne('https://backend-providers-143596276526.us-central1.run.app/providers');
    req.flush({});
  });

  it('should have correct visible columns', () => {
    expect(component.visibleColumns).toEqual(['warehouse', 'stock', 'estimated_delivery_time', 'date_update']);
  
    const req = httpMock.expectOne('https://backend-providers-143596276526.us-central1.run.app/providers');
    req.flush({});
  });

  it('should initialize with empty table data', () => {
    expect(component.tableData).toEqual([]);
  
    const req = httpMock.expectOne('https://backend-providers-143596276526.us-central1.run.app/providers');
    req.flush({});
  });

  it('should initialize selectedValue as undefined', () => {
    expect(component.selectedValue).toBeUndefined();
  
    const req = httpMock.expectOne('https://backend-providers-143596276526.us-central1.run.app/providers');
    req.flush({});
  });

  it('should initialize categorias with 9 values', () => {
    expect(component.fileTypes).toEqual(Object.values(CategoriaProductos));
  
    const req = httpMock.expectOne('https://backend-providers-143596276526.us-central1.run.app/providers');
    req.flush({});
  });

  describe('with test data', () => {
    beforeEach(() => {
      component.tableData = [
        { warehouse: 'Value 1', quantity: 34, estimated_delivery_time: 'Value 3', date_update: 'Value 4', product: 'Product 1',  category: ''},
        { warehouse: 'Value A', quantity: 65, estimated_delivery_time: 'Value C', date_update: 'Value D', product: 'Product A',  category: ''}
      ];
      fixture.detectChanges();
    });

    it('should render table headers correctly', fakeAsync(() => {
      tick(); // Para esperar en operaciones con async
      fixture.detectChanges();
      
      const headers = fixture.nativeElement.querySelectorAll('th[mat-header-cell]');
      expect(headers.length).toBe(4);
      expect(headers[0].textContent.trim()).toBe('Bodega');
      expect(headers[1].textContent.trim()).toBe('Stock (Unidades)');
    
      const req = httpMock.expectOne('https://backend-providers-143596276526.us-central1.run.app/providers');
      req.flush({});
    }));

    it('should render table rows with correct data', fakeAsync(() => {
      tick();
      fixture.detectChanges();
      
      const rows = fixture.nativeElement.querySelectorAll('tr[mat-row]');
      expect(rows.length).toBe(2);

      const cells = fixture.nativeElement.querySelectorAll('td[mat-cell]');
      expect(cells[0].textContent.trim()).toBe('Value 1');
      expect(cells[1].textContent.trim()).toBe('34');
      expect(cells[4].textContent.trim()).toBe('Value A');
      expect(cells[5].textContent.trim()).toBe('65');
    
      const req = httpMock.expectOne('https://backend-providers-143596276526.us-central1.run.app/providers');
      req.flush({});
    }));

    it('should update table when data changes', fakeAsync(() => {
      component.tableData = [{ warehouse: 'New', quantity: 20, estimated_delivery_time: '', date_update: '' , product: 'Product 1',  category: ''}];
      tick();
      fixture.detectChanges();
      
      const cells = fixture.nativeElement.querySelectorAll('td[mat-cell]');
      expect(cells[0].textContent.trim()).toBe('New');

      const req = httpMock.expectOne('https://backend-providers-143596276526.us-central1.run.app/providers');
      req.flush({});
    }));

    it('should update visible columns when changed', fakeAsync(() => {
      component.visibleColumns = ['warehouse', 'estimated_delivery_time'];
      tick();
      fixture.detectChanges();
      
      const headers = fixture.nativeElement.querySelectorAll('th[mat-header-cell]');
      expect(headers.length).toBe(2);
      expect(headers[0].textContent.trim()).toBe('Bodega');
      expect(headers[1].textContent.trim()).toBe('Fecha Estimada Reposición');
    
      const req = httpMock.expectOne('https://backend-providers-143596276526.us-central1.run.app/providers');
      req.flush({});
    }));
  });

  it('should not call service when form is invalid', () => {
    const getDataSpy = spyOn(service, 'getData');
    component.consultaInventarioForm.setErrors({ invalid: true });
    component.onSubmit();
    expect(getDataSpy).not.toHaveBeenCalled();

    const req = httpMock.expectOne('https://backend-providers-143596276526.us-central1.run.app/providers');
    req.flush({});
  });

  it('should call service with form data', () => {
    const testData = { fieldProducto: 'value1', fieldFabricante: 'value2', fieldCategoria: 'value3' };
    const getDataSpy = spyOn(service, 'getData').and.callThrough();
    
    component.consultaInventarioForm.setValue(testData);
    component.consultaInventarioForm.setErrors(null);
    component.onSubmit();
    
    expect(getDataSpy).toHaveBeenCalledWith(testData);

    const req1 = httpMock.expectOne('https://backend-providers-143596276526.us-central1.run.app/providers');
    req1.flush({});
    const req2 = httpMock.expectOne('https://backend-stock-143596276526.us-central1.run.app/stock/query?product=value1&provider=value2&category=value3');
    req2.flush({})
  });

});



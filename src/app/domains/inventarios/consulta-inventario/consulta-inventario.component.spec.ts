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

  /*
  afterEach(() => {
    httpMock.verify(); // Verify no outstanding HTTP requests
  });
  */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct column definitions', () => {
    expect(component.tableColumns.length).toBe(4);
    expect(component.tableColumns.map(c => c.name)).toEqual(['warehouse', 'stock', 'estimated_delivery_time', 'date_update']);
    expect(component.tableColumns.map(c => c.header)).toEqual(['Bodega', 'Stock (Unidades)', 'Fecha Estimada Reposición', 'Última Actualización']);
  });

  it('should have correct visible columns', () => {
    expect(component.visibleColumns).toEqual(['warehouse', 'stock', 'estimated_delivery_time', 'date_update']);
  });

  it('should initialize with empty table data', () => {
    expect(component.tableData).toEqual([]);
  });

  it('should initialize selectedValue as undefined', () => {
    expect(component.selectedValue).toBeUndefined();
  });

  it('should initialize categorias with 9 values', () => {
    expect(component.fileTypes).toEqual(Object.values(CategoriaProductos));
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
    }));

    it('should update table when data changes', fakeAsync(() => {
      component.tableData = [{ warehouse: 'New', quantity: 20, estimated_delivery_time: '', date_update: '' , product: 'Product 1',  category: ''}];
      tick();
      fixture.detectChanges();
      
      const cells = fixture.nativeElement.querySelectorAll('td[mat-cell]');
      expect(cells[0].textContent.trim()).toBe('New');
    }));

    it('should update visible columns when changed', fakeAsync(() => {
      component.visibleColumns = ['warehouse', 'estimated_delivery_time'];
      tick();
      fixture.detectChanges();
      
      const headers = fixture.nativeElement.querySelectorAll('th[mat-header-cell]');
      expect(headers.length).toBe(2);
      expect(headers[0].textContent.trim()).toBe('Bodega');
      expect(headers[1].textContent.trim()).toBe('Fecha Estimada Reposición');
    }));
  });
});



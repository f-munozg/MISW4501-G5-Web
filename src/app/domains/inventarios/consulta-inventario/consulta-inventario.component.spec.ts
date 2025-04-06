/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ConsultaInventarioComponent } from './consulta-inventario.component';
import { InventariosModule } from '../inventarios.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ConsultaInventarioComponent', () => {
  let component: ConsultaInventarioComponent;
  let fixture: ComponentFixture<ConsultaInventarioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultaInventarioComponent ],
      imports: [InventariosModule, ReactiveFormsModule, HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct column definitions', () => {
    expect(component.tableColumns.length).toBe(4);
    expect(component.tableColumns.map(c => c.name)).toEqual(['bodega', 'unidades', 'fecha_reposicion', 'ultima_actualizacion']);
    expect(component.tableColumns.map(c => c.header)).toEqual(['Bodega', 'Stock (Unidades)', 'Fecha Estimada Reposición', 'Última Actualización']);
  });

  it('should have correct visible columns', () => {
    expect(component.visibleColumns).toEqual(['bodega', 'unidades', 'fecha_reposicion', 'ultima_actualizacion']);
  });

  it('should initialize with empty table data', () => {
    expect(component.tableData).toEqual([]);
  });

  it('should initialize selectedValue as undefined', () => {
    expect(component.selectedValue).toBeUndefined();
  });

  it('should initialize categorias as empty array', () => {
    expect(component.categorias).toEqual([]);
  });

  describe('with test data', () => {
    beforeEach(() => {
      component.tableData = [
        { bodega: 'Value 1', unidades: 'Value 2', fecha_reposicion: 'Value 3', ultima_actualizacion: 'Value 4' },
        { bodega: 'Value A', unidades: 'Value B', fecha_reposicion: 'Value C', ultima_actualizacion: 'Value D' }
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
      expect(cells[1].textContent.trim()).toBe('Value 2');
      expect(cells[4].textContent.trim()).toBe('Value A');
      expect(cells[5].textContent.trim()).toBe('Value B');
    }));

    it('should update table when data changes', fakeAsync(() => {
      component.tableData = [{ bodega: 'New', unidades: 'Data', fecha_reposicion: '', ultima_actualizacion: '' }];
      tick();
      fixture.detectChanges();
      
      const cells = fixture.nativeElement.querySelectorAll('td[mat-cell]');
      expect(cells[0].textContent.trim()).toBe('New');
    }));

    it('should update visible columns when changed', fakeAsync(() => {
      component.visibleColumns = ['bodega', 'fecha_reposicion'];
      tick();
      fixture.detectChanges();
      
      const headers = fixture.nativeElement.querySelectorAll('th[mat-header-cell]');
      expect(headers.length).toBe(2);
      expect(headers[0].textContent.trim()).toBe('Bodega');
      expect(headers[1].textContent.trim()).toBe('Fecha Estimada Reposición');
    }));
  });
});



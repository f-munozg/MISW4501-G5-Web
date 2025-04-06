/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
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

    it('should render table headers correctly', () => {
      const headerCells = fixture.debugElement.queryAll(By.css('mat-header-cell'));
      expect(headerCells.length).toBe(4);
      expect(headerCells[0].nativeElement.textContent.trim()).toBe('Bodega');
      expect(headerCells[1].nativeElement.textContent.trim()).toBe('Stock (Unidades)');
    });

    it('should render table rows with correct data', () => {
      const rows = fixture.debugElement.queryAll(By.css('mat-row'));
      expect(rows.length).toBe(2);

      const firstRowCells = rows[0].queryAll(By.css('mat-cell'));
      expect(firstRowCells[0].nativeElement.textContent.trim()).toBe('Value 1');
      expect(firstRowCells[1].nativeElement.textContent.trim()).toBe('Value 2');

      const secondRowCells = rows[1].queryAll(By.css('mat-cell'));
      expect(secondRowCells[0].nativeElement.textContent.trim()).toBe('Value A');
      expect(secondRowCells[1].nativeElement.textContent.trim()).toBe('Value B');
    });

    it('should apply cell functions correctly', () => {
      const testItem = { bodega: 'test1', unidades: 'test2', fecha_reposicion: 'test3', ultima_actualizacion: 'test4' };
      
      expect(component.tableColumns[0].cell(testItem)).toBe('test1');
      expect(component.tableColumns[1].cell(testItem)).toBe('test2');
      expect(component.tableColumns[2].cell(testItem)).toBe('test3');
      expect(component.tableColumns[3].cell(testItem)).toBe('test4');
    });

    it('should update table when data changes', () => {
      component.tableData = [{ bodega: 'Value 1', unidades: 'Value 2', fecha_reposicion: 'Value 3', ultima_actualizacion: 'Value 4' }];
      fixture.detectChanges();
      
      const cells = fixture.debugElement.queryAll(By.css('mat-cell'));
      expect(cells[0].nativeElement.textContent.trim()).toBe('New');
    });

    it('should update visible columns when changed', () => {
      component.visibleColumns = ['bodega', 'fecha_reposicion'];
      fixture.detectChanges();
      
      const headerCells = fixture.debugElement.queryAll(By.css('mat-header-cell'));
      expect(headerCells.length).toBe(2);
      expect(headerCells[0].nativeElement.textContent.trim()).toBe('Bodega');
      expect(headerCells[1].nativeElement.textContent.trim()).toBe('Stock (Unidades)');
    });
  });
});



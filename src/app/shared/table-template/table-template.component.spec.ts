/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, SimpleChange } from '@angular/core';

import { TableTemplateComponent, TableAction, TableColumn } from './table-template.component';
import { MaterialModule } from 'src/app/material/material.module';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

describe('TableTemplateComponent', () => {
  let component: TableTemplateComponent<any>;
  let fixture: ComponentFixture<TableTemplateComponent<any>>;

  interface TestItem {
    id: number;
    name: string;
  }

  const testData: TestItem[] = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' }
  ];

  const testColumns: TableColumn[] = [
    { 
      name: 'id', 
      header: 'ID',
      cell: (element: TestItem) => `${element.id}`
    },
    { 
      name: 'name', 
      header: 'Name',
      cell: (element: TestItem) => element.name
    }
  ];

  const testActions: TableAction[] = [
    { icon: 'Edit', tooltip: 'edit', action: () => {} }
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ 
        TableTemplateComponent,
        MaterialModule,
        MatPaginator
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableTemplateComponent);
    component = fixture.componentInstance;
    
    component.data = [...testData];
    component.columns = [...testColumns];
    component.displayedColumns = ['id', 'name'];
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty data if no input provided', () => {
    fixture = TestBed.createComponent(TableTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
    expect(component.dataSource.data).toEqual([]);
  });

  it('should set input data correctly', () => {
    expect(component.dataSource.data).toEqual(testData);
    expect(component.dataSource.data.length).toBe(2);
    expect(component.dataSource.data[0]).toEqual(testData[0]);
    expect(component.dataSource.data[1]).toEqual(testData[1]);
  });

  it('should add actions column when actions exist', () => {
    component.actions = testActions;
    fixture.detectChanges();

    expect(component.displayedColumnsWithActions).toEqual(['id', 'name', 'actions']);
  });

  it('should not add actions column when no actions', () => {
    component.actions = [];
    fixture.detectChanges();

    expect(component.displayedColumnsWithActions).toEqual(['id', 'name']);
  });

  it('should update data on changes', () => {
    const newData = [...testData, { id: 3, name: 'Item 3' }];
    component.data = newData;
    component.ngOnChanges({
      data: new SimpleChange(testData, newData, false)
    });
    fixture.detectChanges();

    expect(component.dataSource.data).toEqual(newData);
  });

  it('should render correct columns in template', () => {
    fixture.detectChanges();
    
    const table = fixture.nativeElement.querySelector('table[mat-table]');
    expect(table).toBeTruthy();
    
    const headers = table.querySelectorAll('th[mat-header-cell]');
    expect(headers.length).toBe(2);
    
    expect(headers[0].textContent?.trim()).toBe('ID');
    expect(headers[1].textContent?.trim()).toBe('Name');
    
    const rows = table.querySelectorAll('tr[mat-row]');
    expect(rows.length).toBe(testData.length);
  });


  it('should render actions column when actions exist', async () => {
    component.actions = testActions;
    fixture.detectChanges();
    await fixture.whenStable();
  
    const headerCells = fixture.nativeElement.querySelectorAll('th[mat-header-cell]');
    expect(headerCells.length).toBe(3);
    expect(headerCells[0].textContent.trim()).toBe('ID');
    expect(headerCells[1].textContent.trim()).toBe('Name');
    expect(headerCells[2].textContent.trim()).toBe('Actions');
  });

  it('should handle undefined displayedColumns', () => {
    component.displayedColumns = undefined as any;
    fixture.detectChanges();
    expect(component.displayedColumnsWithActions).toEqual([]);
  });

  it('should handle undefined data', () => {
    component.data = undefined as any;
    component.ngOnChanges({
      data: new SimpleChange(testData, null, false)
    });
    fixture.detectChanges();
    
    expect(component.dataSource.data).toEqual([]);
  });

  it('should handle null data input', () => {
    component.data = null as any;
    fixture.detectChanges();
    expect(component.dataSource.data).toEqual([]);
  });
  
  it('should handle undefined columns input', () => {
    component.columns = undefined as any;
    fixture.detectChanges();
    expect(component.columns).toEqual([]);
  });
  
  it('should call connectPaginator when data changes', () => {
    const spy = spyOn(component as unknown as { connectPaginator: () => void }, 'connectPaginator');
    
    component.data = [...testData];
    fixture.detectChanges();
    
    expect(spy).toHaveBeenCalled();
  });
});
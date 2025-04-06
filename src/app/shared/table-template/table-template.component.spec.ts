/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, SimpleChange } from '@angular/core';

import { TableTemplateComponent, TableAction, TableColumn } from './table-template.component';
import { MaterialModule } from 'src/app/material/material.module';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

describe('TableTemplateComponent', () => {
  let component: TableTemplateComponent<any>;
  let fixture: ComponentFixture<TableTemplateComponent<any>>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ TableTemplateComponent, MaterialModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

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
      cell: (element: TestItem) => `${element.id}` // Required property
    },
    { 
      name: 'name', 
      header: 'Name',
      cell: (element: TestItem) => element.name // Required property
    }
  ];

  const testActions: TableAction[] = [
    { icon: 'Edit', tooltip: 'edit', action: () => {} }
  ];

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty data', () => {
    fixture.detectChanges();
    expect(component.dataSource.data).toEqual([]);
  });

  it('should set input data correctly', () => {
    component.data = testData;
    component.columns = testColumns;
    component.displayedColumns = ['id', 'name'];
    fixture.detectChanges();

    expect(component.dataSource.data).toEqual(testData);
    expect(component.displayedColumns).toEqual(['id', 'name']);
  });

  it('should add actions column when actions exist', () => {
    component.actions = testActions;
    component.displayedColumns = ['id', 'name'];
    fixture.detectChanges();

    expect(component.displayedColumnsWithActions).toEqual(['id', 'name', 'actions']);
  });

  it('should not add actions column when no actions', () => {
    component.actions = [];
    component.displayedColumns = ['id', 'name'];
    fixture.detectChanges();

    expect(component.displayedColumnsWithActions).toEqual(['id', 'name']);
  });

  it('should update data on changes', () => {
    component.data = [];
    component.columns = testColumns;
    fixture.detectChanges();

    component.ngOnChanges({
      data: {
        currentValue: testData,
        previousValue: [],
        firstChange: false,
        isFirstChange: () => false
      }
    });

    expect(component.dataSource.data).toEqual(testData);
  });

  it('should set paginator after view init', () => {
    component.data = testData;
    fixture.detectChanges();

    const paginator = fixture.debugElement.query(By.directive(MatPaginator));
    expect(paginator).toBeTruthy();
    
    component.ngAfterViewInit();
    expect(component.dataSource.paginator).toBeDefined();
  });

  it('should render correct columns in template', () => {
    component.data = testData;
    component.columns = testColumns;
    component.displayedColumns = ['id', 'name'];
    fixture.detectChanges();

    const headerCells = fixture.debugElement.queryAll(By.css('mat-header-cell'));
    expect(headerCells.length).toBe(2);
    expect(headerCells[0].nativeElement.textContent.trim()).toBe('ID');
    expect(headerCells[1].nativeElement.textContent.trim()).toBe('Name');
  });

  it('should render actions column when actions exist', () => {
    component.data = testData;
    component.columns = testColumns;
    component.displayedColumns = ['id', 'name'];
    component.actions = testActions;
    fixture.detectChanges();

    const headerCells = fixture.debugElement.queryAll(By.css('mat-header-cell'));
    expect(headerCells.length).toBe(3);
    expect(headerCells[2].nativeElement.textContent.trim()).toBe('');
  });

  it('should handle undefined displayedColumns', () => {
    component.actions = [];
    component.displayedColumns = undefined as any;
    expect(component.displayedColumnsWithActions).toEqual([]);
  });

  it('should handle undefined data', () => {
    const mockDataSource = { data: [] };
    component.dataSource = mockDataSource as any;
    component.data = undefined as any;
    
    component.ngOnChanges({
      data: new SimpleChange(null, null, false)
    });
    
    expect(mockDataSource.data).toEqual([]);
  });

});

/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, SimpleChange } from '@angular/core';

import { TableTemplateComponent, TableAction, TableColumn } from './table-template.component';
import { MaterialModule } from 'src/app/material/material.module';
import { MatPaginator } from '@angular/material/paginator';

import { ExportPdfService } from './export-pdf.service';

describe('TableTemplateComponent', () => {
  let component: TableTemplateComponent<any>;
  let fixture: ComponentFixture<TableTemplateComponent<any>>;
  let mockPdfService: jasmine.SpyObj<ExportPdfService>;
  let mockJsPDF: any;

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
    mockJsPDF = {
      text: jasmine.createSpy('text').and.returnValue({}),
      save: jasmine.createSpy('save'),
      setFont: jasmine.createSpy('setFont'),
      setFontSize: jasmine.createSpy('setFontSize')
    };

    mockPdfService = jasmine.createSpyObj('ExportPdfService', ['crearPdf', 'agregarAutoTable']);
    mockPdfService.crearPdf.and.returnValue(mockJsPDF);

    TestBed.configureTestingModule({
      imports: [ 
        TableTemplateComponent,
        MaterialModule,
        MatPaginator
      ],
      providers: [
        { provide: ExportPdfService, useValue: mockPdfService }
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

  describe('exportarComoCSV', () => {
    const testData = [
      { id: 1, name: 'Test Item' },
      { id: 2, name: 'Another Item' }
    ];

    const testColumns: TableColumn[] = [
      { 
        name: 'id', 
        header: 'ID',
        cell: (element: any) => element.id.toString()
      },
      { 
        name: 'name', 
        header: 'Name',
        cell: (element: any) => element.name
      }
    ];

    beforeEach(() => {
      component.data = testData;
      component.columns = testColumns;
      component.displayedColumns = ['id', 'name'];
    });

    describe('generarContenidoCSV', () => {
      it('should generate correct CSV content', () => {
        const result = component.generarContenidoCSV();
        const lines = result?.split('\n') || [];
        
        expect(lines[0]).toBe('ID,Name');
        expect(lines[1]).toBe('"1","Test Item"');
        expect(lines[2]).toBe('"2","Another Item"');
      });

      it('should return null for empty data', () => {
        component.data = [];
        expect(component.generarContenidoCSV()).toBeNull();
      });

      it('should escape special characters', () => {
        component.data = [{ id: 1, name: 'Item with "quotes" and, comma' }];
        const result = component.generarContenidoCSV();
        expect(result).toContain('"Item with ""quotes"" and, comma"');
      });

      it('should only include displayed columns', () => {
        component.displayedColumns = ['id'];
        const result = component.generarContenidoCSV();
        expect(result).toContain('ID');
        expect(result).not.toContain('Name');
      });
    });

    describe('exportarComoCSV', () => {
      it('should not create blob for empty data', () => {
        component.data = [];
        const blobSpy = spyOn(window, 'Blob');
        component.exportarComoCSV();
        expect(blobSpy).not.toHaveBeenCalled();
      });

      it('should create download link when data exists', () => {
        const createElementSpy = spyOn(document, 'createElement').and.callThrough();
        const appendChildSpy = spyOn(document.body, 'appendChild');
        const removeChildSpy = spyOn(document.body, 'removeChild');
        
        component.exportarComoCSV();
        
        expect(createElementSpy).toHaveBeenCalledWith('a');
        expect(appendChildSpy).toHaveBeenCalled();
        expect(removeChildSpy).toHaveBeenCalled();
      });
    });
  });

  describe('exportar PDF', () => {
    describe('generarContenidoPDF', () => {
      beforeEach(() => {
        component.data = [...testData];
        component.columns = [...testColumns];
        component.displayedColumns = ['id', 'name'];
      });

      it('should return null for empty data', () => {
        component.data = [];
        expect(component.generarContenidoPDF()).toBeNull();
      });

      it('should return correct headers and data', () => {
        const result = component.generarContenidoPDF();
        expect(result).toEqual({
          headers: ['ID', 'Name'],
          data: [['1', 'Item 1'], ['2', 'Item 2']]
        });
      });

      it('should only include displayed columns', () => {
        component.displayedColumns = ['id'];
        const result = component.generarContenidoPDF();
        expect(result).toEqual({
          headers: ['ID'],
          data: [['1'], ['2']]
        });
      });
    });

    describe('exportarComoPDF', () => {
      it('should create PDF with correct content', () => {
        spyOn(component, 'generarContenidoPDF').and.returnValue({
          headers: ['ID', 'Name'],
          data: [['1', 'Item 1'], ['2', 'Item 2']]
        });

        component.exportarComoPDF();

        expect(mockPdfService.crearPdf).toHaveBeenCalled();
        expect(mockJsPDF.text).toHaveBeenCalledWith('', 14, 16);
        expect(mockPdfService.agregarAutoTable).toHaveBeenCalledWith(
          mockJsPDF,
          jasmine.objectContaining({
            head: [['ID', 'Name']],
            body: [['1', 'Item 1'], ['2', 'Item 2']],
            startY: 20
          })
        );
        expect(mockJsPDF.save).toHaveBeenCalledWith('export.pdf');
      });
    });
  });

  describe('Checkbox functionality', () => {
    beforeEach(() => {
      component.data = [...testData];
      component.columns = [...testColumns];
      component.displayedColumns = ['id', 'name'];
    });

    describe('toggleItemSelection', () => {
      it('should add item to selection when not selected', () => {
        const item = testData[0];
        expect(component.isItemSelected(item)).toBeFalse();
        
        component.toggleItemSelection(item);
        
        expect(component.isItemSelected(item)).toBeTrue();
        expect(component['_selectedItems'].size).toBe(1);
      });

      it('should remove item from selection when already selected', () => {
        const item = testData[0];
        component['_selectedItems'].add(item);
        
        component.toggleItemSelection(item);
        
        expect(component.isItemSelected(item)).toBeFalse();
        expect(component['_selectedItems'].size).toBe(0);
      });

      it('should call selectionChanged callback when provided', () => {
        const selectionChangedSpy = jasmine.createSpy('selectionChanged');
        component.checkboxConfig = {
          enabled: true,
          selectionChanged: selectionChangedSpy
        };
        
        component.toggleItemSelection(testData[0]);
        
        expect(selectionChangedSpy).toHaveBeenCalledWith([testData[0]]);
      });

      it('should update selectedItems array when provided', () => {
        const selectedItems: any[] = [];
        component.checkboxConfig = {
          enabled: true,
          selectedItems: selectedItems
        };
        
        component.toggleItemSelection(testData[0]);
        
        expect(selectedItems).toEqual([testData[0]]);
      });
    });

    describe('isItemSelected', () => {
      it('should return true when item is selected', () => {
        component['_selectedItems'].add(testData[0]);
        expect(component.isItemSelected(testData[0])).toBeTrue();
      });

      it('should return false when item is not selected', () => {
        expect(component.isItemSelected(testData[0])).toBeFalse();
      });
    });

    describe('toggleAllSelection', () => {
      it('should select all items when none are selected', () => {
        component.toggleAllSelection();
        
        expect(component.isAllSelected()).toBeTrue();
        expect(component['_selectedItems'].size).toBe(2);
      });

      it('should deselect all items when all are selected', () => {
        component['_selectedItems'].add(testData[0]);
        component['_selectedItems'].add(testData[1]);
        
        component.toggleAllSelection();
        
        expect(component.isAllSelected()).toBeFalse();
        expect(component['_selectedItems'].size).toBe(0);
      });

      it('should call selectionChanged callback when provided', () => {
        const selectionChangedSpy = jasmine.createSpy('selectionChanged');
        component.checkboxConfig = {
          enabled: true,
          selectionChanged: selectionChangedSpy
        };
        
        component.toggleAllSelection();
        
        expect(selectionChangedSpy).toHaveBeenCalledWith(testData);
      });

      it('should update selectedItems array when provided', () => {
        const selectedItems: any[] = [];
        component.checkboxConfig = {
          enabled: true,
          selectedItems: selectedItems
        };
        
        component.toggleAllSelection();
        
        expect(selectedItems).toEqual(testData);
      });
    });

    describe('isAllSelected', () => {
      it('should return true when all items are selected', () => {
        component['_selectedItems'].add(testData[0]);
        component['_selectedItems'].add(testData[1]);
        
        expect(component.isAllSelected()).toBeTrue();
      });

      it('should return false when not all items are selected', () => {
        component['_selectedItems'].add(testData[0]);
        
        expect(component.isAllSelected()).toBeFalse();
      });

      it('should return false when data is empty', () => {
        component.data = [];
        component['_selectedItems'].add(testData[0]);
        
        expect(component.isAllSelected()).toBeFalse();
      });
    });

    describe('displayedColumnsWithActions with checkboxes', () => {
      it('should include select column when checkboxes are enabled', () => {
        component.checkboxConfig = { enabled: true };
        expect(component.displayedColumnsWithActions).toEqual(['select', 'id', 'name']);
      });

      it('should include both select and actions columns when both are enabled', () => {
        component.checkboxConfig = { enabled: true };
        component.actions = testActions;
        expect(component.displayedColumnsWithActions).toEqual(['select', 'id', 'name', 'actions']);
      });
    });
  });
});
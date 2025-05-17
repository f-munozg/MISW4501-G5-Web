import { Component, OnChanges, AfterViewInit, Input, ViewChild, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from '../../material/material.module';
/* --- PDF dependencies  --- */
import { ExportPdfService } from './export-pdf.service';
/* ------------------------- */

export interface TableColumn {
  name: string;
  header: string;
  cell: (element: any) => string;
}

export interface TableAction {
  icon: string;
  tooltip: string;
  action: (element: any) => void;
}

@Component({
  selector: 'app-table-template',
  templateUrl: './table-template.component.html',
  styleUrls: ['./table-template.component.css'],
  imports: [ MaterialModule, CommonModule ]
})
export class TableTemplateComponent<T> implements AfterViewInit, OnChanges {
  private _data: T[] = [];
  private _columns: TableColumn[] = [];
  private _displayedColumns: string[] = [];

  @Input() 
  set data(value: T[]) {
    this._data = value || [];
    this.updateDataSource();
  }
  get data(): T[] {
    return this._data;
  }

  @Input() 
  set columns(value: TableColumn[]) {
    this._columns = value || [];
    this.updateDisplayedColumns();
  }
  get columns(): TableColumn[] {
    return this._columns;
  }

  @Input() 
  set displayedColumns(value: string[]) {
    this._displayedColumns = value || [];
    this.updateDisplayedColumns();
  }
  get displayedColumns(): string[] {
    return this._displayedColumns;
  }

  @Input() actions: TableAction[] = [];
  
  dataSource = new MatTableDataSource<T>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.connectPaginator();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('data' in changes) {
      this.updateDataSource();
    }
    if ('actions' in changes || 'columns' in changes) {
      this.updateDisplayedColumns();
    }
  }

  private updateDataSource(): void {
    this.dataSource.data = [...this._data];
    this.connectPaginator();
  }

  private updateDisplayedColumns(): void {
    this._displayedColumns = [...this._displayedColumns];
  }

  private connectPaginator(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  get displayedColumnsWithActions(): string[] {
    const baseColumns = this._displayedColumns;
    return this.actions?.length ? [...baseColumns, 'actions'] : baseColumns;
  }

  generarContenidoCSV(): string | null {
    if (!this._data.length) return null;

    // Se preparan los headers
    const headers = this._columns
      .filter(column => this._displayedColumns.includes(column.name))
      .map(column => column.header);

    // Se prepara las filas de la tabla
    const dataRows = this._data.map(item => {
      return this._columns
        .filter(column => this._displayedColumns.includes(column.name))
        .map(column => {
          // Para manejar la potencial presencia de comillas
          const cellValue = column.cell(item);
          return `"${cellValue?.toString().replace(/"/g, '""')}"`;
        });
    });

    // Se combina la información en formato csv
    return [
      headers.join(','),
      ...dataRows.map(row => row.join(','))
    ].join('\n');
  }

  exportarComoCSV(): void {
    const csvContent = this.generarContenidoCSV();
    if (!csvContent) return;

    // Se prepara para la descarga
    const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  constructor(private pdfService: ExportPdfService) {}

  generarContenidoPDF(): { headers: string[], data: any[][] } | null {
    if (!this._data.length) return null;

    // Prepara los headers
    const headers = this._columns
      .filter(column => this._displayedColumns.includes(column.name))
      .map(column => column.header);

    // Se prepara la info de la tabla
    const data = this._data.map(item => {
      return this._columns
        .filter(column => this._displayedColumns.includes(column.name))
        .map(column => column.cell(item));
    });

    return { headers, data };
  }

  exportarComoPDF(): void {
    const pdfContent = this.generarContenidoPDF();
    if (!pdfContent) return;

    const { headers, data } = pdfContent;
    
    // Se inicializa el documento PDF
    const doc = this.pdfService.crearPdf();
    
    // El título...
    doc.text('', 14, 16);
    
    // Y se añade la tabla usando el plugin autoTable
    this.pdfService.agregarAutoTable(doc, {
      head: [headers],
      body: data,
      startY: 20,
      styles: {
        cellPadding: 2,
        fontSize: 10,
        valign: 'middle'
      },
      headStyles: {
        fillColor: [164, 224, 164],
        textColor: 0,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });

    // Se guarda el PDF con la info
    doc.save('export.pdf');
  }
}


import { Component, OnChanges, AfterViewInit, Input, ViewChild, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from '../../material/material.module';

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
}


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
export class TableTemplateComponent<T> implements AfterViewInit, OnChanges  {

  @Input() data: T[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() displayedColumns: string[] = [];
  @Input() actions: TableAction[] = [];
  
  dataSource = new MatTableDataSource<T>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  get displayedColumnsWithActions(): string[] {
    const baseColumns = this.displayedColumns || [];
    return this.actions?.length > 0 ? [...baseColumns, 'actions'] : baseColumns;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] || changes['actions']) {
      this.dataSource.data = this.data || [];
      this.displayedColumns = [...(this.displayedColumns || [])];
    }
  }

}


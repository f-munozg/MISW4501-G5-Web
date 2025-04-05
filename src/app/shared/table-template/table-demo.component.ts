import { Component } from '@angular/core';
import { ELEMENT_DATA } from './mock-data';
import { TableTemplateComponent } from './table-template.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';

@Component({
  selector: 'app-table-demo',
  imports: [TableTemplateComponent, CommonModule, MaterialModule],
  template: `
    <h2>Table Component Demo</h2>
    <app-table-template
      [data]="elements"
      [columns]="columns"
      [displayedColumns]="displayedColumns"
      [actions]="actions"
    ></app-table-template>
  `
})
export class TableDemoComponent {
  // Información a visualizar
  elements = ELEMENT_DATA;
  
  // Configuración de cada columna
  columns = [
    { name: 'id', header: 'ID', cell: (e: any) => e.id },
    { name: 'name', header: 'Element', cell: (e: any) => e.name },
    { name: 'weight', header: 'Atomic Weight', cell: (e: any) => e.weight.toFixed(4) },
    { name: 'symbol', header: 'Symbol', cell: (e: any) => e.symbol }
  ];

  // Columnas a visualizar en el orden que se busca
  displayedColumns = ['id', 'name', 'weight', 'symbol'];
  
  // Columna con los botones de acciones
  actions = [
    /* Esto se deja comentado para no incluir la columna con botones
    {
      icon: 'info',
      tooltip: 'View details',
      action: (element: any) => this.viewDetails(element)
    }
    */
  ];

  viewDetails(element: any) {
    console.log('Viewing:', element);
    // Espacio para agregar lógica de visualización adicional
  }
}
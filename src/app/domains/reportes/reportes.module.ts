import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { DefaultWindowComponent } from '../../shared/default-window/default-window.component';
import { TableTemplateComponent } from '../../shared/table-template/table-template.component';

import { ReporteMenuComponent } from './reporte-menu/reporte-menu.component';
import { ReporteVentasComponent } from './reporte-ventas/reporte-ventas.component';
import { ReporteVendedorComponent } from './reporte-vendedor/reporte-vendedor.component';
import { ReporteRotacionInventarioComponent } from './reporte-rotacion-inventario/reporte-rotacion-inventario.component';

@NgModule({
  declarations: [
    ReporteMenuComponent,
    ReporteVentasComponent,
    ReporteVendedorComponent,
    ReporteRotacionInventarioComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    DefaultWindowComponent,
    TableTemplateComponent,
    RouterModule.forRoot([])
  ]
})
export class ReportesModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';

import { DefaultWindowComponent } from 'src/app/shared/default-window/default-window.component';
import { TableTemplateComponent } from 'src/app/shared/table-template/table-template.component';

import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ConsultaVentasComponent } from './consulta-ventas/consulta-ventas.component';

@NgModule({
  declarations: [
    ConsultaVentasComponent
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
export class VentasModule { }

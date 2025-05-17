import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { DefaultWindowComponent } from 'src/app/shared/default-window/default-window.component';
import { TableTemplateComponent } from 'src/app/shared/table-template/table-template.component';

import { OptimizacionComprasComponent } from './optimizacion-compras/optimizacion-compras.component';

@NgModule({
  declarations: [
    OptimizacionComprasComponent
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
export class ComprasModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { DefaultWindowComponent } from 'src/app/shared/default-window/default-window.component';
import { TableTemplateComponent } from 'src/app/shared/table-template/table-template.component';

import { CargaProductoComponent } from './carga-producto/carga-producto.component';
import { CargaMasivaProductosComponent } from './carga-masiva-productos/carga-masiva-productos.component';

@NgModule({
  declarations: [
    CargaProductoComponent,
    CargaMasivaProductosComponent,
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
export class ProductosModule { }

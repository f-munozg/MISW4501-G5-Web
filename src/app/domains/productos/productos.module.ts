import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';
import { DefaultWindowComponent } from 'src/app/shared/default-window/default-window.component';
import { CargaProductoComponent } from './carga-producto/carga-producto.component';


@NgModule({
  declarations: [
    CargaProductoComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    DefaultWindowComponent
  ]
})
export class ProductosModule { }

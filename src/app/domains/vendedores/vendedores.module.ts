import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';
import { DefaultWindowComponent } from 'src/app/shared/default-window/default-window.component';
import { RegistroVendedoresComponent } from './registro-vendedores/registro-vendedores.component';


@NgModule({
  declarations: [
    RegistroVendedoresComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    DefaultWindowComponent
  ]
})
export class VendedoresModule { }

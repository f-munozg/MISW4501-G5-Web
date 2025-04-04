import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';
import { DefaultWindowComponent } from 'src/app/shared/default-window/default-window.component';
import { ConsultaVentasComponent } from './consulta-ventas/consulta-ventas.component';



@NgModule({
  declarations: [
    ConsultaVentasComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    DefaultWindowComponent
  ]
})
export class VentasModule { }

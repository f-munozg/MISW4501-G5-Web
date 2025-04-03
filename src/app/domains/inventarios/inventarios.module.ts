import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';
import { DefaultWindowComponent } from 'src/app/shared/default-window/default-window.component';
import { ConsultaInventarioComponent } from './consulta-inventario/consulta-inventario.component';

@NgModule({
  declarations: [
    ConsultaInventarioComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    DefaultWindowComponent
  ]
})
export class InventariosModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';
import { DefaultWindowComponent } from 'src/app/shared/default-window/default-window.component';
import { TableTemplateComponent } from 'src/app/shared/table-template/table-template.component';

import { ConsultaInventarioComponent } from './consulta-inventario/consulta-inventario.component';
import { ConsultaProductoBodegaComponent } from './consulta-producto-bodega/consulta-producto-bodega.component';

@NgModule({
  declarations: [
    ConsultaInventarioComponent,
    ConsultaProductoBodegaComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    DefaultWindowComponent,
    TableTemplateComponent
  ]
})
export class InventariosModule { }

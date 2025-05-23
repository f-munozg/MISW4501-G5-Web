import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { DefaultWindowComponent } from 'src/app/shared/default-window/default-window.component';
import { TableTemplateComponent } from 'src/app/shared/table-template/table-template.component';

import { ConsultaInventarioComponent } from './consulta-inventario/consulta-inventario.component';
import { ConsultaProductoBodegaComponent } from './consulta-producto-bodega/consulta-producto-bodega.component';
import { RegistroMovimientoInventarioComponent } from './registro-movimiento-inventario/registro-movimiento-inventario.component';
import { GestionAlertasInventarioCriticoComponent } from './gestion-alertas-inventario-critico/gestion-alertas-inventario-critico.component';

@NgModule({
  declarations: [
    ConsultaInventarioComponent,
    ConsultaProductoBodegaComponent,
    RegistroMovimientoInventarioComponent,
    GestionAlertasInventarioCriticoComponent,
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
export class InventariosModule { }

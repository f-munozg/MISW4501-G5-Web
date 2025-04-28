import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'

import { TableTemplateComponent } from 'src/app/shared/table-template/table-template.component';
import { DefaultWindowComponent } from 'src/app/shared/default-window/default-window.component';

import { RegistroFabricantesComponent } from './registro-fabricantes/registro-fabricantes.component';
import { GestionPortafolioComponent } from './gestion-portafolio/gestion-portafolio.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    RegistroFabricantesComponent,
    GestionPortafolioComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    DefaultWindowComponent,
    ReactiveFormsModule,
    TableTemplateComponent,
    HttpClientModule,
    RouterModule.forRoot([]),
  ]
})
export class FabricantesModule { }

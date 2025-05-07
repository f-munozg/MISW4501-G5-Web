import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { DefaultWindowComponent } from '../../shared/default-window/default-window.component';
import { TableTemplateComponent } from '../../shared/table-template/table-template.component';

import { ReglasMenuComponent } from './reglas-menu/reglas-menu.component';
import { ReglasLegalesComponent } from './reglas-legales/reglas-legales.component';
import { ReglasComercialesComponent } from './reglas-comerciales/reglas-comerciales.component';
import { ReglasTributariasComponent } from './reglas-tributarias/reglas-tributarias.component';

@NgModule({
  declarations: [
    ReglasMenuComponent,
    ReglasLegalesComponent,
    ReglasTributariasComponent,
    ReglasComercialesComponent,
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
export class ReglasModule { }

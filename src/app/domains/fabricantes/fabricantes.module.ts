import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'

import { DefaultWindowComponent } from 'src/app/shared/default-window/default-window.component';
import { RegistroFabricantesComponent } from './registro-fabricantes/registro-fabricantes.component';


@NgModule({
  declarations: [
    RegistroFabricantesComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    DefaultWindowComponent,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class FabricantesModule { }

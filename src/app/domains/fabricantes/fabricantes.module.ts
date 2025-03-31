import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';
import { DefaultWindowComponent } from 'src/app/shared/default-window/default-window.component';
import { RegistroFabricantesComponent } from './registro-fabricantes/registro-fabricantes.component';


@NgModule({
  declarations: [
    RegistroFabricantesComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    DefaultWindowComponent
  ]
})
export class FabricantesModule { }

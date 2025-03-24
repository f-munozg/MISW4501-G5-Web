import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginMainComponent } from './login-main/login-main.component';
import { MaterialModule } from 'src/app/material/material.module';



@NgModule({
  declarations: [
    LoginMainComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class LoginModule { }

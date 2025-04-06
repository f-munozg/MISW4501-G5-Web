import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginMainComponent } from './login-main/login-main.component';
import { MaterialModule } from 'src/app/material/material.module';
import { RecoveryContainerComponent } from './recovery-container/recovery-container.component';
import { RecoveryModalComponent } from './recovery-modal/recovery-modal.component';
import { RecoveryUserComponent } from './recovery-user/recovery-user.component';
import { RecoveryPasswordComponent } from './recovery-password/recovery-password.component';



@NgModule({
  declarations: [
    LoginMainComponent,
    RecoveryContainerComponent,
    RecoveryModalComponent,
    RecoveryUserComponent,
    RecoveryPasswordComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    RecoveryContainerComponent
  ]
})
export class LoginModule { }

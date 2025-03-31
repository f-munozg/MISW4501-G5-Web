import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginMainComponent } from './domains/login/login-main/login-main.component';
import { RecoveryContainerComponent } from './domains/login/recovery-container/recovery-container.component';
import { DefaultWindowComponent } from './shared/default-window/default-window.component';
import { RegistroFabricantesComponent } from './domains/fabricantes/registro-fabricantes/registro-fabricantes.component';

const routes: Routes = [
  {path: 'login', component: LoginMainComponent},
  {path: 'recover', component: RecoveryContainerComponent},
  {path: 'menu', component: DefaultWindowComponent},
  {path: 'fabricantes/registro', component: RegistroFabricantesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

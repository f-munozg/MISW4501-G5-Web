import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginMainComponent } from './domains/login/login-main/login-main.component';
import { RecoveryContainerComponent } from './domains/login/recovery-container/recovery-container.component';
import { TestContainerComponent } from './shared/test-container/test-container.component';

const routes: Routes = [
  {path: 'login', component: LoginMainComponent},
  {path: 'recover', component: RecoveryContainerComponent},
  {path: 'test-container', component: TestContainerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

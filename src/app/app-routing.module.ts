import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginMainComponent } from './domains/login/login-main/login-main.component';
import { RecoveryContainerComponent } from './domains/login/recovery-container/recovery-container.component';
import { DefaultWindowComponent } from './shared/default-window/default-window.component';
import { RegistroFabricantesComponent } from './domains/fabricantes/registro-fabricantes/registro-fabricantes.component';
import { CargaProductoComponent } from './domains/productos/carga-producto/carga-producto.component';
import { TableTemplateComponent } from './material/table-template/table-template.component';
import { TableDemoComponent } from './material/table-template/table-demo.component';
import { ConsultaInventarioComponent } from './domains/inventarios/consulta-inventario/consulta-inventario.component';

const routes: Routes = [
  {path: 'login', component: LoginMainComponent},
  {path: 'recover', component: RecoveryContainerComponent},
  {path: 'menu', component: DefaultWindowComponent},
  {path: 'fabricantes/registro', component: RegistroFabricantesComponent},
  {path: 'productos/carga_producto', component: CargaProductoComponent},
  {path: 'tabla/container', component: TableTemplateComponent}, // Testing
  {path: 'tabla/demo', component: TableDemoComponent}, // Testing
  {path: 'inventario/consulta', component: ConsultaInventarioComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

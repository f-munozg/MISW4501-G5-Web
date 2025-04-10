import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginMainComponent } from './domains/login/login-main/login-main.component';
import { RecoveryContainerComponent } from './domains/login/recovery-container/recovery-container.component';
import { DefaultWindowComponent } from './shared/default-window/default-window.component';
import { RegistroFabricantesComponent } from './domains/fabricantes/registro-fabricantes/registro-fabricantes.component';
import { CargaProductoComponent } from './domains/productos/carga-producto/carga-producto.component';
import { TableTemplateComponent } from './shared/table-template/table-template.component';
import { TableDemoComponent } from './shared/table-template/table-demo.component';
import { ConsultaInventarioComponent } from './domains/inventarios/consulta-inventario/consulta-inventario.component';
import { ConsultaVentasComponent } from './domains/ventas/consulta-ventas/consulta-ventas.component';
import { ConsultaProductoBodegaComponent } from './domains/inventarios/consulta-producto-bodega/consulta-producto-bodega.component';
import { RegistroVendedoresComponent } from './domains/vendedores/registro-vendedores/registro-vendedores.component';

const routes: Routes = [
  {path: 'login', component: LoginMainComponent},
  {path: 'recover', component: RecoveryContainerComponent},
  {path: 'menu', component: DefaultWindowComponent},
  {path: 'fabricantes/registro', component: RegistroFabricantesComponent},
  {path: 'productos/carga_producto', component: CargaProductoComponent},
  {path: 'tabla/container', component: TableTemplateComponent}, // Testing
  {path: 'tabla/demo', component: TableDemoComponent}, // Testing
  {path: 'inventario/consulta', component: ConsultaInventarioComponent},
  {path: 'ventas/consulta', component: ConsultaVentasComponent},
  {path: 'inventario/consulta_producto_bodega', component: ConsultaProductoBodegaComponent},
  {path: 'vendedores/registro', component: RegistroVendedoresComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

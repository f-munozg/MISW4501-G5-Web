import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginMainComponent } from './domains/login/login-main/login-main.component';
import { RecoveryContainerComponent } from './domains/login/recovery-container/recovery-container.component';
import { DefaultWindowComponent } from './shared/default-window/default-window.component';

// Fabricantes
import { RegistroFabricantesComponent } from './domains/fabricantes/registro-fabricantes/registro-fabricantes.component';
import { GestionPortafolioComponent } from './domains/fabricantes/gestion-portafolio/gestion-portafolio.component';

// Productos
import { CargaProductoComponent } from './domains/productos/carga-producto/carga-producto.component';
import { CargaMasivaProductosComponent } from './domains/productos/carga-masiva-productos/carga-masiva-productos.component';

// Inventario
import { ConsultaInventarioComponent } from './domains/inventarios/consulta-inventario/consulta-inventario.component';
import { ConsultaProductoBodegaComponent } from './domains/inventarios/consulta-producto-bodega/consulta-producto-bodega.component';

// Ventas y Vendedores
import { ConsultaVentasComponent } from './domains/ventas/consulta-ventas/consulta-ventas.component';
import { RegistroVendedoresComponent } from './domains/vendedores/registro-vendedores/registro-vendedores.component';
import { PlanesDeVentaComponent } from './domains/ventas/planes-de-venta/planes-de-venta.component';

// Testing
import { TableTemplateComponent } from './shared/table-template/table-template.component';
import { TableDemoComponent } from './shared/table-template/table-demo.component';
import { ReglasMenuComponent } from './domains/reglas/reglas-menu/reglas-menu.component';
import { ReglasLegalesComponent } from './domains/reglas/reglas-legales/reglas-legales.component';
import { ReglasTributariasComponent } from './domains/reglas/reglas-tributarias/reglas-tributarias.component';
import { ReglasComercialesComponent } from './domains/reglas/reglas-comerciales/reglas-comerciales.component';

const routes: Routes = [
  /* Login */
  {path: 'login', component: LoginMainComponent},
  {path: 'recover', component: RecoveryContainerComponent},
  
  /* General */
  {path: 'menu', component: DefaultWindowComponent},
  
  /* Fabricantes */
  {path: 'fabricantes/registro', component: RegistroFabricantesComponent},
  {path: 'fabricantes/portafolio', component: GestionPortafolioComponent},

  /* Inventarios */
  {path: 'inventario/consulta', component: ConsultaInventarioComponent},
  {path: 'inventario/consulta_producto_bodega', component: ConsultaProductoBodegaComponent},

  /* Productos */
  {path: 'productos/carga_producto', component: CargaProductoComponent},
  {path: 'productos/editar/:id', component: CargaProductoComponent},
  {path: 'productos/carga_masiva_productos', component: CargaMasivaProductosComponent},

  /* Reglas */
  {
    path: 'reglas',
    children: [
      { path: '', pathMatch: 'full', component: ReglasMenuComponent },
      { path: 'legales', component: ReglasLegalesComponent },
      { path: 'tributarias', component: ReglasTributariasComponent },
      { path: 'comerciales', component: ReglasComercialesComponent }
    ]
  },

  /* Vendedores */
  {path: 'vendedores/registro', component: RegistroVendedoresComponent,
    children: [{ path: 'view', component: RegistroVendedoresComponent }]
  },

  /* Ventas */
  {path: 'ventas/consulta', component: ConsultaVentasComponent},
  {path: 'ventas/planes_de_venta', component: PlanesDeVentaComponent},

  /* Testing */
  {path: 'tabla/container', component: TableTemplateComponent}, 
  {path: 'tabla/demo', component: TableDemoComponent}, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

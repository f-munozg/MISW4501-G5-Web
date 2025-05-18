import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginMainComponent } from './domains/login/login-main/login-main.component';
import { RecoveryContainerComponent } from './domains/login/recovery-container/recovery-container.component';
import { DefaultWindowComponent } from './shared/default-window/default-window.component';

// Compras
import { OptimizacionComprasComponent } from './domains/compras/optimizacion-compras/optimizacion-compras.component';

// Fabricantes
import { RegistroFabricantesComponent } from './domains/fabricantes/registro-fabricantes/registro-fabricantes.component';
import { GestionPortafolioComponent } from './domains/fabricantes/gestion-portafolio/gestion-portafolio.component';

// Inventario
import { ConsultaInventarioComponent } from './domains/inventarios/consulta-inventario/consulta-inventario.component';
import { ConsultaProductoBodegaComponent } from './domains/inventarios/consulta-producto-bodega/consulta-producto-bodega.component';
import { RegistroMovimientoInventarioComponent } from './domains/inventarios/registro-movimiento-inventario/registro-movimiento-inventario.component';
import { GestionAlertasInventarioCriticoComponent } from './domains/inventarios/gestion-alertas-inventario-critico/gestion-alertas-inventario-critico.component';

// Productos
import { CargaProductoComponent } from './domains/productos/carga-producto/carga-producto.component';
import { CargaMasivaProductosComponent } from './domains/productos/carga-masiva-productos/carga-masiva-productos.component';

// Reglas
import { ReglasMenuComponent } from './domains/reglas/reglas-menu/reglas-menu.component';
import { ReglasLegalesComponent } from './domains/reglas/reglas-legales/reglas-legales.component';
import { ReglasTributariasComponent } from './domains/reglas/reglas-tributarias/reglas-tributarias.component';
import { ReglasComercialesComponent } from './domains/reglas/reglas-comerciales/reglas-comerciales.component';

// Reportes
import { ReporteMenuComponent } from './domains/reportes/reporte-menu/reporte-menu.component';
import { ReporteVentasComponent } from './domains/reportes/reporte-ventas/reporte-ventas.component';
import { ReporteVendedorComponent } from './domains/reportes/reporte-vendedor/reporte-vendedor.component';
import { ReporteRotacionInventarioComponent } from './domains/reportes/reporte-rotacion-inventario/reporte-rotacion-inventario.component';

// Rutas
import { GeneracionRutasComponent } from './domains/rutas/generacion-rutas/generacion-rutas.component';

// Ventas y Vendedores
import { ConsultaVentasComponent } from './domains/ventas/consulta-ventas/consulta-ventas.component';
import { RegistroVendedoresComponent } from './domains/vendedores/registro-vendedores/registro-vendedores.component';
import { PlanesDeVentaComponent } from './domains/ventas/planes-de-venta/planes-de-venta.component';

// Testing
import { TableTemplateComponent } from './shared/table-template/table-template.component';
import { TableDemoComponent } from './shared/table-template/table-demo.component';


const routes: Routes = [
  /* Login */
  {path: 'login', component: LoginMainComponent},
  {path: 'recover', component: RecoveryContainerComponent},
  
  /* General */
  {path: 'menu', component: DefaultWindowComponent},

  /* Compras */
  {path: 'compras/optimizacion_compras', component: OptimizacionComprasComponent},

  /* Fabricantes */
  {path: 'fabricantes/registro', component: RegistroFabricantesComponent},
  {path: 'fabricantes/portafolio', component: GestionPortafolioComponent},

  /* Inventarios */
  {path: 'inventario/consulta', component: ConsultaInventarioComponent},
  {path: 'inventario/consulta_producto_bodega', component: ConsultaProductoBodegaComponent},
  {path: 'inventario/registro_movimiento', component: RegistroMovimientoInventarioComponent},
  {path: 'inventario/gestion_alertas_inventario_critico', component: GestionAlertasInventarioCriticoComponent},

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

  /* Reportes */
  {
    path: 'reportes',
    children: [
      { path: '', pathMatch: 'full', component: ReporteMenuComponent },
      { path: 'ventas', component: ReporteVentasComponent },
      { path: 'vendedor', component: ReporteVendedorComponent },
      { path: 'rotacion_inventario', component: ReporteRotacionInventarioComponent },
    ]
  },

  /* Rutas */
  {path: 'rutas/generacion', component: GeneracionRutasComponent},

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

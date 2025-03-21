import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VendedoresComponent } from './domains/vendedores/vendedores.component';
import { ReportesComponent } from './domains/reportes/reportes.component';
import { ReglasComponent } from './domains/reglas/reglas.component';
import { BodegasComponent } from './domains/bodegas/bodegas.component';
import { ComprasComponent } from './domains/compras/compras.component';
import { FabricantesComponent } from './domains/fabricantes/fabricantes.component';
import { InventariosComponent } from './domains/inventarios/inventarios.component';
import { LoginComponent } from './domains/login/login.component';
import { PedidosComponent } from './domains/pedidos/pedidos.component';
import { ProductosComponent } from './domains/productos/productos.component';
import { RutasComponent } from './domains/rutas/rutas.component';
import { UsuariosComponent } from './domains/usuarios/usuarios.component';
import { VentasComponent } from './domains/ventas/ventas.component';

@NgModule({
  declarations: [
    AppComponent,
    BodegasComponent,
    ComprasComponent,
    FabricantesComponent,
    InventariosComponent,
    LoginComponent,
    PedidosComponent,
    ProductosComponent,
    ReglasComponent,
    ReportesComponent,
    RutasComponent,
    UsuariosComponent,
    VendedoresComponent,
    VentasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

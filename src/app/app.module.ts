import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoginModule } from './domains/login/login.module';
import { ComprasModule } from './domains/compras/compras.module';
import { FabricantesModule } from './domains/fabricantes/fabricantes.module';
import { InventariosModule } from './domains/inventarios/inventarios.module';
import { ProductosModule } from './domains/productos/productos.module';
import { ReglasModule } from './domains/reglas/reglas.module';
import { ReportesModule } from './domains/reportes/reportes.module';
import { RutasModule } from './domains/rutas/rutas.module';
import { VendedoresModule } from './domains/vendedores/vendedores.module';
import { VentasModule } from './domains/ventas/ventas.module';

import { DefaultWindowComponent } from './shared/default-window/default-window.component';
import { TableTemplateComponent } from './shared/table-template/table-template.component';
import { TableDemoComponent } from './shared/table-template/table-demo.component'; // Testing

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DefaultWindowComponent,
    LoginModule,
    ComprasModule,
    FabricantesModule,
    InventariosModule,
    ProductosModule,
    ReglasModule,
    ReportesModule,
    RutasModule,
    VendedoresModule,
    VentasModule,
    TableTemplateComponent,
    TableDemoComponent, // Testing
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

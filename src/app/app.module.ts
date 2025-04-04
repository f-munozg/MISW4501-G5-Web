import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoginModule } from './domains/login/login.module';
import { FabricantesModule } from './domains/fabricantes/fabricantes.module';
import { ProductosModule } from './domains/productos/productos.module';
import { InventariosModule } from './domains/inventarios/inventarios.module';
import { VentasModule } from './domains/ventas/ventas.module';
import { VendedoresModule } from './domains/vendedores/vendedores.module';

import { DefaultWindowComponent } from './shared/default-window/default-window.component';
import { TableTemplateComponent } from './material/table-template/table-template.component';
import { TableDemoComponent } from './material/table-template/table-demo.component'; // Testing

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LoginModule,
    DefaultWindowComponent,
    FabricantesModule,
    ProductosModule,
    InventariosModule,
    VentasModule,
    VendedoresModule,
    TableTemplateComponent,
    TableDemoComponent, // Testing
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

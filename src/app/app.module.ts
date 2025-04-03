import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginModule } from './domains/login/login.module';
import { DefaultWindowComponent } from './shared/default-window/default-window.component';
import { FabricantesModule } from './domains/fabricantes/fabricantes.module';
import { ProductosModule } from './domains/productos/productos.module';
import { TableTemplateComponent } from './material/table-template/table-template.component';
import { TableDemoComponent } from './material/table-template/table-demo.component';

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
    TableTemplateComponent,
    TableDemoComponent // Testing
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

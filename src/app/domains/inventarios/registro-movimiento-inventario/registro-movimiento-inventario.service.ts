import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BodegasResponse } from '../../bodegas/bodegas.model';
import { environment } from '../../../../environments/environment'
import { ProductosResponse } from '../../productos/producto.model';


@Injectable({
  providedIn: 'root'
})
export class RegistroMovimientoInventarioService {

  constructor(private http: HttpClient) { }

  getListaBodegas() {
    return this.http.get<BodegasResponse>(environment.apiUrlStock + `/stock/get_warehouses`);
  }

  getListaProductosStock(){
    return this.http.get<any>(environment.apiUrlProducts + `/products`);
  }

  /*
  getListaUsuarios(){
    return ...
  }
  */

}

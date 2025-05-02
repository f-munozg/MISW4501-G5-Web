import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BodegasResponse } from '../inventario.model';
import { environment } from '../../../../environments/environment'
import { ProductosResponse } from '../../ventas/ventas.model';


@Injectable({
  providedIn: 'root'
})
export class RegistroMovimientoInventarioService {

  constructor(private http: HttpClient) { }

  getListaBodegas() {
    return this.http.get<BodegasResponse>(environment.apiUrlStock + `/stock/get_warehouses`);
  }

  getListaProductos(){
    return this.http.get<ProductosResponse>(environment.apiUrlProducts + `/products`);
  }

  

}

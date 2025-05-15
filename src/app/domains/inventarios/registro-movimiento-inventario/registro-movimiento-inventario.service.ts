import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BodegasResponse } from '../../bodegas/bodegas.model';
import { environment } from '../../../../environments/environment'
import { ProductosResponse } from '../../productos/producto.model';
import { RegistroMovimiento } from '../inventario.model';
import { Observable } from 'rxjs';


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

  getListaMovimientos(){
    return this.http.get<RegistroMovimiento[]>(`${environment.apiUrlStock}/stock/movement`);
  }

  postData(formData: any):
  Observable<any>{
    const requestData = {
      product_id: formData.idProducto,
      warehouse_id: formData.fieldBodega,
      quantity: formData.fieldCantidad,
      user: '3fa97477-cdf8-462d-970c-f7b49b25df3a', // hard-coded mientras se trabaja en la autenticación de usuarios
      movement_type: formData.fieldTipoMovimiento
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(`${environment.apiUrlStock}/stock/movement`, requestData, {headers});
  }

}

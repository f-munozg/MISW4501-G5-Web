import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ProductosResponse } from '../../productos/producto.model';
import { ReporteRotacionProducto } from '../reportes.model';

@Injectable({
  providedIn: 'root'
})
export class ReporteRotacionInventarioService {
  private apiUrlGetProducts = environment.apiUrlProducts + `/products`;

  constructor(private http: HttpClient) { }

  getListaProductos(){
    return this.http.get<ProductosResponse>(this.apiUrlGetProducts);
  }

  getRotacionProducto(product_id: string, start_date: string, end_date: string){
    return this.http.get<ReporteRotacionProducto>(
      `${environment.apiUrlStock}/stock/product_rotation?product_id=${product_id}&start_date=${start_date}&end_date=${end_date}`
    );
  }
}

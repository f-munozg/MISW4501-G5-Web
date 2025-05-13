import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ProductosResponse } from '../../productos/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ReporteRotacionInventarioService {
  private apiUrlGetProducts = environment.apiUrlProducts + `/products`;

  constructor(private http: HttpClient) { }

  getListaProductos(){
    return this.http.get<ProductosResponse>(this.apiUrlGetProducts);
  }
}

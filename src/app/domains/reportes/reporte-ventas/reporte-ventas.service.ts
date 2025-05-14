import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ProductosResponse } from '../../productos/producto.model';
import { Observable } from 'rxjs';
import { VendedoresResponse } from '../../vendedores/vendedores.model';

@Injectable({
  providedIn: 'root'
})
export class ReporteVentasService {
  private apiUrlGetProducts = environment.apiUrlProducts + `/products`;

  constructor(private http: HttpClient) { }

  getListaProductos(){
    return this.http.get<ProductosResponse>(this.apiUrlGetProducts);
  }

  getListaVendedores():
  Observable<VendedoresResponse>{
      return this.http.get<VendedoresResponse>(`${environment.apiUrlSellers}/sellers`);
  }

}

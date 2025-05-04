import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VendedoresResponse } from '../../vendedores/vendedores.model';
import { ProductosResponse } from '../../productos/producto.model';

@Injectable({
  providedIn: 'root'
})
export class PlanesDeVentaService {

  private apiUrl = environment.apiUrlSales + `/sales-plans/add`;
  private apiUrlSellers = environment.apiUrlSellers + `/sellers`;
  private apiUrlProducts = environment.apiUrlProducts + `/products`;

constructor(private http: HttpClient) { }

  postPlanVentas(formData: any):
  Observable<any>{

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.apiUrl, formData, {headers});
  }

  getListaVendedores():
  Observable<VendedoresResponse>{
    return this.http.get<VendedoresResponse>(this.apiUrlSellers);
  };

  getListaProductos():
  Observable<ProductosResponse>{
    return this.http.get<ProductosResponse>(this.apiUrlProducts);
  };

}

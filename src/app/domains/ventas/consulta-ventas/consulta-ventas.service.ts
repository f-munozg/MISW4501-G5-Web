import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FabricantesResponse, ProductosResponse } from '../ventas.model';

@Injectable({
  providedIn: 'root'
})
export class ConsultaVentasService {
  private apiUrlGetProviders = environment.apiUrlProviders + `/providers`;
  private apiUrlGetProducts = environment.apiUrlProducts + `/products`;

  constructor(private http: HttpClient) { }

  getListaProductos(){
    return this.http.get<ProductosResponse>(this.apiUrlGetProducts);
  }

  getListaFabricantes(){
    return this.http.get<FabricantesResponse>(this.apiUrlGetProviders);
  }

  getData(formData: any){
    let apiUrl = environment.apiUrlSales + `/sales`;
    const params = new URLSearchParams();
  
  }

}

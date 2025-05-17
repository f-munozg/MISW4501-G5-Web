import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment'
import { FabricantesResponse } from '../../fabricantes/fabricantes.model';
import { OptimizacionComprasResponse } from '../compras.model';

@Injectable({
  providedIn: 'root'
})
export class OptimizacionComprasService {

  constructor(private http: HttpClient) { }

  getListaFabricantes() {
      return this.http.get<FabricantesResponse>(environment.apiUrlProviders + `/providers`);
  }

  getListaProductosStock(){
    return this.http.get<any>(environment.apiUrlProducts + `/products`);
  }

  getComprasSugeridas(idProducto: string, idFabricante: string) {
    const params = new URLSearchParams();

    if (idProducto && idProducto != '') {
      params.append('product_id', idProducto);
    }

    if (idFabricante && idFabricante != '') {
      params.append('provider_id', idFabricante);
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<OptimizacionComprasResponse>(`${environment.apiUrlStock}/stock/optimize_purchases?${params.toString()}`, {headers});
  }

}

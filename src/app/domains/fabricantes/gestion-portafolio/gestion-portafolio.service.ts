import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FabricantePortafolioResponse, FabricantesResponse } from '../../fabricantes/fabricantes.model';
import { Producto } from '../../productos/producto.model';
import { environment } from '../../../../environments/environment'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GestionPortafolioService {

  constructor(private http: HttpClient) { }

  getListaFabricantes():
  Observable<FabricantesResponse> {
    return this.http.get<FabricantesResponse>(environment.apiUrlProviders + `/providers`);
  }

  getPortafolio(provider_id: string) {
    return this.http.get<FabricantePortafolioResponse>(environment.apiUrlProviders + `/providers/${provider_id}`);
  }

  eliminarProducto(product_id: string) {
    return this.http.delete<Producto>(environment.apiUrlProducts + `/products/${product_id}`);
  }
}

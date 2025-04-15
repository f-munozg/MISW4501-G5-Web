import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, InventoryItem, Fabricante, FabricantesResponse } from '../inventario.model';
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ConsultaInventarioService {

  constructor(private http: HttpClient) { }

  getListaFabricantes() {
    return this.http.get<FabricantesResponse>(environment.apiUrlProviders + `/providers`);
  }

  getData(formData: any):
  Observable<ApiResponse<InventoryItem>>{
    let apiUrl = environment.apiUrlStock + `/stock/query`;
    const params = new URLSearchParams();

    let producto = formData.fieldProducto;
    let fabricante = formData.fieldFabricante;
    let categoria = formData.fieldCategoria;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (producto) {
      params.append('product', producto);
    }

    if (fabricante) {
      params.append('provider', fabricante);
    }

    if (categoria) {
      params.append('category', categoria);
    }

    return this.http.get<ApiResponse<InventoryItem>>(`${apiUrl}?${params.toString()}`, {headers});
  }

}

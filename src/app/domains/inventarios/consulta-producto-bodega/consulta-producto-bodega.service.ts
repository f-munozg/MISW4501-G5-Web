import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, ProductInventoryItem } from '../inventario.model';
import { BodegasResponse } from '../../bodegas/bodegas.model';
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ConsultaProductoBodegaService {

  constructor(private http: HttpClient) { }

  getListaBodegas() {
    return this.http.get<BodegasResponse>(environment.apiUrlStock + `/stock/get_warehouses`); // Aquí va la URL del endpoint de Mateo G.
  }

  getData(formData:any):
  Observable<ApiResponse<ProductInventoryItem>>{
    let apiUrl = environment.apiUrlStock + `/stock/product_location`;
    const params = new URLSearchParams();

    if (formData.fieldProducto) {
      params.append('product', formData.fieldProducto); // search se puede cambiar por product dependiendo de Mateo
    }

    if (formData.fieldBodega) {
      params.append('warehouse_id', formData.fieldBodega);
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<ApiResponse<ProductInventoryItem>>(`${apiUrl}?${params.toString()}`, {headers});
  }

}

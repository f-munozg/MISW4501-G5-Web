import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, BodegasResponse, ProductInventoryItem } from '../inventario.model';

@Injectable({
  providedIn: 'root'
})
export class ConsultaProductoBodegaService {

  constructor(private http: HttpClient) { }

  getListaBodegas() {
    return this.http.get<BodegasResponse>('http://localhost:5008/stock/get_warehouses'); // Aquí va la URL del endpoint de Mateo G.
  }

  getData(formData:any):
  Observable<ApiResponse<ProductInventoryItem>>{
    let apiUrl = `http://localhost:5008/stock/product_location`;
    const params = new URLSearchParams();

    let producto = formData.fieldProducto;
    let bodega = formData.fieldBodega;

    if (formData.fieldProducto) {
      params.append('product', formData.fieldProducto);
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

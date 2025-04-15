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
<<<<<<< HEAD
    let apiUrl = `https://backend-stock-143596276526.us-central1.run.app/stock/product_location`;
=======
    let apiUrl = `http://localhost:5008/stock/product_location`;
    const params = new URLSearchParams();
>>>>>>> HU1.1.1

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

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, ProductInventoryItem } from '../inventario.model';

@Injectable({
  providedIn: 'root'
})
export class ConsultaProductoBodegaService {

  constructor(private http: HttpClient) { }

  getListaBodegas() {
    // return this.http.get('https://backend-stock-143596276526.us-central1.run.app/stock/product_location'); // Aquí va la URL del endpoint de Mateo G.
    return this.http.get('http://localhost:5003/stock/product_location');
  }

  getData(formData:any):
  Observable<ApiResponse<ProductInventoryItem>>{
    let apiUrl = ``;

    let producto = formData.fieldProducto;
    let bodega = formData.fieldBodega;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    apiUrl += `?product=${producto}`

    if ( bodega.value != ''){
      apiUrl += `&warehouse_id=${bodega}`
    }

    return this.http.get<ApiResponse<ProductInventoryItem>>(apiUrl);
  }

}

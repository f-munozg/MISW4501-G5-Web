import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, InventoryItem, Fabricante, FabricantesResponse } from '../inventario.model';


@Injectable({
  providedIn: 'root'
})
export class ConsultaInventarioService {

  constructor(private http: HttpClient) { }

  getListaFabricantes() {
    return this.http.get<FabricantesResponse>('http://localhost:5003/providers'); // Aquí va la URL del endpoint de Mateo G.
  }

  getData(formData: any):
  Observable<ApiResponse<InventoryItem>>{
    let apiUrl = `http://localhost:5008/stock/query`
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

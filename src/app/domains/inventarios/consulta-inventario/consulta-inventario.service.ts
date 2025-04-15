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
    return this.http.get<FabricantesResponse>('https://backend-providers-143596276526.us-central1.run.app/providers'); // Aquí va la URL del endpoint de Mateo G.
  }

  getData(formData: any):
  Observable<ApiResponse<InventoryItem>>{
<<<<<<< HEAD
    let apiUrl = `https://backend-stock-143596276526.us-central1.run.app/stock/query`
=======
    let apiUrl = `http://localhost:5008/stock/query`
    const params = new URLSearchParams();
>>>>>>> HU1.1.1

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

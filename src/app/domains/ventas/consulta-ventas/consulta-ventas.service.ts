import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse, FabricantesResponse, ProductosResponse, Venta } from '../ventas.model';

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

  getData(formData: any):
  Observable<Venta[]>{  
    let apiUrl = environment.apiUrlSales + `/sales`;
    const params = new URLSearchParams();
  
    let producto = formData.fieldProducto;
    let fabricante = formData.fieldFabricante;
    let categoria = formData.fieldCategoria;
    let desdeFecha = formData.fieldDesde;
    let hastaFecha = formData.fieldHasta;

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

    if (categoria) {
      params.append('initial_date', desdeFecha);
    }

    if (categoria) {
      params.append('final_date', hastaFecha);
    }

    return this.http.get<Venta[]>(`${apiUrl}?${params.toString()}`, {headers});
  }

}

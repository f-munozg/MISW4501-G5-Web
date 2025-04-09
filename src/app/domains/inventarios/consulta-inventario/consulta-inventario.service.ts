import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultaInventarioService {

  constructor(private http: HttpClient) { }

  getListaFabricantes() {
    return this.http.get(''); // Aquí va la URL del endpoint de Mateo G.
  }

  getData(formData: any):
  Observable<any>{
    let apiUrl = `https://backend-stock-143596276526.us-central1.run.app/stock/query`

    let producto = formData.fieldProducto;
    let fabricante = formData.fieldFabricante;
    let categoria = formData.fieldCategoria;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    apiUrl += `?product=${producto}`

    if ( fabricante.value != ''){
      apiUrl += `&provider=${fabricante}`
    } 
    
    if ( categoria.value != '') {
      apiUrl += `&category=${categoria}`
    }

    return this.http.get<any>(apiUrl);
  }

}

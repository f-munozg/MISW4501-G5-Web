import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FabricantesResponse } from '../producto.model';
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class CargaMasivaProductosService {

  constructor(private http: HttpClient) { }

  getListaFabricantes():
  Observable<FabricantesResponse> {
    return this.http.get<FabricantesResponse>(environment.apiUrlProviders + `/providers`); // Aquí va la URL del endpoint de Mateo G.
  }
}

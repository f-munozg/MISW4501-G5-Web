import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FabricantesResponse } from '../../productos/producto.model';
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class GestionPortafolioService {

  constructor(private http: HttpClient) { }

  getListaFabricantes() {
    return this.http.get<FabricantesResponse>(environment.apiUrlProviders + `/providers`);
  }

}

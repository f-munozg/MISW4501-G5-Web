import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FabricantesResponse } from '../ventas.model';

@Injectable({
  providedIn: 'root'
})
export class ConsultaVentasService {
  private apiUrlGetProviders = environment.apiUrlProviders + `/providers`;
  
  constructor(private http: HttpClient) { }

  getListaFabricantes(){
    return this.http.get<FabricantesResponse>(this.apiUrlGetProviders);
  }

  getData(formData: any){

  }

}

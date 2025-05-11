import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment'
import { ReglaLegal, ReglaLegalResponse } from '../reglas.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReglasLegalesService {

constructor(private http: HttpClient) { }
  
  /* postData() */

  /* editarReglaLegal() */

  getListaReglasLegales():
  Observable<ReglaLegalResponse>{
    return this.http.get<ReglaLegalResponse>(`${environment.apiUrlProviders}/rules/legal/get`);
  }

  eliminarReglaLegal(regla_id: string): 
  Observable<ReglaLegal> {
    return this.http.delete<ReglaLegal>(`${environment.apiUrlProviders}/rules/legal/delete/${regla_id}`)
  }
}

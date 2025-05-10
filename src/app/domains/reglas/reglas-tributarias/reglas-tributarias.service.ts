import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment'
import { ReglaTributaria, ReglaTributariaResponse } from '../reglas.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReglasTributariasService {

constructor(private http: HttpClient) { }

  getListaTributos():
  Observable<ReglaTributariaResponse>{
    return this.http.get<ReglaTributariaResponse>(`${environment.apiUrlProviders}/rules/tax/get`);
  }

  eliminarTributo(regla_id: string): 
  Observable<ReglaTributaria> {
    return this.http.delete<ReglaTributaria>(`${environment.apiUrlProviders}/rules/tax/delete/${regla_id}`)
  }
}

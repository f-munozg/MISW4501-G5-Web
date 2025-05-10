import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment'
import { ReglaTributariaResponse } from '../reglas.model';
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
}

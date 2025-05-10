import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment'
import { ReglaTributaria, ReglaTributariaResponse } from '../reglas.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReglasTributariasService {

constructor(private http: HttpClient) { }

  postData(formData: any):
  Observable<any>{
    const requestData = {
      country: formData.fieldPais,
      type_tax: formData.fieldTipoImpuesto,
      value_tax: formData.fieldValor,
      description: formData.fieldDescripcion
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(`${environment.apiUrlProviders}/rules/tax/add`, requestData, {headers});
  }

  getListaTributos():
  Observable<ReglaTributariaResponse>{
    return this.http.get<ReglaTributariaResponse>(`${environment.apiUrlProviders}/rules/tax/get`);
  }

  eliminarTributo(regla_id: string): 
  Observable<ReglaTributaria> {
    return this.http.delete<ReglaTributaria>(`${environment.apiUrlProviders}/rules/tax/delete/${regla_id}`)
  }
}

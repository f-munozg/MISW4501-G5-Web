import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment'
import { ReglaComercial, ReglaComercialResponse } from '../reglas.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReglasComercialesService {

constructor(private http: HttpClient) { }
  
  postData(formData: any):
  Observable<any>{
    const requestData = {
      country: formData.fieldPais,
      type_commercial_rule: formData.fieldTipoReglaComercial,
      description: formData.fieldDescripcion
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(`${environment.apiUrlProviders}/rules/commercial/add`, requestData, {headers});
  }

  updateReglaComercial(formData: any):
  Observable<any>{
    const requestData = {
      country: formData.fieldPais,
      type_commercial_rule: formData.fieldTipoReglaComercial,
      description: formData.fieldDescripcion
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.put<any>(`${environment.apiUrlProviders}/rules/commercial/update/${formData.id}`, requestData, {headers});
  }

  getListaReglasComerciales():
  Observable<ReglaComercialResponse>{
    return this.http.get<ReglaComercialResponse>(`${environment.apiUrlProviders}/rules/commercial/get`);
  }

  eliminarReglaComercial(regla_id: string): 
  Observable<ReglaComercial> {
    return this.http.delete<ReglaComercial>(`${environment.apiUrlProviders}/rules/commercial/delete/${regla_id}`)
  }
}

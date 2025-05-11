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
  
  postData(formData: any):
  Observable<any>{
    const requestData = {
      country: formData.fieldPais,
      category_product: formData.fieldCategoriaProducto,
      description: formData.fieldDescripcion
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(`${environment.apiUrlProviders}/rules/legal/add`, requestData, {headers});
  }

  updateReglaComercial(formData: any):
  Observable<any>{
    const requestData = {
      country: formData.fieldPais,
      category_product: formData.fieldCategoriaProducto,
      description: formData.fieldDescripcion
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.put<any>(`${environment.apiUrlProviders}/rules/legal/update/${formData.id}`, requestData, {headers});
  }

  getListaReglasLegales():
  Observable<ReglaLegalResponse>{
    return this.http.get<ReglaLegalResponse>(`${environment.apiUrlProviders}/rules/legal/get`);
  }

  eliminarReglaLegal(regla_id: string): 
  Observable<ReglaLegal> {
    return this.http.delete<ReglaLegal>(`${environment.apiUrlProviders}/rules/legal/delete/${regla_id}`)
  }
}

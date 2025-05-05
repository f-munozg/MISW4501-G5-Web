import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { FabricantesResponse } from '../../fabricantes/fabricantes.model';
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class CargaMasivaProductosService {

  private apiUrl = environment.apiUrlProducts + `/products/upload`;

  constructor(private http: HttpClient) { }

  getListaFabricantes():
  Observable<FabricantesResponse> {
    return this.http.get<FabricantesResponse>(environment.apiUrlProviders + `/providers`); // Aquí va la URL del endpoint de Mateo G.
  }

  postData(formData: any): Observable<any> {
    try {
      const productsFile = formData.productsFile;
      
      if (!productsFile) {
        throw new Error('Archivo no ha sido seleccionado');
      }
      
      const requestData = new FormData();
      requestData.append('provider_id', formData.fieldFabricante);
      requestData.append('file', productsFile);
  
      return this.http.post<any>(this.apiUrl, requestData, {
        reportProgress: true,
        observe: 'events'
      });
      
    } catch (error) {
      return throwError(() => error);
    }
  }
}

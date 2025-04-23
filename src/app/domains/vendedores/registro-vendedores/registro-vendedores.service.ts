import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Vendedor, VendedorResponse } from '../vendedores.model';

@Injectable({
  providedIn: 'root'
})
export class RegistroVendedoresService {

  private apiUrl = environment.apiUrlSellers + `/sellers/add`;

  constructor(private http: HttpClient) { }

  postData(formData: any):
  Observable<any>{
    const requestData = {
      identification_number: formData.fieldNumeroIdentificacion,
      name: formData.fieldNombre,
      email: formData.fieldCorreoElectronico,
      username: `Vendedor${formData.fieldNumeroIdentificacion}`,
      password: formData.fieldNumeroIdentificacion,
      address: formData.fieldDireccion,
      phone: formData.fieldTelefono,
      zone: formData.fieldZona
    }
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.apiUrl, requestData, {headers});
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment'

@Injectable({
    providedIn: 'root'
})

export class RegistroFabricantesService {
    private apiUrl = environment.apiUrlProviders + `/providers/add`;

    constructor(private http: HttpClient){}

    postData(formData: any):
    Observable<any>{
        const requestData = {
            identification_number: formData.fieldNit,
            name: formData.fieldNombre,
            address: formData.fieldDireccion,
            countries: [formData.fieldPais],
            identification_number_contact: formData.fieldIdentificacion,
            name_contact: formData.fieldNombreContacto,
            phone_contact: formData.fieldTelefono,
            address_contact: formData.fieldDireccionContacto             
        }


        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        return this.http.post<any>(this.apiUrl, requestData, {headers});
    }


}
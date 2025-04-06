import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class RegistroFabricantesService {
    private apiUrl = 'https://backend-providers-143596276526.us-central1.run.app/providers/add'; // Mirar si se puede poner en los archivos de environment.

    constructor(private http: HttpClient){}

    postData(formData: any):
    Observable<any>{
        const requestData = {
            identification_number: formData.fieldNit,
            name: formData.fieldNombre,
            address: formData.fieldDireccion,
            countries: formData.fieldPais,
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
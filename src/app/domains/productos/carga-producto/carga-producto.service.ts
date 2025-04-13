import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FabricantesResponse } from '../producto.model';

@Injectable({
  providedIn: 'root'
})
export class CargaProductoService {

  private apiUrl = 'http://localhost:5002/products/add'; // Mirar si se puede poner en los archivos de environment.

  constructor(private http: HttpClient) { }

  getListaFabricantes():
  Observable<FabricantesResponse> {
    return this.http.get<FabricantesResponse>('http://localhost:5003/providers'); // Aquí va la URL del endpoint de Mateo G.
  }

  postData(formData: any):
  Promise<Observable<any>>{
    return new Promise(async (resolve, reject) => {
      try {
        const imageBase64 = formData.imageFile 
            ? await this.fileToBase64(formData.imageFile)
            : null;

        const requestData = {
          sku: formData.fieldCodigo,
          name: formData.fieldNombre,
          unit_value: formData.fieldValor,
          storage_conditions: formData.fieldCondicionesAlmacenamiento,
          product_features: formData.fieldCaracteristicas,
          provider_id: formData.fieldFabricante, // Esto debe ser modificado para que se lea de un dropdown
          estimated_delivery_time: formData.fieldFechaVencimiento,
          photo: imageBase64,
          description: formData.fieldDescripcion,
          category: formData.fieldCategoria,
        }

        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        })

        resolve(this.http.post<any>(this.apiUrl, requestData, {headers}));
      } catch (error) {
        reject(error);
      }
    });    
  }

  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = error => reject(error);
    });
  }


}

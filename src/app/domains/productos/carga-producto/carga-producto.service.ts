import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FabricantesResponse } from '../../fabricantes/fabricantes.model';
import { environment } from '../../../../environments/environment'
import { ProductosResponse } from '../producto.model';

@Injectable({
  providedIn: 'root'
})
export class CargaProductoService {

  private apiUrl = environment.apiUrlProducts + `/products/add`; 

  constructor(private http: HttpClient) { }

  getListaFabricantes():
  Observable<FabricantesResponse> {
    return this.http.get<FabricantesResponse>(environment.apiUrlProviders + `/providers`); // Aquí va la URL del endpoint de Mateo G.
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
          provider_id: formData.fieldFabricante,
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

  getProductos(): Observable<ProductosResponse> {
    return this.http.get<ProductosResponse>(`${environment.apiUrlProducts}/products`);
  }

  updateProducto(formData: any):
  Promise<Observable<any>> {
    return new Promise(async (resolve, reject) => {
      try {
        const imageBase64 = formData.imageFile 
          ? await this.fileToBase64(formData.imageFile)
          : formData.id && !formData.imageFile 
            ? null 
            : null;
  
        const requestData = {
          sku: formData.fieldCodigo,
          name: formData.fieldNombre,
          unit_value: formData.fieldValor,
          storage_conditions: formData.fieldCondicionesAlmacenamiento,
          product_features: formData.fieldCaracteristicas,
          provider_id: formData.fieldFabricante,
          estimated_delivery_time: formData.fieldFechaVencimiento,
          photo: imageBase64,
          description: formData.fieldDescripcion,
          category: formData.fieldCategoria,
        };
  
        const headers = new HttpHeaders({
          'Content-Type': 'application/json'
        });
  
        // Use PUT instead of POST for updates
        resolve(this.http.put<any>(`${environment.apiUrlProducts}/products/${formData.id}`, requestData, { headers }));
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

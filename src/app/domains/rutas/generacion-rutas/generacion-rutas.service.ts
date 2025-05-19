import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment'
import { OrdenResponse } from '../../pedidos/pedidos.model';
import { HttpClient } from '@angular/common/http';
import { ClientesResponse, VendedoresResponse } from '../../vendedores/vendedores.model';

@Injectable({
  providedIn: 'root'
})
export class GeneracionRutasService {

  constructor(private http: HttpClient) { }

  getOrdenes() {
    return this.http.get<OrdenResponse>(`${environment.apiUrlOrders}/orders`);
  }

  getListaVendedores():
  Observable<VendedoresResponse>{
    return this.http.get<VendedoresResponse>(`${environment.apiUrlSellers}/sellers`);
  };

  getClientes():
  Observable<ClientesResponse>{
    return this.http.get<ClientesResponse>(`${environment.apiUrlCustomers}/customers`);
  }

  postDeliveryRoute(body: any): 
  Observable<any> {
    return this.http.post(`${environment.apiUrlRoutes}/routes/delivery`, body);
  }

}

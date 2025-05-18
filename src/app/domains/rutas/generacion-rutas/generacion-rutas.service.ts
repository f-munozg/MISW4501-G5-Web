import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, map, Observable, startWith } from 'rxjs';
import { environment } from '../../../../environments/environment'
import { OrdenResponse } from '../../pedidos/pedidos.model';
import { HttpClient } from '@angular/common/http';
import { ClientesResponse, VendedoresResponse } from '../../vendedores/vendedores.model';

export interface TableRow {

}

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

  postDeliveryRoute(){

  }

}

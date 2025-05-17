import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment'
import { BodegasResponse } from '../../bodegas/bodegas.model';
import { CriticalStockResponse } from '../inventario.model';
import { TableRow } from './gestion-alertas-inventario-critico.component';

@Injectable({
  providedIn: 'root'
})
export class GestionAlertasInventarioCriticoService {

  constructor(private http: HttpClient) { }

  getListaBodegas() {
    return this.http.get<BodegasResponse>(environment.apiUrlStock + `/stock/get_warehouses`);
  }

  getListaProductosStock(){
    return this.http.get<any>(environment.apiUrlProducts + `/products`);
  }

  getProductosNivelCritico() {
    return this.http.post<CriticalStockResponse<TableRow>>(`${environment.apiUrlStock}/stock/critical`,null); // El backend debería pedir un get realmente
  }
}

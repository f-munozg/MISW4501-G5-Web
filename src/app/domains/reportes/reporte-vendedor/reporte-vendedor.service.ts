import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { VendedoresResponse } from '../../vendedores/vendedores.model';
import { ReporteVendedorResponse } from '../reportes.model';

@Injectable({
  providedIn: 'root'
})
export class ReporteVendedorService {

  constructor(private http: HttpClient) { }

  getListaVendedores():
  Observable<VendedoresResponse>{
      return this.http.get<VendedoresResponse>(`${environment.apiUrlSellers}/sellers`);
  }

  getReporteVendedor(fecha_inicio: string, fecha_fin: string, vendedor: string):
  Observable<ReporteVendedorResponse>{
    let params = new HttpParams()
      .set('fecha_inicio', fecha_inicio)
      .set('fecha_fin', fecha_fin);

    if (vendedor !== null) {
      params = params.set('seller_id', vendedor);
    }

      return this.http.get<ReporteVendedorResponse>(`${environment.apiUrlReports}/reports/reporte_vendedor`, { params });
  }

}

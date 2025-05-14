import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ProductosResponse } from '../../productos/producto.model';
import { Observable } from 'rxjs';
import { VendedoresResponse } from '../../vendedores/vendedores.model';
import { ReporteVentas } from '../reportes.model';

@Injectable({
  providedIn: 'root'
})
export class ReporteVentasService {
  private apiUrlGetProducts = environment.apiUrlProducts + `/products`;

  constructor(private http: HttpClient) { }

  getListaProductos(){
    return this.http.get<ProductosResponse>(this.apiUrlGetProducts);
  }

  getListaVendedores():
  Observable<VendedoresResponse>{
      return this.http.get<VendedoresResponse>(`${environment.apiUrlSellers}/sellers`);
  }

  getReporteVentas(fecha_inicio: string, fecha_fin: string, producto: string | null, vendedor: string | null) {
    let params = new HttpParams()
      .set('fecha_inicio', fecha_inicio)
      .set('fecha_fin', fecha_fin);

    if (producto !== null) {
      params = params.set('producto', producto);
    }
    if (vendedor !== null) {
      params = params.set('vendedor', vendedor);
    }

    return this.http.get<ReporteVentas[]>(`${environment.apiUrlReports}/reports/reporte_ventas`, { params });
  }

}

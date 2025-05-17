import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class ExportPdfService {
  crearPdf(): any {
    return new jsPDF();
  }

  agregarAutoTable(doc: any, options: any): void {
    autoTable(doc, options);
  }
}

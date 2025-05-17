// export-pdf.service.spec.ts
import { ExportPdfService } from './export-pdf.service';

describe('ExportPdfService', () => {
  let service: ExportPdfService;

  beforeEach(() => {
    service = new ExportPdfService();
  });

  describe('crearPdf', () => {
    it('should create a PDF without throwing errors', () => {
      expect(() => service.crearPdf()).not.toThrow();
    });
  });

  describe('agregarAutoTable', () => {
    it('should call autoTable without throwing errors', () => {
      const mockPdf = service.crearPdf();
      const options = { head: [['Name']], body: [['Test']] };
      expect(() => service.agregarAutoTable(mockPdf, options)).not.toThrow();
    });

    it('should handle null doc parameter', () => {
      expect(() => service.agregarAutoTable(null, {})).toThrow();
    });
  });
});
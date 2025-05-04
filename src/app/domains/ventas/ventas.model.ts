export interface Venta {
  id: string;
  name: string;
  total_quantity: number;
  unit_value: number;
  purchase_date: string;
}

export enum PeriodoPlanVentas {
    TRIMESTRAL = "TRIMESTRAL",
    SEMESTRAL = "SEMESTRAL",
    ANUAL = "ANUAL",
}

// Record type annotation para garantizar que todos los valores 
// del enum están presentes en el mapeo al dropdown
export const PeriodoType2LabelMapping: Record<PeriodoPlanVentas, string> = {
  [PeriodoPlanVentas.TRIMESTRAL]: "Trimestral",
  [PeriodoPlanVentas.SEMESTRAL]: "Semestral",
  [PeriodoPlanVentas.ANUAL]: "Anual",
}
export interface ApiResponse<T> {
    total: number;
    limit: number;
    offset: number;
    results: T[];
  }
  
export interface InventoryItem {
    warehouse: string;
    product: string;
    category: string;
    quantity: number;
    estimated_delivery_time: string;
    date_update: string;
  }

export interface ProductInventoryItem {
    product: string;
    sku: string;
    quantity: number;
    location: string;
    status: string;
}

export enum TipoMovimiento {
    INGRESO = "Ingreso",
    SALIDA = "Salida"
}

export const MovementType2LabelMapping: Record<TipoMovimiento, string> = {
  [TipoMovimiento.INGRESO]: "Ingreso",
  [TipoMovimiento.SALIDA]: "Salida",
}

export interface RegistroMovimiento {
    fecha: string;
    nombre_producto: string;
    nombre_bodega: string;
    tipo_movimiento: TipoMovimiento;
    cantidad: number;
    usuario: string
}

export interface RegistroMovimientoResponse {
    movimientos: RegistroMovimiento[];
}

export interface MovimientoDetalle {
    timestamp: string;
    nombre_producto: string;
    cantidad_ingreso: number;
    cantidad_salida: number;
    tipo_movimiento: TipoMovimiento;
    stock_acumulado: number;
}
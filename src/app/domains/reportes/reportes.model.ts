import { MovimientoDetalle } from "../inventarios/inventario.model";

export enum TipoReporte{
    VENTAS = "Reporte de Ventas",
    VENDEDOR = "Reporte de Vendedor",
    ROTACION_INVENTARIO = "Reporte de Rotación de Inventario",
}

export interface ReporteRotacionProducto {
    product_id: string;
    sku: string;
    name: string;
    rotacion: RotacionProducto;
    stock_inicial: number;
    stock_final: number;
    movimientos: MovimientoDetalle[];
}

export interface RotacionProducto {
    porcentaje: number;
    texto: string;
    nivel: string;
}

export interface ReporteVentas {
    producto: string;
    vendedor: string;
    unidades_vendidas: number;
    ingresos: number;
    primera_venta: string;
    ultima_venta: string;
}

export interface ReporteVendedorPlan {
    periodo: string;
    producto: string;
    meta: string;
    cumplimiento: string;
}

export interface ReporteVendedorResumen {
    total_ventas: number;
    total_ventas_plan: number;
    clientes_atendidos: number;
    clientes_visitados: number;
    tasa_conversion: string;
    plan: ReporteVendedorPlan;
}

export interface ReporteVendedorDetalle {
    producto: string;
    fecha_venta: string;
    cantidad: number;
    valor_unitario: number;
    valor_total: number;
}

export interface ReporteVendedorResponse {
    resumen: ReporteVendedorResumen;
    detalle_productos: ReporteVendedorDetalle[];
}
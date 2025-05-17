export interface OptimizacionCompras {
    product_name: string;
    suggested_qtty: number;
    motive: string;
}

export interface OptimizacionComprasResponse {
    suggested_purchases: OptimizacionCompras[];
}

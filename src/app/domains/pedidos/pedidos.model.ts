export interface Orden {
    status: string;
    date_delivery: string;
    date_order: string;
    seller_id: string;
    id: string;
    customer_id: string;
}

export interface OrdenResponse {
    orders: Orden[];
}
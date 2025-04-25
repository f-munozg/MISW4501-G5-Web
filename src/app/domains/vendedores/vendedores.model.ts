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

export enum CategoriaProductos {
    FARMACIA = "FARMACIA",
    ALIMENTACIÓN = "ALIMENTACIÓN",
    LIMPIEZA = "LIMPIEZA",
    ELECTRÓNICA = "ELECTRÓNICA",
    ROPA = "ROPA",
    HERRAMIENTAS = "HERRAMIENTAS",
    BELLEZA = "BELLEZA",
    JUGUETE = "JUGUETE",
    HOGAR = "HOGAR",
}

// Record type annotation para garantizar que todos los valores 
// del enum están presentes en el mapeo al dropdown
export const FileType2LabelMapping: Record<CategoriaProductos, string> = {
    [CategoriaProductos.FARMACIA]: "Farmacia",
    [CategoriaProductos.ALIMENTACIÓN]: "Alimentación",
    [CategoriaProductos.LIMPIEZA]: "Limpieza",
    [CategoriaProductos.ELECTRÓNICA]: "Electrónica",
    [CategoriaProductos.ROPA]: "Ropa",
    [CategoriaProductos.HERRAMIENTAS]: "Herramientas",
    [CategoriaProductos.BELLEZA]: "Belleza",
    [CategoriaProductos.JUGUETE]: "Juguete",
    [CategoriaProductos.HOGAR]: "Hogar",
}

export enum ZonaVendedor {
    NORTE = "NORTE",
    SUR = "SUR",
    ORIENTE = "ORIENTE",
    OCCIDENTE = "OCCIDENTE",

}

// Record type annotation para garantizar que todos los valores 
// del enum están presentes en el mapeo al dropdown
export const ZonaType2LabelMapping: Record<ZonaVendedor, string> = {
    [ZonaVendedor.NORTE]: "Norte",
    [ZonaVendedor.SUR]: "Sur",
    [ZonaVendedor.ORIENTE]: "Oriente",
    [ZonaVendedor.OCCIDENTE]: "Occidente",
}

export interface Fabricante {
    id: string;
    name: string;
}

export interface FabricantesResponse {
  providers: Fabricante[];
}

export interface Bodega {
    id: string;
    name: string;
}

export interface BodegasResponse{
    Warehouses: Bodega[];
}

    export interface Producto {
    id: string;
    sku: string;
    name: string;
    unit_value: number;
    storage_conditions: string;
    product_features: string;
    provider_id: string;
    estimated_delivery_time: string;
    photo: string;
    description: string;
    category: string;
}

export interface ProductosResponse{
    products: Producto[];
}

export interface Venta {
    id: string;
    name: string;
    total_quantity: number;
    unit_value: number;
    purchase_date: string;
}

export interface Vendedor{
    id: string; 
    identification_number: number; 
    name: string; 
    email: string;
    address: string;
    phone: string; 
    zone: string; 
    user_id: string;
}

export interface VendedorResponse{
    seller: Vendedor;
}

export interface VendedoresResponse{
    sellers: Vendedor[];
}

export interface Cliente{
    id: string;
    name: string;
    identification_number: string;
    observations: string;
    user_id: string;
    email: string;
}

export interface ClienteResponse{
    customer: Cliente;
}

export interface ClientesResponse{
    customers: Cliente[]
}

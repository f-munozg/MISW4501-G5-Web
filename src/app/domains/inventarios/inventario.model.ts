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
    FARMACIA = "Farmacia",
    ALIMENTACIÓN = "Alimentación",
    LIMPIEZA = "Limpieza",
    ELECTRÓNICA = "Electrónica",
    ROPA = "Ropa",
    HERRAMIENTAS = "Herramientas",
    BELLEZA = "Belleza",
    JUGUETE = "Juguete",
    HOGAR = "Hogar",
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
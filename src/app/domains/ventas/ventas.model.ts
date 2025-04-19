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
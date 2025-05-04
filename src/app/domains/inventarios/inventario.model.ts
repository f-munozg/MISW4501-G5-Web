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
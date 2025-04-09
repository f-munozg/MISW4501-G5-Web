export interface ApiResponse {
    total: number;
    limit: number;
    offset: number;
    results: InventoryItem[];
  }
  
export interface InventoryItem {
    warehouse: string;
    product: string;
    category: string;
    quantity: number;
    estimated_delivery_time: string;
    date_update: string;
  }

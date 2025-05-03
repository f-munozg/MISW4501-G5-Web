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

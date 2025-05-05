import { Producto } from "../productos/producto.model";

export interface Fabricante {
    id: string;
    name: string;
  }

export interface FabricanteResponse {
    id: string;
    identification_number: string;
    name: string;
    address: string;
    countries: string[];
    identification_number_contact: string;
    name_contact: string;
    phone_contact: string;
    address_contact: string;
}

export interface FabricantePortafolioResponse {
    provider: FabricanteResponse;
    portfolio: Producto[];
}

export interface FabricantesResponse {
    providers: Fabricante[];
}


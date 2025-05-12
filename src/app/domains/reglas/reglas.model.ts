import { CategoriaProductos } from "../productos/producto.model";

export enum Paises{
    ARGENTINA = "Argentina",
    BOLIVIA = "Bolivia",
    BRASIL = "Brasil",
    CHILE = "Chile",
    COLOMBIA = "Colombia",
    ECUADOR = "Ecuador",
    PARAGUAY = "Paraguay",
    PERÚ = "Perú",
    SURINAM = "Surinam",
    TRINIDAD_Y_TOBAGO = "Trinidad y Tobago",
    URUGUAY = "Uruguay",
    VENEZUELA = "Venezuela",
    CANADA = "Canadá",
    ESTADOS_UNIDOS = 'Estados Unidos',
    MÉXICO = "México",
    BELICE = "Belice",
    COSTA_RICA = "Costa Rica",
    EL_SALVADOR = "El Salvador",
    GUATEMALA = "Guatemala",
    HONDURAS = "Honduras",
    NICARAGUA = "Nicaragua",
    PANAMÁ = "Panamá",
    ANTIGUA_Y_BARBUDA = "Antigua y Barbuda",
    BAHAMAS = "Bahamas",
    BARBADOS = "Barbados",
    CUBA = "Cuba",
    DOMINICA = "Dominica",
    GRANADA = "Granada",
    GUYANA = "Guyana",
    HAITÍ = "Haití",
    JAMAICA = "Jamaica",
    REPÚBLICA_DOMINICANA = "República Dominicana",
    SAN_CRISTÓBAL_Y_NIEVES = "San Cristóbal y Nieves",
    SAN_VICENTE_Y_LAS_GRANADINAS = "San Vicente y las Granadinas",
    SANTA_LUCÍA = "Santa Lucía",
}

export const PaisesType2LabelMapping: Record<Paises, string> = {
    [Paises.ARGENTINA]: "Argentina",
    [Paises.BOLIVIA]: "Bolivia",
    [Paises.BRASIL]: "Brasil",
    [Paises.CHILE]: "Chile",
    [Paises.COLOMBIA]: "Colombia",
    [Paises.ECUADOR]: "Ecuador",
    [Paises.PARAGUAY]: "Paraguay",
    [Paises.PERÚ]: "Perú",
    [Paises.SURINAM]: "Surinam",
    [Paises.TRINIDAD_Y_TOBAGO]: "Trinidad y Tobago",
    [Paises.URUGUAY]: "Uruguay",
    [Paises.VENEZUELA]: "Venezuela",
    [Paises.CANADA]: "Canadá",
    [Paises.ESTADOS_UNIDOS]: "Estados Unidos",
    [Paises.MÉXICO]: "México",
    [Paises.BELICE]: "Belice",
    [Paises.COSTA_RICA]: "Costa Rica",
    [Paises.EL_SALVADOR]: "El Salvador",
    [Paises.GUATEMALA]: "Guatemala",
    [Paises.HONDURAS]: "Honduras",
    [Paises.NICARAGUA]: "Nicaragua",
    [Paises.PANAMÁ]: "Panamá",
    [Paises.ANTIGUA_Y_BARBUDA]: "Antigua y Barbuda",
    [Paises.BAHAMAS]: "Bahamas",
    [Paises.BARBADOS]: "Barbados",
    [Paises.CUBA]: "Cuba",
    [Paises.DOMINICA]: "Dominica",
    [Paises.GRANADA]: "Granada",
    [Paises.GUYANA]: "Guyana",
    [Paises.HAITÍ]: "Haití",
    [Paises.JAMAICA]: "Jamaica",
    [Paises.REPÚBLICA_DOMINICANA]: "República Dominicana",
    [Paises.SAN_CRISTÓBAL_Y_NIEVES]: "San Cristóbal y Nieves",
    [Paises.SAN_VICENTE_Y_LAS_GRANADINAS]: "San Vicente y las Granadinas",
    [Paises.SANTA_LUCÍA]: "Santa Lucía",
}

export enum TipoRegla{
    LEGAL = "Legal",
    COMERCIAL = "Comercial",
    TRIBUTARIA = "Tributaria",
}

export const TipoRegal2LabelMapping: Record<TipoRegla, string> = {
    [TipoRegla.LEGAL]: "Legal",
    [TipoRegla.COMERCIAL]: "Comercial",
    [TipoRegla.TRIBUTARIA]: "Tributaria",
}

export enum TipoImpuesto{
    RENTA_PERSONAS_FISICAS = "Renta Personas Físicas",
    SOCIEDADES = "Sociedades",
    PATRIMONIO = "Patrimonio",
    VALOR_AGREGADO = "Valor Agregado",
    ESPECIAL = "Especial",
    AMBIENTAL = "Ambiental",
    TRANSACCIONES_FINANCIERAS = "Transacciones Financieras",
    SUCESIONES_DONACIONES = "Sucesiones y Donaciones",
    BIENES_INMUEBLES = "Bienes Inmuebles",
    OTRO = "Otro",
}

export const TipoImpuesto2LabelMapping: Record<TipoImpuesto, string> = {
    [TipoImpuesto.RENTA_PERSONAS_FISICAS]: "Renta Personas Físicas",
    [TipoImpuesto.SOCIEDADES]: "Sociedades",
    [TipoImpuesto.PATRIMONIO]: "Patrimonio",
    [TipoImpuesto.VALOR_AGREGADO]: "Valor Agregado",
    [TipoImpuesto.ESPECIAL]: "Especial",
    [TipoImpuesto.AMBIENTAL]: "Ambiental",
    [TipoImpuesto.TRANSACCIONES_FINANCIERAS]: "Transacciones Financieras",
    [TipoImpuesto.SUCESIONES_DONACIONES]: "Sucesiones y Donaciones",
    [TipoImpuesto.BIENES_INMUEBLES]: "Bienes Inmuebles",
    [TipoImpuesto.OTRO]: "Otro",
}

export enum TipoReglaComercial{
    DESCUENTO = "Descuento",
    PEDIDO_MINIMO = "Pedido Mínimo",
    OTRO = "Otro",
}

export const TipoReglaComercial2LabelMapping: Record<TipoReglaComercial, string> = {
    [TipoReglaComercial.DESCUENTO]: "Descuento",
    [TipoReglaComercial.PEDIDO_MINIMO]: "Pedido Mínimo",
    [TipoReglaComercial.OTRO]: "Otro",
}

export interface ReglaTributaria{
    id: string;
    pais: Paises;
    tipo_impuesto: TipoImpuesto;
    valor: number;
    descripcion: string;
}

export interface ReglaTributariaResponse{
    rules: ReglaTributaria[]
}

export interface ReglaComercial{
    id: string;
    pais: Paises;
    tipo_regla_comercial: TipoReglaComercial;
    descripcion: string;
}

export interface ReglaComercialResponse{
    rules: ReglaComercial[]
}

export interface ReglaLegal{
    id: string;
    pais: Paises;
    categoria_producto: CategoriaProductos;
    descripcion: string;
}

export interface ReglaLegalResponse{
    rules: ReglaLegal[]
}
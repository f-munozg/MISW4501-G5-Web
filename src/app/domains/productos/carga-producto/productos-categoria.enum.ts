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
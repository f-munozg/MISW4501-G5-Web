# Sistema CPP - Aplicación Web

La aplicación web del Sistema CCP ha sido diseñada para que los empleados de CCP puedan ejercer sus funciones haciendo uso de un sistema unificado que les permita cumplir con su misión como compañía y represente una mejora en la eficiencia de sus procesos de compras, de ventas, de inventario y de logística.

## Índice

- [Sistema CPP - Aplicación Web](#sistema-cpp---aplicación-web)
  - [Índice](#índice)
  - [Estructura](#estructura)
  - [Despliegue](#despliegue)
    - [Despliegue para Desarrollo - serve](#despliegue-para-desarrollo---serve)
    - [Despliegue para Producción - build](#despliegue-para-producción---build)
  - [Pruebas](#pruebas)
    - [Ejecución de Pruebas Unitarias](#ejecución-de-pruebas-unitarias)
    - [Ejecución de Pruebas End-to-End](#ejecución-de-pruebas-end-to-end)
  - [Autores](#autores)

## Estructura

```
src/
├── app/
│   ├── core/                         # Funcionalidades esenciales (i.e., autorización, roles, logs, etc.)
│   ├── shared/                       # Componentes compartidos (navbar, header), pipelines, directivas, etc.
│   ├── domains/                      # Módulos por dominio
│   │   ├── bodegas/                    # Componentes de gestión de bodegas 
│   │   ├── compras/                    # Componentes de gestión de compras
│   │   ├── fabricantes/                # Componentes de gestión de fabricantes 
│   │   ├── inventarios/                # Componentes de gestión de inventarios
│   │   ├── login/                      # Componentes de inicio de sesión y registro
│   │   ├── pedidos/                    # Componentes de gestión de pedidos
│   │   ├── productos/                  # Componentes de gestión de productos
│   │   ├── reglas/                     # Componentes de reglas
│   │   ├── reportes/                   # Componentes de reportes
│   │   ├── rutas/                      # Componentes de gestión de rutas
│   │   ├── usuarios/                   # Componentes de gestión de usuarios
│   │   ├── vendedores/                 # Componentes de gestión de vendedores
│   │   └── ventas/                     # Componentes de gestión de ventas
│   ├── material                      # Módulo de Angular Material
│   │   └── material.module.ts          # Archivo de módulo de Angular Material
│   ├── shared                        # Carpeta de componentes compartidos
│   │   ├── accessibility-bar/           # Componente de barra de accesibilidad
│   │   ├── default-window/             # Componente de ventana por defecto (la unión de todos los componentes shared)
│   │   ├── header/                     # Componente de encabezado
│   │   ├── sidenav/                    # Componente de barra de navegación
│   │   └── table-template/             # Componente de formato de tabla
│   ├── app-routing.module.ts         # Configuración principal de routing
│   ├── app.component.css             # Configuración principal de estilo
│   ├── app.component.html            # Configuración principal de estructura de pantalla
│   ├── app.component.spec.ts         # Configuración principal de pruebas
│   ├── app.component.ts              # Componente Root
│   └── app.module.ts                 # Módulo Root
├── assets/                           # Assets (imágenes, íconos, fuentes, etc.)
├── environments/                     # Configuración de los environments
├── Dockerfile                        # Configuración para creación de contenedor Docker. 
├── karma.conf.js                     # Configuración de archivo para ejecución de pruebas unitarias.
└── ...                               # Otros (i.e., styles, tsconfig json files, package.json, pruebas e2e.)
```

## Despliegue

### Despliegue para Desarrollo - serve

Para desplegar el proyecto se debe correr el comando `ng serve`. Por defecto utiliza el puerto `4200`, por lo que se debe navegar a `http://localhost:4200/` para acceder a la aplicación.

### Despliegue para Producción - build

Para construir el proyecto se utiliza el comando `ng build`. Los artefactos del build se almacenan en el directorio `dist/` directory. El build se utiliza para el despliegue a producción.

## Pruebas

### Ejecución de Pruebas Unitarias

Las pruebas unitarias se ejecutan con el comando `ng test` via [Karma](https://karma-runner.github.io). Las pruebas están configuradas para asegurar que el coverage de las líneas de código es mayor al 80%. La configuración y el coverage de las pruebas se encuentran en `karma.conf.js`.

### Ejecución de Pruebas End-to-End

La pruebas end-to-end se ejecutan corriendo el comando `ng e2e` por medio de una plataforma de pruebasa (a escoger). Para utilizar este comando, es necesario agregar las librerías que implemntan las capacidad de pruebas end-to-end (a escoger).

## Autores

- Mateo Andrés Díaz Forero (ma.diazf1)
- Mateo Garzón Restrepo (m.garzonr2)
- Juan Felipe González Gómez (jf.gonzalezg12)
- Felipe Santiago Muñoz Guzmán (f.munozg)
# React/MongoDB Technical Challenge

A full-stack CRUD application built with React, Node.js, and MongoDB that demonstrates special pricing functionality for products.

## 📑 Tabla de Contenidos

- [📋 Introducción](#-introducción)
- [🚀 Pasos para ejecutar localmente](#-pasos-para-ejecutar-localmente)
  - [Prerrequisitos](#prerrequisitos)
  - [Instalación y configuración](#instalación-y-configuración)
  - [Scripts disponibles](#scripts-disponibles)
  - [Variables de entorno importantes](#variables-de-entorno-importantes)
- [🎯 Justificación de elecciones técnicas](#-justificación-de-elecciones-técnicas)
  - [TypeScript](#typescript)
  - [Arquitectura Frontend - Atomic Design](#arquitectura-frontend---atomic-design)
  - [Arquitectura Backend - Repository Pattern](#arquitectura-backend---repository-pattern)
  - [Tecnologías elegidas](#tecnologías-elegidas)
  - [Diseño de la colección](#diseño-de-la-colección-preciosespecialesbarake78)
  - [Integración con colección de usuarios](#integración-con-colección-de-usuarios)
- [📁 Descripción de la estructura del proyecto](#-descripción-de-la-estructura-del-proyecto)
- [🎮 Funcionalidades implementadas](#-funcionalidades-implementadas)
  - [Pantalla "Artículos"](#pantalla-artículos)
  - [Pantalla "Subida"](#pantalla-subida)
  - [API Endpoints](#api-endpoints)
  - [Funcionalidad de Edición de Precios Especiales](#funcionalidad-de-edición-de-precios-especiales)
- [🔧 Características técnicas destacadas](#-características-técnicas-destacadas)
  - [Performance](#performance)
  - [Seguridad](#seguridad)
  - [UX/UI](#uxui)
  - [Escalabilidad](#escalabilidad)
- [🧪 Testing y Quality Assurance](#-testing-y-quality-assurance)
- [📈 Próximos pasos sugeridos](#-próximos-pasos-sugeridos)

## 📋 Introducción

Este proyecto es una aplicación completa que demuestra las mejores prácticas de desarrollo web moderno utilizando:

- **Frontend**: React 18 + TypeScript + Vite + Styled Components
- **Backend**: Node.js + Express + TypeScript
- **Base de datos**: MongoDB (cluster proporcionado)
- **Arquitectura**: Repository Pattern + Atomic Design

La aplicación permite gestionar productos y precios especiales para usuarios específicos, con una interfaz moderna y funcional.

## 🚀 Pasos para ejecutar localmente

### Prerrequisitos

- Node.js 16+ 
- npm o yarn
- Conexión a internet (para acceder al cluster de MongoDB)

### Instalación y configuración

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd react-mongo-crud
   ```

2. **Instalar dependencias**
   ```bash
   # Instalar dependencias del proyecto raíz y ambos subdirectorios
   npm run install:all
   ```

3. **Configurar variables de entorno**
   
   **Crear archivo `backend/.env`:**
   ```bash
   PORT=3001
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://drenviochallenge:m1jWly3uw42cBwp6@drenviochallenge.2efc0.mongodb.net/
   MONGODB_DATABASE=tienda
   FRONTEND_URL=http://localhost:3000
   ```
   
   **Crear archivo `frontend/.env`:**
   ```bash
   VITE_API_BASE_URL=http://localhost:3001/api
   ```

4. **Ejecutar en modo desarrollo**
   ```bash
   # Ejecutar frontend y backend simultáneamente
   npm run dev
   ```

   O ejecutar por separado:
   ```bash
   # Terminal 1 - Backend
   npm run dev:backend
   
   # Terminal 2 - Frontend  
   npm run dev:frontend
   ```

5. **Acceder a la aplicación**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/health

### Scripts disponibles

```bash
npm run dev           # Ejecutar frontend y backend
npm run dev:frontend  # Solo frontend
npm run dev:backend   # Solo backend
npm run build         # Build para producción
npm run install:all   # Instalar todas las dependencias
```

### Variables de entorno importantes

El proyecto utiliza variables de entorno para mantener la configuración sensible fuera del código fuente:

#### **Backend (.env)**
```bash
# Configuración del servidor
PORT=3001                    # Puerto del servidor backend
NODE_ENV=development         # Entorno de ejecución

# Configuración de MongoDB
MONGODB_URI=mongodb+srv://drenviochallenge:m1jWly3uw42cBwp6@drenviochallenge.2efc0.mongodb.net/
MONGODB_DATABASE=tienda      # Nombre de la base de datos

# Configuración de CORS
FRONTEND_URL=http://localhost:3000  # URL del frontend para CORS
```

#### **Frontend (.env)**
```bash
# Configuración de API
VITE_API_BASE_URL=http://localhost:3001/api  # URL base del backend
```

⚠️ **Nota de Seguridad**: En producción, asegúrate de:
- No subir archivos .env al repositorio
- Usar variables de entorno del sistema o servicios como AWS Secrets Manager
- Rotear credenciales periódicamente

## 🎯 Justificación de elecciones técnicas

### TypeScript
**Elección**: TypeScript sobre JavaScript vanilla
**Justificación**: 
- Proporciona tipado estático que previene errores en tiempo de compilación
- Mejora la productividad del desarrollador con autocompletado y refactoring
- Facilita el mantenimiento del código a largo plazo
- Mejor documentación implícita del código a través de interfaces y tipos

### Arquitectura Frontend - Atomic Design

**Componentes organizados jerárquicamente**:
- **Atoms**: Elementos básicos reutilizables (Button, Input, Label)
- **Molecules**: Combinaciones simples de átomos (SearchForm, NavigationItem)
- **Organisms**: Secciones complejas de UI (ProductTable, SpecialPriceForm)
- **Templates**: Layouts de página sin contenido real
- **Pages**: Instancias específicas con contenido real

**Beneficios**:
- Reutilización de componentes
- Consistencia visual
- Facilidad de testing
- Escalabilidad del código

### Arquitectura Backend - Repository Pattern

**Separación en capas**:
- **Controllers**: Manejo de HTTP requests/responses
- **Services**: Lógica de negocio
- **Repositories**: Acceso a datos
- **Models**: Estructuras de datos

**Beneficios**:
- Separación de responsabilidades
- Facilidad de testing con mocks
- Flexibilidad para cambiar implementaciones
- Código más limpio y mantenible

### Tecnologías elegidas

**Frontend**:
- **React 18**: Hooks modernos, mejor performance
- **Vite**: Build tool rápido, mejor DX que Create React App
- **Styled Components**: CSS-in-JS con temas y props dinámicos
- **Axios**: Cliente HTTP robusto con interceptors

**Backend**:
- **Express**: Framework minimalista y extensible
- **MongoDB Driver**: Acceso directo sin ORM para mejor control
- **Helmet**: Seguridad HTTP headers
- **Morgan**: Logging de requests

### Diseño de la colección `preciosEspecialesBarake78`

```typescript
interface SpecialPrice {
  _id: ObjectId;
  userId: string;           // ID del usuario con precio especial
  userName: string;         // Nombre del usuario (desnormalizado para performance)
  email: string;           // Email del usuario
  productId: string;       // ID del producto
  productName: string;     // Nombre del producto (desnormalizado)
  specialPrice: number;    // Precio especial
  discount: number;        // Porcentaje de descuento
  isActive: boolean;       // Estado activo/inactivo
  notes?: string;          // Notas adicionales
  fechaCreacion: Date;     // Timestamp de creación
  fechaActualizacion: Date; // Timestamp de actualización
}
```

### Integración con colección de usuarios

La aplicación se integra completamente con la colección `users` existente:

```typescript
interface User {
  _id: ObjectId;
  name: string;           // Nombre del usuario
  email: string;          // Email del usuario  
  password: string;       // Contraseña (oculta en consultas públicas)
  rol: string;           // Rol del usuario (cliente, admin, etc.)
  createdDate: string;    // Fecha de creación
  deleted: boolean;       // Soft delete flag
}
```

**Optimizaciones implementadas**:
- Índices compuestos: `{ userId: 1, productId: 1 }` (único)
- Índices individuales: `userId`, `productId`, `isActive`
- Desnormalización controlada para mejorar performance de queries
- Constraints de unicidad para evitar duplicados
- **Integración con usuarios reales** de la base de datos
- **Filtrado automático** de usuarios eliminados (deleted: true)

## 📁 Descripción de la estructura del proyecto

```
react-mongo-crud/
├── package.json                 # Scripts del proyecto raíz
├── README.md                   # Documentación
│
├── backend/                    # API Backend
│   ├── src/
│   │   ├── config/            # Configuración (database)
│   │   ├── controllers/       # Controladores HTTP
│   │   ├── models/           # Interfaces y tipos
│   │   ├── repositories/     # Capa de acceso a datos
│   │   │   ├── interfaces/   # Contratos de repositorios
│   │   │   ├── MongoProductRepository.ts
│   │   │   └── MongoSpecialPriceRepository.ts
│   │   ├── routes/           # Definición de rutas
│   │   ├── services/         # Lógica de negocio
│   │   └── index.ts          # Punto de entrada
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/                  # Cliente React
    ├── src/
    │   ├── components/       # Componentes UI (Atomic Design)
    │   │   ├── atoms/       # Componentes básicos
    │   │   ├── molecules/   # Combinaciones simples
    │   │   ├── organisms/   # Secciones complejas
    │   │   └── templates/   # Layouts de página
    │   ├── pages/           # Páginas de la aplicación
    │   ├── services/        # Servicios API
    │   ├── types/           # Tipos TypeScript
    │   ├── hooks/           # Custom hooks
    │   └── utils/           # Utilidades
    ├── package.json
    ├── tsconfig.json
    └── vite.config.ts
```

## 🎮 Funcionalidades implementadas

### Pantalla "Artículos"
- ✅ Tabla de productos con datos de la colección `productos`
- ✅ Precios dinámicos basados en usuario autenticado
- ✅ Indicador visual de precios especiales
- ✅ Precios especiales clickeables para edición
- ✅ Búsqueda y filtrado de productos
- ✅ Responsive design

### Pantalla "Subida"
- ✅ Modo dual: Crear y Editar precios especiales
- ✅ Navegación automática desde precios clickeables
- ✅ Formulario pre-llenado en modo edición- ✅ Formulario para crear precios especiales
- ✅ Validación completa de campos
- ✅ Selección de productos existentes
- ✅ Cálculo automático de descuentos
- ✅ Actualización de precios especiales existentes
- ✅ Botón cancelar y navegación automática

### API Endpoints

**Productos**:
```
GET    /api/products              # Listar productos
GET    /api/products/:id          # Obtener producto
POST   /api/products              # Crear producto
PUT    /api/products/:id          # Actualizar producto
DELETE /api/products/:id          # Eliminar producto
GET    /api/products/search       # Buscar productos
```

**Precios Especiales**:
```
GET    /api/special-prices                              # Listar precios especiales
GET    /api/special-prices/:id                          # Obtener precio especial por ID
POST   /api/special-prices                              # Crear precio especial
PUT    /api/special-prices/:id                          # Actualizar precio especial
DELETE /api/special-prices/:id                          # Eliminar precio especial
GET    /api/special-prices/user/:userId                 # Precios por usuario
GET    /api/special-prices/user/:userId/product/:productId # Precio específico usuario-producto
GET    /api/special-prices/user/:userId/products        # Productos con precios especiales
GET    /api/special-prices/user/:userId/pricing         # Info completa de precios del usuario
POST   /api/special-prices/cleanup                      # Desactivar expirados
```

**Usuarios**:
```
GET    /api/users/public                      # Listar usuarios (datos públicos)
GET    /api/users/:id                         # Obtener usuario por ID
GET    /api/users/email/:email                # Obtener usuario por email
GET    /api/users/role/:role                  # Obtener usuarios por rol
GET    /api/users/search/:query               # Buscar usuarios
POST   /api/users                             # Crear usuario
PUT    /api/users/:id                         # Actualizar usuario
DELETE /api/users/:id                         # Eliminar usuario (soft delete)
```

### Funcionalidad de Edición de Precios Especiales

La aplicación implementa un flujo completo de edición de precios especiales:

#### **Flujo de Edición**:
1. **Navegación desde "Artículos"**: 
   - Seleccionar un usuario en el dropdown
   - Los productos con precios especiales muestran un badge rojo "Precio Especial"
   - **Hacer clic en el badge** navega automáticamente al formulario de edición

2. **Modo Edición en "Subida"**:
   - El formulario se pre-llena con los datos existentes
   - La interfaz cambia dinámicamente:
     - Título: "Editar Precio Especial"
     - Botón principal: "Actualizar Precio Especial"
     - Botón adicional: "Cancelar" (vuelve a artículos)

3. **Actualización**:
   - Al enviar el formulario, se actualiza el precio especial existente
   - Mensaje de éxito: "Precio especial actualizado exitosamente"
   - **Navegación automática** de vuelta a "Artículos" después de 2 segundos

#### **Flujo Tradicional (Crear)**:
- Navegar a "Subida" directamente → Formulario vacío → Crear nuevo precio especial

#### **Características técnicas**:
- **Estado de navegación**: Utiliza React Router `useLocation` para recibir datos
- **Modo dual**: El mismo componente maneja creación y edición
- **API inteligente**: Endpoint específico `GET /api/special-prices/user/:userId/product/:productId`
- **UX optimizada**: Interfaces dinámicas según el modo de operación

#### **Flujo Completo de Operaciones**:

**Crear Precio Especial**:
```
1. Ir a "Subida" → 2. Seleccionar Usuario → 3. Seleccionar Producto → 
4. Configurar Precio → 5. Guardar → 6. Nuevo precio especial creado
```

**Editar Precio Especial**:
```
1. Ir a "Artículos" → 2. Seleccionar Usuario → 3. Click en badge "Precio Especial" →
4. Auto-navegación a "Subida" (pre-llenado) → 5. Modificar → 6. Actualizar → 
7. Auto-retorno a "Artículos"
```

**Ver Precios Especiales**:
```
1. Ir a "Artículos" → 2. Seleccionar Usuario → 3. Ver productos con precios especiales
(badges rojos + precios tachados)
```

## 🔧 Características técnicas destacadas

### Performance
- Lazy loading de componentes
- Optimización de re-renders con React.memo
- Índices de base de datos optimizados
- Paginación preparada para grandes datasets

### Seguridad
- Validación de entrada en frontend y backend
- Sanitización de datos
- Headers de seguridad con Helmet
- Manejo seguro de errores
- **Variables de entorno** para credenciales sensibles
- **Configuración externa** de conexiones de base de datos

### UX/UI
- Diseño responsive moderno
- Estados de carga y error
- Feedback visual claro
- Navegación intuitiva

### Escalabilidad
- Arquitectura modular
- Separación de responsabilidades
- Configuración environment-specific
- Docker-ready structure

## 🧪 Testing y Quality Assurance

- ESLint + TypeScript para calidad de código
- Estructura preparada para Jest testing
- Validación de tipos en tiempo de compilación
- Logging estructurado para debugging

## 📈 Próximos pasos sugeridos

1. Implementar autenticación de usuarios
2. Agregar sistema de roles y permisos
3. Implementar caching con Redis
4. Añadir tests unitarios e integración
5. Configurar CI/CD pipeline
6. Dockerizar la aplicación

---

**Desarrollado por**: Issa Barake  
**Fecha**: Junio 2025
**Versión**: 1.1.0 - Funcionalidad de edición de precios especiales implementada 
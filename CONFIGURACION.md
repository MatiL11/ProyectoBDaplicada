# Configuración del Proyecto

## Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```
VITE_SUPABASE_URL=tu_url_de_supabase_aqui
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase_aqui
```

## Configuración de Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Ve a Settings > API
4. Copia la URL del proyecto y la clave anon public
5. Pega estos valores en el archivo `.env.local`

## Esquema de Base de Datos

Ejecuta los siguientes comandos SQL en el editor SQL de Supabase:

```sql
-- Nota: La autenticación se maneja automáticamente con Supabase Auth (auth.users)
-- No necesitas crear una tabla usuarios personalizada

-- Crear tabla de empresas
CREATE TABLE empresas (
  id_empresa SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL
);

-- Crear tabla de sucursales
CREATE TABLE sucursales (
  id_sucursal SERIAL PRIMARY KEY,
  id_empresa INTEGER REFERENCES empresas(id_empresa),
  nombre VARCHAR(100) NOT NULL,
  ubicacion VARCHAR(200) NOT NULL
);

-- Crear tabla de productos
CREATE TABLE productos (
  id_producto SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  precio DECIMAL(10,2) NOT NULL
);

-- Crear tabla de ventas
CREATE TABLE ventas (
  id_venta SERIAL PRIMARY KEY,
  id_sucursal INTEGER REFERENCES sucursales(id_sucursal),
  id_producto INTEGER REFERENCES productos(id_producto),
  fecha DATE NOT NULL,
  cantidad INTEGER NOT NULL,
  total DECIMAL(10,2) NOT NULL
);

-- Insertar datos de ejemplo
-- Ejecuta el script completo database_setup.sql que incluye:
-- - 5 empresas con datos realistas
-- - 20 sucursales distribuidas geográficamente  
-- - 32 productos en 4 categorías
-- - 500+ ventas de los últimos 6 meses

-- Para crear usuarios, usa el panel de Supabase Auth o la API:
-- 1. Ve a Authentication > Users en el panel de Supabase
-- 2. Crea usuarios manualmente o
-- 3. Permite registro público desde Authentication > Settings
```

## Scripts de Base de Datos

### Scripts Disponibles:

1. **`database_setup.sql`** - Script completo con datos de ejemplo
2. **`preview_cleanup.sql`** - ⚠️ PREVIEW: Ver qué se eliminará (sin cambios)
3. **`cleanup_project_only.sql`** - ✅ SEGURO: Solo elimina tablas del proyecto
4. **`cleanup_database.sql`** - ⚠️ PELIGROSO: Elimina todas las tablas
5. **`reset_database.sql`** - ⚠️ PELIGROSO: Elimina y recrea estructura básica

### Opciones de Instalación:

#### ✅ Para Base de Datos Compartida (TU CASO)
```sql
-- Ejecutar en Supabase SQL Editor
-- 1. Ejecuta preview_cleanup.sql (ver qué se eliminará)
-- 2. Ejecuta cleanup_project_only.sql (eliminar solo proyecto)
-- 3. Ejecuta database_setup.sql (instalar proyecto)
```

#### Opción 1: Instalación Completa (Base de Datos Nueva)
```sql
-- Ejecutar en Supabase SQL Editor
-- 1. Ejecuta database_setup.sql (datos completos)
```

#### Opción 2: Instalación Limpia (Base de Datos Nueva)
```sql
-- Ejecutar en Supabase SQL Editor
-- 1. Ejecuta reset_database.sql (solo estructura)
-- 2. Ejecuta database_setup.sql (datos de ejemplo)
```

#### ⚠️ Opción 3: Limpiar Todo (Base de Datos Nueva)
```sql
-- Ejecutar en Supabase SQL Editor
-- 1. Ejecuta cleanup_database.sql (eliminar todo)
-- 2. Ejecuta database_setup.sql (reinstalar)
```

## Ejecutar el Proyecto

```bash
npm run dev
```

El proyecto estará disponible en `http://localhost:5173`

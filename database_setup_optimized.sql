-- Script optimizado para Dashboard de Ventas
-- 3 empresas, 3 sucursales cada una, con semaforización clara
-- Ejecutar este script en el editor SQL de Supabase

-- ========================================
-- CREAR ESTRUCTURA DE TABLAS
-- ========================================

-- Crear tabla de empresas
CREATE TABLE empresas (
  id_empresa SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de sucursales
CREATE TABLE sucursales (
  id_sucursal SERIAL PRIMARY KEY,
  id_empresa INTEGER REFERENCES empresas(id_empresa) ON DELETE CASCADE,
  nombre VARCHAR(100) NOT NULL,
  ubicacion VARCHAR(200) NOT NULL,
  telefono VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de productos
CREATE TABLE productos (
  id_producto SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de ventas
CREATE TABLE ventas (
  id_venta SERIAL PRIMARY KEY,
  id_sucursal INTEGER REFERENCES sucursales(id_sucursal) ON DELETE CASCADE,
  id_producto INTEGER REFERENCES productos(id_producto) ON DELETE CASCADE,
  fecha DATE NOT NULL,
  cantidad INTEGER NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- INSERTAR DATOS
-- ========================================

-- Insertar 3 empresas
INSERT INTO empresas (nombre, descripcion) VALUES 
('TechCorp Solutions', 'Empresa líder en tecnología y software empresarial'),
('RetailMax', 'Cadena de tiendas de retail y productos de consumo'),
('FashionStyle', 'Empresa de moda y accesorios de lujo');

-- Insertar 3 sucursales para cada empresa (9 total)
-- TechCorp Solutions (id_empresa = 1)
INSERT INTO sucursales (id_empresa, nombre, ubicacion, telefono) VALUES 
(1, 'Sede Central', 'Buenos Aires, Argentina', '+54-11-1234-5678'),
(1, 'Sucursal Córdoba', 'Córdoba, Argentina', '+54-351-987-6543'),
(1, 'Sucursal Rosario', 'Rosario, Argentina', '+54-341-456-7890');

-- RetailMax (id_empresa = 2)
INSERT INTO sucursales (id_empresa, nombre, ubicacion, telefono) VALUES 
(2, 'Tienda Principal', 'Buenos Aires, Argentina', '+54-11-2345-6789'),
(2, 'Shopping Norte', 'Buenos Aires, Argentina', '+54-11-3456-7890'),
(2, 'Centro Comercial', 'Córdoba, Argentina', '+54-351-876-5432');

-- FashionStyle (id_empresa = 3)
INSERT INTO sucursales (id_empresa, nombre, ubicacion, telefono) VALUES 
(3, 'Boutique Principal', 'Buenos Aires, Argentina', '+54-11-5678-9012'),
(3, 'Showroom Palermo', 'Buenos Aires, Argentina', '+54-11-6789-0123'),
(3, 'Tienda Córdoba', 'Córdoba, Argentina', '+54-351-654-3210');

-- Insertar productos (12 productos, 4 por categoría)
INSERT INTO productos (nombre, categoria, precio, descripcion) VALUES 
-- Electrónicos
('Laptop Dell XPS 13', 'Electrónicos', 1200.00, 'Laptop ultrabook de alta gama'),
('iPhone 15 Pro', 'Electrónicos', 1100.00, 'Smartphone premium de Apple'),
('Samsung Galaxy S24', 'Electrónicos', 900.00, 'Smartphone Android de última generación'),
('MacBook Air M2', 'Electrónicos', 1300.00, 'Laptop Apple con chip M2'),

-- Ropa
('Camisa Formal Azul', 'Ropa', 80.00, 'Camisa de vestir para oficina'),
('Pantalón Negro', 'Ropa', 120.00, 'Pantalón de vestir clásico'),
('Vestido Elegante', 'Ropa', 200.00, 'Vestido para ocasiones especiales'),
('Zapatos de Cuero', 'Ropa', 180.00, 'Zapatos formales de cuero genuino'),

-- Hogar
('Sofá 3 Plazas', 'Hogar', 800.00, 'Sofá cómodo para sala de estar'),
('Mesa de Comedor', 'Hogar', 600.00, 'Mesa de comedor para 6 personas'),
('Cama King Size', 'Hogar', 700.00, 'Cama matrimonial de gran tamaño'),
('Refrigerador', 'Hogar', 900.00, 'Refrigerador de 300L');

-- ========================================
-- INSERTAR VENTAS CON SEMAFORIZACIÓN CLARA
-- ========================================

-- TechCorp Solutions - Sede Central (VERDE: Supera meta)
-- Meta: $50,000 | Ventas: $75,000 (150% - VERDE)
INSERT INTO ventas (id_sucursal, id_producto, fecha, cantidad, total) VALUES 
(1, 1, '2024-01-15', 10, 12000.00),  -- Laptop Dell
(1, 2, '2024-01-20', 8, 8800.00),    -- iPhone
(1, 3, '2024-01-25', 12, 10800.00),  -- Samsung Galaxy
(1, 4, '2024-02-01', 6, 7800.00),    -- MacBook Air
(1, 1, '2024-02-10', 15, 18000.00),  -- Laptop Dell
(1, 2, '2024-02-15', 10, 11000.00),  -- iPhone
(1, 3, '2024-03-01', 8, 7200.00),    -- Samsung Galaxy
(1, 4, '2024-03-10', 4, 5200.00);    -- MacBook Air

-- TechCorp Solutions - Córdoba (AMARILLO: Cerca de meta)
-- Meta: $30,000 | Ventas: $25,000 (83% - AMARILLO)
INSERT INTO ventas (id_sucursal, id_producto, fecha, cantidad, total) VALUES 
(2, 1, '2024-01-18', 5, 6000.00),    -- Laptop Dell
(2, 2, '2024-01-22', 4, 4400.00),    -- iPhone
(2, 3, '2024-01-28', 6, 5400.00),    -- Samsung Galaxy
(2, 4, '2024-02-05', 3, 3900.00),    -- MacBook Air
(2, 1, '2024-02-12', 4, 4800.00),    -- Laptop Dell
(2, 2, '2024-02-18', 2, 2200.00);    -- iPhone

-- TechCorp Solutions - Rosario (ROJO: Muy por debajo de meta)
-- Meta: $20,000 | Ventas: $8,000 (40% - ROJO)
INSERT INTO ventas (id_sucursal, id_producto, fecha, cantidad, total) VALUES 
(3, 1, '2024-01-20', 2, 2400.00),    -- Laptop Dell
(3, 2, '2024-01-25', 1, 1100.00),    -- iPhone
(3, 3, '2024-01-30', 3, 2700.00),    -- Samsung Galaxy
(3, 4, '2024-02-08', 1, 1300.00),    -- MacBook Air
(3, 1, '2024-02-15', 1, 1200.00);    -- Laptop Dell

-- RetailMax - Tienda Principal (VERDE: Supera meta)
-- Meta: $40,000 | Ventas: $60,000 (150% - VERDE)
INSERT INTO ventas (id_sucursal, id_producto, fecha, cantidad, total) VALUES 
(4, 5, '2024-01-10', 50, 4000.00),   -- Camisa Formal
(4, 6, '2024-01-15', 30, 3600.00),   -- Pantalón Negro
(4, 7, '2024-01-20', 20, 4000.00),   -- Vestido Elegante
(4, 8, '2024-01-25', 25, 4500.00),   -- Zapatos de Cuero
(4, 5, '2024-02-01', 40, 3200.00),   -- Camisa Formal
(4, 6, '2024-02-10', 25, 3000.00),   -- Pantalón Negro
(4, 7, '2024-02-15', 15, 3000.00),   -- Vestido Elegante
(4, 8, '2024-03-01', 20, 3600.00),   -- Zapatos de Cuero
(4, 5, '2024-03-10', 35, 2800.00),   -- Camisa Formal
(4, 6, '2024-03-20', 20, 2400.00),   -- Pantalón Negro
(4, 7, '2024-04-01', 12, 2400.00),   -- Vestido Elegante
(4, 8, '2024-04-15', 15, 2700.00),   -- Zapatos de Cuero
(4, 5, '2024-05-01', 30, 2400.00),   -- Camisa Formal
(4, 6, '2024-05-15', 18, 2160.00),   -- Pantalón Negro
(4, 7, '2024-06-01', 10, 2000.00),   -- Vestido Elegante
(4, 8, '2024-06-15', 12, 2160.00),   -- Zapatos de Cuero
(4, 5, '2024-06-20', 25, 2000.00),   -- Camisa Formal
(4, 6, '2024-06-25', 15, 1800.00),   -- Pantalón Negro
(4, 7, '2024-06-30', 8, 1600.00),    -- Vestido Elegante
(4, 8, '2024-07-05', 10, 1800.00);   -- Zapatos de Cuero

-- RetailMax - Shopping Norte (AMARILLO: Cerca de meta)
-- Meta: $25,000 | Ventas: $22,000 (88% - AMARILLO)
INSERT INTO ventas (id_sucursal, id_producto, fecha, cantidad, total) VALUES 
(5, 5, '2024-01-12', 30, 2400.00),   -- Camisa Formal
(5, 6, '2024-01-18', 20, 2400.00),   -- Pantalón Negro
(5, 7, '2024-01-25', 15, 3000.00),   -- Vestido Elegante
(5, 8, '2024-02-02', 18, 3240.00),   -- Zapatos de Cuero
(5, 5, '2024-02-12', 25, 2000.00),   -- Camisa Formal
(5, 6, '2024-02-20', 15, 1800.00),   -- Pantalón Negro
(5, 7, '2024-03-05', 10, 2000.00),   -- Vestido Elegante
(5, 8, '2024-03-15', 12, 2160.00),   -- Zapatos de Cuero
(5, 5, '2024-04-01', 20, 1600.00),   -- Camisa Formal
(5, 6, '2024-04-15', 12, 1440.00),   -- Pantalón Negro
(5, 7, '2024-05-01', 8, 1600.00),    -- Vestido Elegante
(5, 8, '2024-05-15', 10, 1800.00);   -- Zapatos de Cuero

-- RetailMax - Centro Comercial (ROJO: Muy por debajo de meta)
-- Meta: $15,000 | Ventas: $6,000 (40% - ROJO)
INSERT INTO ventas (id_sucursal, id_producto, fecha, cantidad, total) VALUES 
(6, 5, '2024-01-15', 15, 1200.00),   -- Camisa Formal
(6, 6, '2024-01-22', 10, 1200.00),   -- Pantalón Negro
(6, 7, '2024-01-30', 8, 1600.00),    -- Vestido Elegante
(6, 8, '2024-02-08', 6, 1080.00),    -- Zapatos de Cuero
(6, 5, '2024-02-15', 12, 960.00),    -- Camisa Formal
(6, 6, '2024-02-25', 8, 960.00);     -- Pantalón Negro

-- FashionStyle - Boutique Principal (VERDE: Supera meta)
-- Meta: $30,000 | Ventas: $45,000 (150% - VERDE)
INSERT INTO ventas (id_sucursal, id_producto, fecha, cantidad, total) VALUES 
(7, 9, '2024-01-05', 8, 6400.00),    -- Sofá 3 Plazas
(7, 10, '2024-01-12', 6, 3600.00),   -- Mesa de Comedor
(7, 11, '2024-01-18', 5, 3500.00),   -- Cama King Size
(7, 12, '2024-01-25', 4, 3600.00),   -- Refrigerador
(7, 9, '2024-02-01', 6, 4800.00),    -- Sofá 3 Plazas
(7, 10, '2024-02-08', 4, 2400.00),   -- Mesa de Comedor
(7, 11, '2024-02-15', 3, 2100.00),   -- Cama King Size
(7, 12, '2024-02-22', 3, 2700.00),   -- Refrigerador
(7, 9, '2024-03-01', 5, 4000.00),    -- Sofá 3 Plazas
(7, 10, '2024-03-08', 3, 1800.00),   -- Mesa de Comedor
(7, 11, '2024-03-15', 2, 1400.00),   -- Cama King Size
(7, 12, '2024-03-22', 2, 1800.00),   -- Refrigerador
(7, 9, '2024-04-01', 4, 3200.00),    -- Sofá 3 Plazas
(7, 10, '2024-04-08', 2, 1200.00),   -- Mesa de Comedor
(7, 11, '2024-04-15', 1, 700.00),    -- Cama King Size
(7, 12, '2024-04-22', 1, 900.00);    -- Refrigerador

-- FashionStyle - Showroom Palermo (AMARILLO: Cerca de meta)
-- Meta: $20,000 | Ventas: $18,000 (90% - AMARILLO)
INSERT INTO ventas (id_sucursal, id_producto, fecha, cantidad, total) VALUES 
(8, 9, '2024-01-08', 5, 4000.00),    -- Sofá 3 Plazas
(8, 10, '2024-01-15', 4, 2400.00),   -- Mesa de Comedor
(8, 11, '2024-01-22', 3, 2100.00),   -- Cama King Size
(8, 12, '2024-01-30', 2, 1800.00),   -- Refrigerador
(8, 9, '2024-02-05', 4, 3200.00),    -- Sofá 3 Plazas
(8, 10, '2024-02-12', 3, 1800.00),   -- Mesa de Comedor
(8, 11, '2024-02-20', 2, 1400.00),   -- Cama King Size
(8, 12, '2024-02-28', 1, 900.00),    -- Refrigerador
(8, 9, '2024-03-05', 3, 2400.00),    -- Sofá 3 Plazas
(8, 10, '2024-03-12', 2, 1200.00);   -- Mesa de Comedor

-- FashionStyle - Tienda Córdoba (ROJO: Muy por debajo de meta)
-- Meta: $10,000 | Ventas: $4,000 (40% - ROJO)
INSERT INTO ventas (id_sucursal, id_producto, fecha, cantidad, total) VALUES 
(9, 9, '2024-01-10', 2, 1600.00),    -- Sofá 3 Plazas
(9, 10, '2024-01-18', 1, 600.00),    -- Mesa de Comedor
(9, 11, '2024-01-25', 1, 700.00),    -- Cama King Size
(9, 12, '2024-02-02', 1, 900.00),    -- Refrigerador
(9, 9, '2024-02-10', 1, 800.00);     -- Sofá 3 Plazas

-- ========================================
-- CREAR ÍNDICES PARA RENDIMIENTO
-- ========================================

CREATE INDEX idx_ventas_fecha ON ventas(fecha);
CREATE INDEX idx_ventas_sucursal ON ventas(id_sucursal);
CREATE INDEX idx_ventas_producto ON ventas(id_producto);
CREATE INDEX idx_sucursales_empresa ON sucursales(id_empresa);

-- ========================================
-- CREAR VISTAS PARA CONSULTAS RÁPIDAS
-- ========================================

-- Vista para estadísticas por empresa
CREATE VIEW vista_ventas_por_empresa AS
SELECT 
    e.id_empresa,
    e.nombre as empresa,
    COUNT(DISTINCT s.id_sucursal) as total_sucursales,
    COUNT(v.id_venta) as total_ventas,
    SUM(v.total) as ventas_totales,
    AVG(v.total) as promedio_venta
FROM empresas e
LEFT JOIN sucursales s ON e.id_empresa = s.id_empresa
LEFT JOIN ventas v ON s.id_sucursal = v.id_sucursal
GROUP BY e.id_empresa, e.nombre;

-- Vista para estadísticas por sucursal
CREATE VIEW vista_ventas_por_sucursal AS
SELECT 
    s.id_sucursal,
    s.nombre as sucursal,
    e.nombre as empresa,
    s.ubicacion,
    COUNT(v.id_venta) as total_ventas,
    SUM(v.total) as ventas_totales,
    AVG(v.total) as promedio_venta
FROM sucursales s
LEFT JOIN empresas e ON s.id_empresa = e.id_empresa
LEFT JOIN ventas v ON s.id_sucursal = v.id_sucursal
GROUP BY s.id_sucursal, s.nombre, e.nombre, s.ubicacion;

-- Vista para estadísticas por producto
CREATE VIEW vista_ventas_por_producto AS
SELECT 
    p.id_producto,
    p.nombre as producto,
    p.categoria,
    p.precio,
    COUNT(v.id_venta) as total_ventas,
    SUM(v.cantidad) as cantidad_vendida,
    SUM(v.total) as ventas_totales
FROM productos p
LEFT JOIN ventas v ON p.id_producto = v.id_producto
GROUP BY p.id_producto, p.nombre, p.categoria, p.precio;

-- ========================================
-- VERIFICAR INSTALACIÓN
-- ========================================

-- Mostrar resumen de datos insertados
SELECT 'RESUMEN DE DATOS INSERTADOS:' as info;
SELECT 'Empresas:' as tipo, COUNT(*) as cantidad FROM empresas
UNION ALL
SELECT 'Sucursales:', COUNT(*) FROM sucursales
UNION ALL
SELECT 'Productos:', COUNT(*) FROM productos
UNION ALL
SELECT 'Ventas:', COUNT(*) FROM ventas;

-- Mostrar ventas por empresa con semaforización
SELECT 
    e.nombre as empresa,
    COALESCE(SUM(v.total), 0) as ventas_totales,
    CASE 
        WHEN COALESCE(SUM(v.total), 0) >= 100000 THEN '🟢 VERDE (Excelente)'
        WHEN COALESCE(SUM(v.total), 0) >= 50000 THEN '🟡 AMARILLO (Bueno)'
        ELSE '🔴 ROJO (Necesita Mejora)'
    END as semaforo
FROM empresas e
LEFT JOIN sucursales s ON e.id_empresa = s.id_empresa
LEFT JOIN ventas v ON s.id_sucursal = v.id_sucursal
GROUP BY e.id_empresa, e.nombre
ORDER BY ventas_totales DESC;

SELECT 'Base de datos configurada correctamente con semaforización clara!' as mensaje_final;

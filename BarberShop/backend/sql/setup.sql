-- ========================================================
-- BARBERSHOP - SCRIPT DE SETUP INICIAL
-- ========================================================
-- Este script configura la base de datos completamente
-- Ejecutar DESPUÉS de que Django haya creado las tablas
-- 
-- Orden de ejecución:
-- 1. python manage.py migrate (crea tablas)
-- 2. psql -U postgres -d barbershop < backend/sql/setup.sql
-- ========================================================

-- ===============================================
-- 1. AGREGAR CAMPOS DE AUTENTICACIÓN A PROFILES
-- ===============================================
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE;

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS password VARCHAR(128);

UPDATE profiles 
SET email = CONCAT('user', id_profile, '@temp.com')
WHERE email IS NULL;

ALTER TABLE profiles 
ALTER COLUMN email SET NOT NULL;

ALTER TABLE profiles 
ALTER COLUMN password SET NOT NULL;

-- ===============================================
-- 2. AGREGAR CAMPO DE SERVICIO PERSONALIZADO
-- ===============================================
ALTER TABLE citas 
ADD COLUMN IF NOT EXISTS servicio_personalizado TEXT NULL;

-- ===============================================
-- 3. INSERTAR 6 BARBERÍAS
-- ===============================================
INSERT INTO barberias (nombre_barberia, direccion, telefono, timezone, slug, portada_url, barberia_active, created_at)
VALUES 
('The Classic Barber', 'Av. Reforma 123, Col. Centro', '951-123-4567', 'America/Mexico_City', 'the-classic-barber', 'https://example.com/classic.jpg', true, NOW()),
('El Barbero Moderno', 'Calle Independencia 456, Col. Reforma', '951-234-5678', 'America/Mexico_City', 'el-barbero-moderno', 'https://example.com/moderno.jpg', true, NOW()),
('Estilo y Elegancia', 'Av. Universidad 789, Col. Universidad', '951-345-6789', 'America/Mexico_City', 'estilo-elegancia', 'https://example.com/estilo.jpg', true, NOW()),
('Barbería Premium', 'Calle 5 de Mayo 321, Col. Jalatlaco', '951-456-7890', 'America/Mexico_City', 'barberia-premium', 'https://example.com/premium.jpg', true, NOW()),
('Cortes Express', 'Av. Símbolos Patrios 654, Col. Reforma', '951-567-8901', 'America/Mexico_City', 'cortes-express', 'https://example.com/express.jpg', true, NOW()),
('Tijeras y Estilo', 'Calle Morelos 987, Col. Centro', '951-678-9012', 'America/Mexico_City', 'tijeras-estilo', 'https://example.com/tijeras.jpg', true, NOW())
ON CONFLICT (slug) DO UPDATE
SET nombre_barberia = EXCLUDED.nombre_barberia,
    barberia_active = EXCLUDED.barberia_active;

-- ===============================================
-- 4. INSERTAR 23 BARBEROS DISTRIBUIDOS
-- ===============================================
-- Barbería 1: The Classic Barber (5 barberos)
INSERT INTO barberos (id_barberia, nombre_barbero, especialidades, anios_experiencia, calificacion, foto_url, created_at)
VALUES 
(1, 'Carlos Mendoza', 'Fade y Degradados', 8, 4.9, 'https://randomuser.me/api/portraits/men/1.jpg', NOW()),
(1, 'Miguel Torres', 'Cortes Clásicos', 12, 4.8, 'https://randomuser.me/api/portraits/men/2.jpg', NOW()),
(1, 'Diego Ramírez', 'Diseño de Barba', 11, 4.9, 'https://randomuser.me/api/portraits/men/3.jpg', NOW()),
(1, 'Alexis Vargas', 'Fade y Degradados', 5, 4.7, 'https://randomuser.me/api/portraits/men/4.jpg', NOW()),
(1, 'Roberto Sánchez', 'Todo Tipo de Cortes', 9, 4.6, 'https://randomuser.me/api/portraits/men/5.jpg', NOW())
ON CONFLICT DO NOTHING;

-- Barbería 2: El Barbero Moderno (4 barberos)
INSERT INTO barberos (id_barberia, nombre_barbero, especialidades, anios_experiencia, calificacion, foto_url, created_at)
VALUES 
(2, 'Samuel Herrera', 'Fade y Degradados', 7, 4.8, 'https://randomuser.me/api/portraits/men/6.jpg', NOW()),
(2, 'Eduardo Morales', 'Cortes Clásicos', 20, 4.9, 'https://randomuser.me/api/portraits/men/7.jpg', NOW()),
(2, 'Roberto Díaz', 'Barba y Afeitado', 6, 4.6, 'https://randomuser.me/api/portraits/men/8.jpg', NOW()),
(2, 'Luis García', 'Todo Tipo de Cortes', 15, 4.8, 'https://randomuser.me/api/portraits/men/9.jpg', NOW())
ON CONFLICT DO NOTHING;

-- Barbería 3: Estilo y Elegancia (4 barberos)
INSERT INTO barberos (id_barberia, nombre_barbero, especialidades, anios_experiencia, calificacion, foto_url, created_at)
VALUES 
(3, 'Pablo Jiménez', 'Cortes Clásicos', 14, 4.7, 'https://randomuser.me/api/portraits/men/10.jpg', NOW()),
(3, 'Fernando Silva', 'Cortes Modernos', 9, 4.8, 'https://randomuser.me/api/portraits/men/11.jpg', NOW()),
(3, 'Andrés López', 'Fade y Diseño', 7, 4.7, 'https://randomuser.me/api/portraits/men/12.jpg', NOW()),
(3, 'Javier Romero', 'Barba Especializada', 10, 4.9, 'https://randomuser.me/api/portraits/men/13.jpg', NOW())
ON CONFLICT DO NOTHING;

-- Barbería 4: Barbería Premium (3 barberos)
INSERT INTO barberos (id_barberia, nombre_barbero, especialidades, anios_experiencia, calificacion, foto_url, created_at)
VALUES 
(4, 'Enrique Castillo', 'Cortes Tradicionales', 25, 5.0, 'https://randomuser.me/api/portraits/men/14.jpg', NOW()),
(4, 'Raúl Flores', 'Barba Clásica', 18, 4.8, 'https://randomuser.me/api/portraits/men/15.jpg', NOW()),
(4, 'Alberto Medina', 'Todo Tipo de Cortes', 13, 4.7, 'https://randomuser.me/api/portraits/men/16.jpg', NOW())
ON CONFLICT DO NOTHING;

-- Barbería 5: Cortes Express (4 barberos)
INSERT INTO barberos (id_barberia, nombre_barbero, especialidades, anios_experiencia, calificacion, foto_url, created_at)
VALUES 
(5, 'Ricardo Vega', 'Estilos Modernos', 6, 4.6, 'https://randomuser.me/api/portraits/men/17.jpg', NOW()),
(5, 'Daniel Cruz', 'Fade y Color', 8, 4.7, 'https://randomuser.me/api/portraits/men/18.jpg', NOW()),
(5, 'Sergio Ruiz', 'Diseños Creativos', 5, 4.5, 'https://randomuser.me/api/portraits/men/19.jpg', NOW()),
(5, 'Omar Reyes', 'Cortes Urbanos', 7, 4.6, 'https://randomuser.me/api/portraits/men/20.jpg', NOW())
ON CONFLICT DO NOTHING;

-- Barbería 6: Tijeras y Estilo (3 barberos)
INSERT INTO barberos (id_barberia, nombre_barbero, especialidades, anios_experiencia, calificacion, foto_url, created_at)
VALUES 
(6, 'Arturo Mendez', 'Afeitado Navaja', 22, 4.9, 'https://randomuser.me/api/portraits/men/21.jpg', NOW()),
(6, 'Gabriel Ortiz', 'Barba Premium', 16, 4.8, 'https://randomuser.me/api/portraits/men/22.jpg', NOW()),
(6, 'Mario Gutiérrez', 'Cortes Premium', 19, 4.9, 'https://randomuser.me/api/portraits/men/23.jpg', NOW())
ON CONFLICT DO NOTHING;

-- ===============================================
-- 5. INSERTAR 6 SERVICIOS
-- ===============================================
INSERT INTO servicios (nombre_servicio, description, servicio_active, created_at)
VALUES 
('Corte de Cabello', 'Corte de cabello profesional con tijeras y máquina', true, NOW()),
('Corte + Barba', 'Servicio completo: corte de cabello y arreglo de barba', true, NOW()),
('Arreglo de Barba', 'Perfilado y diseño de barba profesional', true, NOW()),
('Afeitado Clásico', 'Afeitado tradicional con navaja y toalla caliente', true, NOW()),
('Corte Infantil', 'Corte especializado para niños', true, NOW()),
('Servicio Personalizado', 'Describe el servicio que necesitas - El barbero te contactará', true, NOW())
ON CONFLICT DO NOTHING;

-- ===============================================
-- 6. INSERTAR PRECIOS Y DURACIONES (barberia_servicios)
-- ===============================================

-- Barbería 1: The Classic Barber
INSERT INTO barberia_servicios (id_barberia, id_servicio, precio_BarbServ, duracion_min, created_at)
VALUES 
(1, 1, 150, '30', NOW()),
(1, 2, 300, '60', NOW()),
(1, 3, 120, '25', NOW()),
(1, 4, 180, '35', NOW()),
(1, 5, 100, '25', NOW()),
(1, 6, 0, '0', NOW())
ON CONFLICT (id_barberia, id_servicio) DO UPDATE
SET precio_BarbServ = EXCLUDED.precio_BarbServ, duracion_min = EXCLUDED.duracion_min;

-- Barbería 2: El Barbero Moderno
INSERT INTO barberia_servicios (id_barberia, id_servicio, precio_BarbServ, duracion_min, created_at)
VALUES 
(2, 1, 140, '30', NOW()),
(2, 2, 280, '60', NOW()),
(2, 3, 110, '25', NOW()),
(2, 4, 170, '35', NOW()),
(2, 5, 90, '25', NOW()),
(2, 6, 0, '0', NOW())
ON CONFLICT (id_barberia, id_servicio) DO UPDATE
SET precio_BarbServ = EXCLUDED.precio_BarbServ, duracion_min = EXCLUDED.duracion_min;

-- Barbería 3: Estilo y Elegancia
INSERT INTO barberia_servicios (id_barberia, id_servicio, precio_BarbServ, duracion_min, created_at)
VALUES 
(3, 1, 160, '30', NOW()),
(3, 2, 320, '60', NOW()),
(3, 3, 130, '25', NOW()),
(3, 4, 200, '35', NOW()),
(3, 5, 110, '25', NOW()),
(3, 6, 0, '0', NOW())
ON CONFLICT (id_barberia, id_servicio) DO UPDATE
SET precio_BarbServ = EXCLUDED.precio_BarbServ, duracion_min = EXCLUDED.duracion_min;

-- Barbería 4: Barbería Premium
INSERT INTO barberia_servicios (id_barberia, id_servicio, precio_BarbServ, duracion_min, created_at)
VALUES 
(4, 1, 200, '30', NOW()),
(4, 2, 400, '60', NOW()),
(4, 3, 180, '25', NOW()),
(4, 4, 250, '35', NOW()),
(4, 5, 150, '25', NOW()),
(4, 6, 0, '0', NOW())
ON CONFLICT (id_barberia, id_servicio) DO UPDATE
SET precio_BarbServ = EXCLUDED.precio_BarbServ, duracion_min = EXCLUDED.duracion_min;

-- Barbería 5: Cortes Express
INSERT INTO barberia_servicios (id_barberia, id_servicio, precio_BarbServ, duracion_min, created_at)
VALUES 
(5, 1, 120, '30', NOW()),
(5, 2, 240, '60', NOW()),
(5, 3, 100, '25', NOW()),
(5, 4, 150, '35', NOW()),
(5, 5, 80, '25', NOW()),
(5, 6, 0, '0', NOW())
ON CONFLICT (id_barberia, id_servicio) DO UPDATE
SET precio_BarbServ = EXCLUDED.precio_BarbServ, duracion_min = EXCLUDED.duracion_min;

-- Barbería 6: Tijeras y Estilo
INSERT INTO barberia_servicios (id_barberia, id_servicio, precio_BarbServ, duracion_min, created_at)
VALUES 
(6, 1, 170, '30', NOW()),
(6, 2, 340, '60', NOW()),
(6, 3, 140, '25', NOW()),
(6, 4, 220, '35', NOW()),
(6, 5, 120, '25', NOW()),
(6, 6, 0, '0', NOW())
ON CONFLICT (id_barberia, id_servicio) DO UPDATE
SET precio_BarbServ = EXCLUDED.precio_BarbServ, duracion_min = EXCLUDED.duracion_min;

-- ===============================================
-- VERIFICACIÓN FINAL
-- ===============================================
SELECT COUNT(*) as total_barberias FROM barberias;
SELECT COUNT(*) as total_barberos FROM barberos;
SELECT COUNT(*) as total_servicios FROM servicios;
SELECT COUNT(*) as total_relaciones FROM barberia_servicios;

-- ===============================================
-- FIN DEL SETUP
-- ===============================================

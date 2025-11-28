-- Script para insertar precios y duraciones de servicios en barberia_servicios
-- Esto relaciona las barberías con los servicios y sus precios específicos

-- Barbería 1 (Premium Cuts) - Todos los servicios
INSERT INTO barberia_servicios (id_barberia, id_servicio, precio_BarbServ, duracion_min, created_at)
VALUES 
(1, 1, 150, '30', NOW()),  -- Corte Clásico
(1, 2, 180, '45', NOW()),  -- Fade Moderno
(1, 3, 250, '60', NOW()),  -- Corte + Barba
(1, 4, 120, '20', NOW()),  -- Arreglo de Barba
(1, 5, 100, '25', NOW()),  -- Corte Infantil
(1, 6, 350, '90', NOW())   -- Paquete Premium
ON CONFLICT (id_barberia, id_servicio) DO UPDATE
SET precio_BarbServ = EXCLUDED.precio_BarbServ, duracion_min = EXCLUDED.duracion_min;

-- Barbería 2 (Barbería Central) - Precios ligeramente diferentes
INSERT INTO barberia_servicios (id_barberia, id_servicio, precio_BarbServ, duracion_min, created_at)
VALUES 
(2, 1, 140, '30', NOW()),  -- Corte Clásico
(2, 2, 170, '45', NOW()),  -- Fade Moderno
(2, 3, 230, '60', NOW()),  -- Corte + Barba
(2, 4, 110, '20', NOW()),  -- Arreglo de Barba
(2, 5, 90, '25', NOW()),   -- Corte Infantil
(2, 6, 320, '90', NOW())   -- Paquete Premium
ON CONFLICT (id_barberia, id_servicio) DO UPDATE
SET precio_BarbServ = EXCLUDED.precio_BarbServ, duracion_min = EXCLUDED.duracion_min;

-- Barbería 3 (Barber & Co) - Precios premium
INSERT INTO barberia_servicios (id_barberia, id_servicio, precio_BarbServ, duracion_min, created_at)
VALUES 
(3, 1, 160, '30', NOW()),  -- Corte Clásico
(3, 2, 200, '45', NOW()),  -- Fade Moderno
(3, 3, 280, '60', NOW()),  -- Corte + Barba
(3, 4, 130, '20', NOW()),  -- Arreglo de Barba
(3, 5, 110, '25', NOW()),  -- Corte Infantil
(3, 6, 380, '90', NOW())   -- Paquete Premium
ON CONFLICT (id_barberia, id_servicio) DO UPDATE
SET precio_BarbServ = EXCLUDED.precio_BarbServ, duracion_min = EXCLUDED.duracion_min;

-- Verificar los datos insertados
SELECT bs.id, b.nombre_barberia, s.nombre_servicio, bs.precio_BarbServ, bs.duracion_min
FROM barberia_servicios bs
INNER JOIN barberias b ON bs.id_barberia = b.id_barberias
INNER JOIN servicios s ON bs.id_servicio = s.id_servicio
ORDER BY b.id_barberias, s.id_servicio;

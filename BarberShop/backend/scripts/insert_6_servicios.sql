-- Script para insertar 6 servicios: 5 comunes + 1 servicio personalizado

-- Limpiar servicios anteriores si es necesario
-- DELETE FROM barberia_servicios;
-- DELETE FROM servicios;

-- Insertar los 6 servicios
INSERT INTO servicios (nombre_servicio, description, servicio_active, created_at)
VALUES 
('Corte de Cabello', 'Corte de cabello profesional con tijeras y máquina', true, NOW()),
('Corte + Barba', 'Servicio completo: corte de cabello y arreglo de barba', true, NOW()),
('Arreglo de Barba', 'Perfilado y diseño de barba profesional', true, NOW()),
('Afeitado Clásico', 'Afeitado tradicional con navaja y toalla caliente', true, NOW()),
('Corte Infantil', 'Corte especializado para niños', true, NOW()),
('Servicio Personalizado', 'Describe el servicio que necesitas - El barbero te contactará', true, NOW())
ON CONFLICT DO NOTHING;

-- Insertar precios para barberías (5 servicios comunes)
-- El servicio personalizado (id 6) no tiene precio fijo

-- Barbería 1: Premium Cuts
INSERT INTO barberia_servicios (id_barberia, id_servicio, "precio_BarbServ", duracion_min, created_at)
VALUES 
(1, 1, 200, '30', NOW()),  -- Corte de Cabello
(1, 2, 350, '60', NOW()),  -- Corte + Barba
(1, 3, 180, '25', NOW()),  -- Arreglo de Barba
(1, 4, 250, '35', NOW()),  -- Afeitado Clásico
(1, 5, 150, '25', NOW()),  -- Corte Infantil
(1, 6, 0, '0', NOW())      -- Servicio Personalizado (precio pendiente)
ON CONFLICT (id_barberia, id_servicio) DO UPDATE
SET "precio_BarbServ" = EXCLUDED."precio_BarbServ", duracion_min = EXCLUDED.duracion_min;

-- Barbería 2: Barbería Central
INSERT INTO barberia_servicios (id_barberia, id_servicio, "precio_BarbServ", duracion_min, created_at)
VALUES 
(2, 1, 180, '30', NOW()),
(2, 2, 320, '60', NOW()),
(2, 3, 160, '25', NOW()),
(2, 4, 220, '35', NOW()),
(2, 5, 130, '25', NOW()),
(2, 6, 0, '0', NOW())
ON CONFLICT (id_barberia, id_servicio) DO UPDATE
SET "precio_BarbServ" = EXCLUDED."precio_BarbServ", duracion_min = EXCLUDED.duracion_min;

-- Barbería 3: Barber & Co
INSERT INTO barberia_servicios (id_barberia, id_servicio, "precio_BarbServ", duracion_min, created_at)
VALUES 
(3, 1, 220, '30', NOW()),
(3, 2, 380, '60', NOW()),
(3, 3, 200, '25', NOW()),
(3, 4, 280, '35', NOW()),
(3, 5, 170, '25', NOW()),
(3, 6, 0, '0', NOW())
ON CONFLICT (id_barberia, id_servicio) DO UPDATE
SET "precio_BarbServ" = EXCLUDED."precio_BarbServ", duracion_min = EXCLUDED.duracion_min;

-- Barbería 4: El Clásico
INSERT INTO barberia_servicios (id_barberia, id_servicio, "precio_BarbServ", duracion_min, created_at)
VALUES 
(4, 1, 190, '30', NOW()),
(4, 2, 340, '60', NOW()),
(4, 3, 170, '25', NOW()),
(4, 4, 260, '40', NOW()),
(4, 5, 140, '25', NOW()),
(4, 6, 0, '0', NOW())
ON CONFLICT (id_barberia, id_servicio) DO UPDATE
SET "precio_BarbServ" = EXCLUDED."precio_BarbServ", duracion_min = EXCLUDED.duracion_min;

-- Barbería 5: Urban Style
INSERT INTO barberia_servicios (id_barberia, id_servicio, "precio_BarbServ", duracion_min, created_at)
VALUES 
(5, 1, 210, '30', NOW()),
(5, 2, 360, '60', NOW()),
(5, 3, 190, '25', NOW()),
(5, 4, 270, '35', NOW()),
(5, 5, 160, '25', NOW()),
(5, 6, 0, '0', NOW())
ON CONFLICT (id_barberia, id_servicio) DO UPDATE
SET "precio_BarbServ" = EXCLUDED."precio_BarbServ", duracion_min = EXCLUDED.duracion_min;

-- Barbería 6: La Navaja de Oro
INSERT INTO barberia_servicios (id_barberia, id_servicio, "precio_BarbServ", duracion_min, created_at)
VALUES 
(6, 1, 230, '35', NOW()),
(6, 2, 400, '70', NOW()),
(6, 3, 210, '30', NOW()),
(6, 4, 300, '45', NOW()),
(6, 5, 180, '30', NOW()),
(6, 6, 0, '0', NOW())
ON CONFLICT (id_barberia, id_servicio) DO UPDATE
SET "precio_BarbServ" = EXCLUDED."precio_BarbServ", duracion_min = EXCLUDED.duracion_min;

-- Verificar servicios y precios
SELECT s.id_servicio, s.nombre_servicio, s.description
FROM servicios s
ORDER BY s.id_servicio;

-- Verificar precios por barbería
SELECT b.nombre_barberia, s.nombre_servicio, bs."precio_BarbServ", bs.duracion_min
FROM barberia_servicios bs
INNER JOIN barberias b ON bs.id_barberia = b.id_barberias
INNER JOIN servicios s ON bs.id_servicio = s.id_servicio
ORDER BY b.id_barberias, s.id_servicio;

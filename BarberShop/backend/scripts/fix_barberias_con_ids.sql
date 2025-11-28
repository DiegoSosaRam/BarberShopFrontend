-- Script para GARANTIZAR que existen 6 barberías con IDs específicos 1-6
-- Primero eliminamos las barberías existentes para evitar conflictos de slug

-- PASO 1: Eliminar barberías existentes (esto requiere eliminar dependencias primero)
DELETE FROM citas;
DELETE FROM barberia_servicios;
DELETE FROM barberos;
DELETE FROM barberias;

-- PASO 2: Insertar las 6 barberías CON id_barberias EXPLÍCITO
INSERT INTO barberias (id_barberias, nombre_barberia, direccion, telefono, timezone, slug, portada_url, barberia_active, created_at)
VALUES 
(1, 'Premium Cuts', 'Av. Reforma 123, Col. Centro', '951-123-4567', 'America/Mexico_City', 'premium-cuts', 'https://example.com/premium.jpg', true, NOW()),
(2, 'Barbería Central', 'Calle Independencia 456, Col. Reforma', '951-234-5678', 'America/Mexico_City', 'barberia-central', 'https://example.com/central.jpg', true, NOW()),
(3, 'Barber & Co', 'Av. Universidad 789, Col. Universidad', '951-345-6789', 'America/Mexico_City', 'barber-co', 'https://example.com/barberco.jpg', true, NOW()),
(4, 'El Clásico', 'Calle 5 de Mayo 321, Col. Jalatlaco', '951-456-7890', 'America/Mexico_City', 'el-clasico', 'https://example.com/clasico.jpg', true, NOW()),
(5, 'Urban Style', 'Av. Símbolos Patrios 654, Col. Reforma', '951-567-8901', 'America/Mexico_City', 'urban-style', 'https://example.com/urban.jpg', true, NOW()),
(6, 'La Navaja de Oro', 'Calle Morelos 987, Col. Centro', '951-678-9012', 'America/Mexico_City', 'navaja-oro', 'https://example.com/navaja.jpg', true, NOW());

-- PASO 3: Actualizar la secuencia para que el próximo INSERT automático use id 7
SELECT setval('barberias_id_barberias_seq', 6);

-- PASO 4: Verificar las 6 barberías
SELECT id_barberias, nombre_barberia, direccion, telefono, barberia_active
FROM barberias
ORDER BY id_barberias;

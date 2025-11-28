-- Script para insertar 6 barberías con datos realistas

-- Limpiar datos anteriores si es necesario (CUIDADO: esto borrará todas las citas)
-- DELETE FROM citas;
-- DELETE FROM barbero_servicios;
-- DELETE FROM barberia_servicios;
-- DELETE FROM barberos;
-- DELETE FROM barberias;

-- Insertar 6 barberías
INSERT INTO barberias (nombre_barberia, direccion, telefono, timezone, slug, portada_url, barberia_active, created_at)
VALUES 
('Premium Cuts', 'Av. Reforma 123, Col. Centro', '951-123-4567', 'America/Mexico_City', 'premium-cuts', 'https://example.com/premium.jpg', true, NOW()),
('Barbería Central', 'Calle Independencia 456, Col. Reforma', '951-234-5678', 'America/Mexico_City', 'barberia-central', 'https://example.com/central.jpg', true, NOW()),
('Barber & Co', 'Av. Universidad 789, Col. Universidad', '951-345-6789', 'America/Mexico_City', 'barber-co', 'https://example.com/barberco.jpg', true, NOW()),
('El Clásico', 'Calle 5 de Mayo 321, Col. Jalatlaco', '951-456-7890', 'America/Mexico_City', 'el-clasico', 'https://example.com/clasico.jpg', true, NOW()),
('Urban Style', 'Av. Símbolos Patrios 654, Col. Reforma', '951-567-8901', 'America/Mexico_City', 'urban-style', 'https://example.com/urban.jpg', true, NOW()),
('La Navaja de Oro', 'Calle Morelos 987, Col. Centro', '951-678-9012', 'America/Mexico_City', 'navaja-oro', 'https://example.com/navaja.jpg', true, NOW())
ON CONFLICT (slug) DO UPDATE
SET nombre_barberia = EXCLUDED.nombre_barberia,
    direccion = EXCLUDED.direccion,
    telefono = EXCLUDED.telefono;

-- Verificar las barberías insertadas
SELECT id_barberias, nombre_barberia, direccion, telefono, barberia_active
FROM barberias
ORDER BY id_barberias;

-- Script para insertar 10 barberos en diferentes barberías
-- Asume que ya existen las barberías con id_barberias 1, 2, 3, 4

-- Barberos de Barbería 1 (Premium Cuts) - 3 barberos
INSERT INTO barberos (id_barberia, nombre_barbero, especialidades, anios_experiencia, calificacion, foto_url, created_at)
VALUES 
(1, 'Carlos Mendoza', 'Fade y Degradados', 8, 4.9, 'https://example.com/carlos.jpg', NOW()),
(1, 'Alexis Vargas', 'Fade y Degradados', 5, 4.7, 'https://example.com/alexis.jpg', NOW()),
(1, 'Miguel Torres', 'Cortes Clásicos', 12, 4.8, 'https://example.com/miguel.jpg', NOW());

-- Barberos de Barbería 2 (Barbería Central) - 3 barberos
INSERT INTO barberos (id_barberia, nombre_barbero, especialidades, anios_experiencia, calificacion, foto_url, created_at)
VALUES 
(2, 'Samuel Herrera', 'Fade y Degradados', 7, 4.8, 'https://example.com/samuel.jpg', NOW()),
(2, 'Eduardo Morales', 'Cortes Clásicos', 20, 4.9, 'https://example.com/eduardo.jpg', NOW()),
(2, 'Roberto Díaz', 'Barba y Afeitado', 6, 4.6, 'https://example.com/roberto.jpg', NOW());

-- Barberos de Barbería 3 (Barber & Co) - 2 barberos
INSERT INTO barberos (id_barberia, nombre_barbero, especialidades, anios_experiencia, calificacion, foto_url, created_at)
VALUES 
(3, 'Pablo Jiménez', 'Cortes Clásicos', 14, 4.7, 'https://example.com/pablo.jpg', NOW()),
(3, 'Fernando Silva', 'Cortes Modernos', 9, 4.8, 'https://example.com/fernando.jpg', NOW());

-- Barberos de Barbería 4 (si existe) - 2 barberos
-- Si no tienes una cuarta barbería, crea una primero o asigna estos a las existentes
INSERT INTO barberos (id_barberia, nombre_barbero, especialidades, anios_experiencia, calificacion, foto_url, created_at)
VALUES 
(1, 'Diego Ramírez', 'Diseño de Barba', 11, 4.9, 'https://example.com/diego.jpg', NOW()),
(2, 'Luis García', 'Todo Tipo de Cortes', 15, 4.8, 'https://example.com/luis.jpg', NOW());

-- Verificar los barberos insertados
SELECT b.id_barbero, b.nombre_barbero, b.especialidades, b.anios_experiencia, b.calificacion, 
       bb.nombre_barberia, bb.id_barberias
FROM barberos b
INNER JOIN barberias bb ON b.id_barberia = bb.id_barberias
ORDER BY bb.id_barberias, b.id_barbero;

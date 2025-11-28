-- Script para insertar 23 barberos distribuidos en 6 barberías (3-5 por barbería)

-- Barbería 1: Premium Cuts (5 barberos)
INSERT INTO barberos (id_barberia, nombre_barbero, especialidades, anios_experiencia, calificacion, foto_url, created_at)
VALUES 
(1, 'Carlos Mendoza', 'Fade y Degradados', 8, 4.9, 'https://randomuser.me/api/portraits/men/1.jpg', NOW()),
(1, 'Miguel Torres', 'Cortes Clásicos', 12, 4.8, 'https://randomuser.me/api/portraits/men/2.jpg', NOW()),
(1, 'Diego Ramírez', 'Diseño de Barba', 11, 4.9, 'https://randomuser.me/api/portraits/men/3.jpg', NOW()),
(1, 'Alexis Vargas', 'Fade y Degradados', 5, 4.7, 'https://randomuser.me/api/portraits/men/4.jpg', NOW()),
(1, 'Roberto Sánchez', 'Todo Tipo de Cortes', 9, 4.6, 'https://randomuser.me/api/portraits/men/5.jpg', NOW());

-- Barbería 2: Barbería Central (4 barberos)
INSERT INTO barberos (id_barberia, nombre_barbero, especialidades, anios_experiencia, calificacion, foto_url, created_at)
VALUES 
(2, 'Samuel Herrera', 'Fade y Degradados', 7, 4.8, 'https://randomuser.me/api/portraits/men/6.jpg', NOW()),
(2, 'Eduardo Morales', 'Cortes Clásicos', 20, 4.9, 'https://randomuser.me/api/portraits/men/7.jpg', NOW()),
(2, 'Roberto Díaz', 'Barba y Afeitado', 6, 4.6, 'https://randomuser.me/api/portraits/men/8.jpg', NOW()),
(2, 'Luis García', 'Todo Tipo de Cortes', 15, 4.8, 'https://randomuser.me/api/portraits/men/9.jpg', NOW());

-- Barbería 3: Barber & Co (4 barberos)
INSERT INTO barberos (id_barberia, nombre_barbero, especialidades, anios_experiencia, calificacion, foto_url, created_at)
VALUES 
(3, 'Pablo Jiménez', 'Cortes Clásicos', 14, 4.7, 'https://randomuser.me/api/portraits/men/10.jpg', NOW()),
(3, 'Fernando Silva', 'Cortes Modernos', 9, 4.8, 'https://randomuser.me/api/portraits/men/11.jpg', NOW()),
(3, 'Andrés López', 'Fade y Diseño', 7, 4.7, 'https://randomuser.me/api/portraits/men/12.jpg', NOW()),
(3, 'Javier Romero', 'Barba Especializada', 10, 4.9, 'https://randomuser.me/api/portraits/men/13.jpg', NOW());

-- Barbería 4: El Clásico (3 barberos)
INSERT INTO barberos (id_barberia, nombre_barbero, especialidades, anios_experiencia, calificacion, foto_url, created_at)
VALUES 
(4, 'Enrique Castillo', 'Cortes Tradicionales', 25, 5.0, 'https://randomuser.me/api/portraits/men/14.jpg', NOW()),
(4, 'Raúl Flores', 'Barba Clásica', 18, 4.8, 'https://randomuser.me/api/portraits/men/15.jpg', NOW()),
(4, 'Alberto Medina', 'Todo Tipo de Cortes', 13, 4.7, 'https://randomuser.me/api/portraits/men/16.jpg', NOW());

-- Barbería 5: Urban Style (4 barberos)
INSERT INTO barberos (id_barberia, nombre_barbero, especialidades, anios_experiencia, calificacion, foto_url, created_at)
VALUES 
(5, 'Ricardo Vega', 'Estilos Modernos', 6, 4.6, 'https://randomuser.me/api/portraits/men/17.jpg', NOW()),
(5, 'Daniel Cruz', 'Fade y Color', 8, 4.7, 'https://randomuser.me/api/portraits/men/18.jpg', NOW()),
(5, 'Sergio Ruiz', 'Diseños Creativos', 5, 4.5, 'https://randomuser.me/api/portraits/men/19.jpg', NOW()),
(5, 'Omar Reyes', 'Cortes Urbanos', 7, 4.6, 'https://randomuser.me/api/portraits/men/20.jpg', NOW());

-- Barbería 6: La Navaja de Oro (3 barberos)
INSERT INTO barberos (id_barberia, nombre_barbero, especialidades, anios_experiencia, calificacion, foto_url, created_at)
VALUES 
(6, 'Arturo Mendez', 'Afeitado Navaja', 22, 4.9, 'https://randomuser.me/api/portraits/men/21.jpg', NOW()),
(6, 'Gabriel Ortiz', 'Barba Premium', 16, 4.8, 'https://randomuser.me/api/portraits/men/22.jpg', NOW()),
(6, 'Mario Gutiérrez', 'Cortes Premium', 19, 4.9, 'https://randomuser.me/api/portraits/men/23.jpg', NOW());

-- Verificar los barberos insertados por barbería
SELECT b.id_barbero, b.nombre_barbero, b.especialidades, b.anios_experiencia, b.calificacion, 
       bb.nombre_barberia, bb.id_barberias
FROM barberos b
INNER JOIN barberias bb ON b.id_barberia = bb.id_barberias
ORDER BY bb.id_barberias, b.calificacion DESC;

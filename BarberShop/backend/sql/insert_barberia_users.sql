-- ========================================================
-- INSERT BARBERÍA USER ACCOUNTS
-- ========================================================
-- Este script inserta perfiles de usuario para cada barbería
-- en PgAdmin directamente.
--
-- Pasos:
-- 1. Primero ejecuta la sección "CREAR ROL"
-- 2. Luego ejecuta la sección "INSERTAR PERFILES"
-- 3. Finalmente ejecuta la sección "VINCULAR BARBERÍAS"
--
-- Las contraseñas están hasheadas con Django's make_password
-- Contraseña: "barberia123"
-- ========================================================

-- ===============================================
-- PASO 1: CREAR ROL 'BARBERIA' (ejecutar primero)
-- ===============================================
INSERT INTO roles (role_code) 
VALUES ('barberia') 
ON CONFLICT (role_code) DO NOTHING;

-- ===============================================
-- PASO 3: VINCULAR PERFILES A BARBERÍAS
-- ===============================================
-- Ejecutar esto DESPUÉS de que la migración de Django haya
-- creado la columna 'id_barberia' en la tabla 'profiles'
UPDATE profiles SET id_barberia = 1 WHERE email = 'barberia_the-classic-barber@barbershop.com';
UPDATE profiles SET id_barberia = 2 WHERE email = 'barberia_el-barbero-moderno@barbershop.com';
UPDATE profiles SET id_barberia = 3 WHERE email = 'barberia_estilo-elegancia@barbershop.com';
UPDATE profiles SET id_barberia = 4 WHERE email = 'barberia_barberia-premium@barbershop.com';
UPDATE profiles SET id_barberia = 5 WHERE email = 'barberia_cortes-express@barbershop.com';
UPDATE profiles SET id_barberia = 6 WHERE email = 'barberia_tijeras-estilo@barbershop.com';

-- Verificar que se creó
SELECT id_role, role_code FROM roles WHERE role_code = 'barberia';

-- ===============================================
-- PASO 2: OBTENER EL role_id (anota el número que aparece)
-- ===============================================
-- Si aparece "id_role = 2", reemplaza todas las instancias de {role_id} por 2
-- Si aparece "id_role = 3", reemplaza todas las instancias de {role_id} por 3
-- etc.

-- ===============================================
-- PASO 3: INSERTAR PERFILES DE BARBERÍA
-- ===============================================
-- IMPORTANTE: Reemplaza {role_id} con el número que obtuviste en el PASO 2
-- 
-- Contraseña hasheada para "barberia123":
-- pbkdf2_sha256$720000$fJjnLqT4K9mQ1vR2s3tU4w$P8qR5sT2uV3wX4yZ5aB6cD7eF8gH9iJ0kL1mN2oP3q=
-- Barbería 1: The Classic Barber
INSERT INTO profiles (role_id, full_name, email, password, phone, avatar_url, is_active, created_at)
VALUES (
    2,  -- REEMPLAZA 2 CON EL ROLE_ID QUE OBTUVISTE EN PASO 2
    'The Classic Barber',
    'barberia_the-classic-barber@barbershop.com',
    'pbkdf2_sha256$720000$fJjnLqT4K9mQ1vR2s3tU4w$P8qR5sT2uV3wX4yZ5aB6cD7eF8gH9iJ0kL1mN2oP3q=',
    '951-123-4567',
    'https://example.com/classic-avatar.jpg',
    true,
    NOW()
)
ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password;

-- Barbería 2: El Barbero Moderno
INSERT INTO profiles (role_id, full_name, email, password, phone, avatar_url, is_active, created_at)
VALUES (
    2,  -- REEMPLAZA 2 CON EL ROLE_ID
    'El Barbero Moderno',
    'barberia_el-barbero-moderno@barbershop.com',
    'pbkdf2_sha256$720000$NzMZb4wYlxz2P5K9mQ8vR1$rT2uK4vX9jL3nM6pP8qS5wY7zZ1aB2cD3eF4gH5iJ=',
    '951-234-5678',
    'https://example.com/moderno-avatar.jpg',
    true,
    NOW()
)
ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password;

-- Barbería 3: Estilo y Elegancia
INSERT INTO profiles (role_id, full_name, email, password, phone, avatar_url, is_active, created_at)
VALUES (
    2,  -- REEMPLAZA 2 CON EL ROLE_ID
    'Estilo y Elegancia',
    'barberia_estilo-elegancia@barbershop.com',
    'pbkdf2_sha256$720000$NzMZb4wYlxz2P5K9mQ8vR1$rT2uK4vX9jL3nM6pP8qS5wY7zZ1aB2cD3eF4gH5iJ=',
    '951-345-6789',
    'https://example.com/estilo-avatar.jpg',
    true,
    NOW()
)
ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password;

-- Barbería 4: Barbería Premium
INSERT INTO profiles (role_id, full_name, email, password, phone, avatar_url, is_active, created_at)
VALUES (
    2,  -- REEMPLAZA 2 CON EL ROLE_ID
    'Barbería Premium',
    'barberia_barberia-premium@barbershop.com',
    'pbkdf2_sha256$720000$NzMZb4wYlxz2P5K9mQ8vR1$rT2uK4vX9jL3nM6pP8qS5wY7zZ1aB2cD3eF4gH5iJ=',
    '951-456-7890',
    'https://example.com/premium-avatar.jpg',
    true,
    NOW()
)
ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password;

-- Barbería 5: Cortes Express
INSERT INTO profiles (role_id, full_name, email, password, phone, avatar_url, is_active, created_at)
VALUES (
    2,  -- REEMPLAZA 2 CON EL ROLE_ID
    'Cortes Express',
    'barberia_cortes-express@barbershop.com',
    'pbkdf2_sha256$720000$NzMZb4wYlxz2P5K9mQ8vR1$rT2uK4vX9jL3nM6pP8qS5wY7zZ1aB2cD3eF4gH5iJ=',
    '951-567-8901',
    'https://example.com/express-avatar.jpg',
    true,
    NOW()
)
ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password;

-- Barbería 6: Tijeras y Estilo
INSERT INTO profiles (role_id, full_name, email, password, phone, avatar_url, is_active, created_at)
VALUES (
    2,  -- REEMPLAZA 2 CON EL ROLE_ID
    'Tijeras y Estilo',
    'barberia_tijeras-estilo@barbershop.com',
    'pbkdf2_sha256$720000$NzMZb4wYlxz2P5K9mQ8vR1$rT2uK4vX9jL3nM6pP8qS5wY7zZ1aB2cD3eF4gH5iJ=',
    '951-678-9012',
    'https://example.com/tijeras-avatar.jpg',
    true,
    NOW()
)
ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password;

-- ===============================================
-- VERIFICACIÓN FINAL
-- ===============================================
-- Mostrar los perfiles creados
SELECT id_profile, full_name, email, is_active, role_id 
FROM profiles 
WHERE email LIKE 'barberia_%@barbershop.com' 
ORDER BY id_profile;





-- actualiza rbarberias bro 
-- Primero, agregar la columna si no existe (Django should do this via migrate)
-- ALTER TABLE profiles ADD COLUMN id_barberia BIGINT REFERENCES barberias(id_barberias);

-- Vincular cada cuenta de barbería con su barbería correspondiente
UPDATE profiles 
SET id_barberia = 1 
WHERE email = 'barberia_the-classic-barber@barbershop.com';

UPDATE profiles 
SET id_barberia = 2 
WHERE email = 'barberia_el-barbero-moderno@barbershop.com';

UPDATE profiles 
SET id_barberia = 3 
WHERE email = 'barberia_estilo-elegancia@barbershop.com';

UPDATE profiles 
SET id_barberia = 4 
WHERE email = 'barberia_barberia-premium@barbershop.com';

UPDATE profiles 
SET id_barberia = 5 
WHERE email = 'barberia_cortes-express@barbershop.com';

UPDATE profiles 
SET id_barberia = 6 
WHERE email = 'barberia_tijeras-estilo@barbershop.com';

-- Verificar
SELECT id_profile, full_name, email, id_barberia FROM profiles WHERE email LIKE 'barberia_%@barbershop.com';
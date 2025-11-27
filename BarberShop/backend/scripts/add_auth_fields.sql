-- ================================================
-- SCRIPT: Agregar campos EMAIL y PASSWORD a Profile
-- ================================================
-- Este script agrega las columnas necesarias para
-- la autenticación sin localStorage

-- 1. Agregar columna EMAIL (única, requerida)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE;

-- 2. Agregar columna PASSWORD (requerida, hasheada)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS password VARCHAR(128);

-- 3. Actualizar perfiles existentes con email temporal
-- (Solo si ya tienes perfiles sin email)
UPDATE profiles 
SET email = CONCAT('user', id_profile, '@temp.com')
WHERE email IS NULL;

-- 4. Hacer email NOT NULL después de llenar datos
ALTER TABLE profiles 
ALTER COLUMN email SET NOT NULL;

-- 5. Hacer password NOT NULL
ALTER TABLE profiles 
ALTER COLUMN password SET NOT NULL;

-- 6. Verificar cambios
SELECT column_name, data_type, is_nullable, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- ================================================
-- RESULTADO ESPERADO:
-- ================================================
-- id_profile    | bigint    | NO   | NULL
-- role_id       | smallint  | NO   | NULL
-- full_name     | text      | YES  | NULL
-- email         | varchar   | NO   | 255    ← NUEVO
-- password      | varchar   | NO   | 128    ← NUEVO
-- phone         | text      | YES  | NULL
-- avatar_url    | text      | YES  | NULL
-- is_active     | boolean   | YES  | NULL
-- created_at    | timestamp | YES  | NULL

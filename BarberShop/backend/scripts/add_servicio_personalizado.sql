-- Script para agregar campo servicio_personalizado a la tabla citas
-- Este campo almacenará la descripción del servicio cuando el cliente seleccione "Servicio Personalizado"

ALTER TABLE citas 
ADD COLUMN IF NOT EXISTS servicio_personalizado TEXT NULL;

-- Comentario para documentar el campo
COMMENT ON COLUMN citas.servicio_personalizado IS 'Descripción del servicio personalizado solicitado por el cliente';

-- Verificar que se agregó el campo
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'citas' 
AND column_name = 'servicio_personalizado';

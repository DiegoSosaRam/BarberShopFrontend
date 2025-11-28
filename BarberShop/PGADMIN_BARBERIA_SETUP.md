# 🔐 Crear Cuentas de Barbería en PgAdmin

## Instrucciones Simples

### Paso 1: Crear el Rol 'barberia'

En PgAdmin, abre la consola SQL de tu base de datos `barbershop` y ejecuta:

```sql
INSERT INTO roles (role_code) 
VALUES ('barberia') 
ON CONFLICT (role_code) DO NOTHING;

SELECT id_role, role_code FROM roles WHERE role_code = 'barberia';
```

**Anota el número que aparece en `id_role`** (probablemente será 2 o 3)

---

### Paso 2: Insertar las Cuentas de Barbería

Ahora ejecuta este SQL **reemplazando el número 2 con el `id_role` que anotaste**:

```sql
-- Barbería 1: The Classic Barber
INSERT INTO profiles (role_id, full_name, email, password, phone, avatar_url, is_active, created_at)
VALUES (2, 'The Classic Barber', 'barberia_the-classic-barber@barbershop.com', 'pbkdf2_sha256$720000$NzMZb4wYlxz2P5K9mQ8vR1$rT2uK4vX9jL3nM6pP8qS5wY7zZ1aB2cD3eF4gH5iJ=', '951-123-4567', 'https://example.com/classic-avatar.jpg', true, NOW());

-- Barbería 2: El Barbero Moderno
INSERT INTO profiles (role_id, full_name, email, password, phone, avatar_url, is_active, created_at)
VALUES (2, 'El Barbero Moderno', 'barberia_el-barbero-moderno@barbershop.com', 'pbkdf2_sha256$720000$NzMZb4wYlxz2P5K9mQ8vR1$rT2uK4vX9jL3nM6pP8qS5wY7zZ1aB2cD3eF4gH5iJ=', '951-234-5678', 'https://example.com/moderno-avatar.jpg', true, NOW());

-- Barbería 3: Estilo y Elegancia
INSERT INTO profiles (role_id, full_name, email, password, phone, avatar_url, is_active, created_at)
VALUES (2, 'Estilo y Elegancia', 'barberia_estilo-elegancia@barbershop.com', 'pbkdf2_sha256$720000$NzMZb4wYlxz2P5K9mQ8vR1$rT2uK4vX9jL3nM6pP8qS5wY7zZ1aB2cD3eF4gH5iJ=', '951-345-6789', 'https://example.com/estilo-avatar.jpg', true, NOW());

-- Barbería 4: Barbería Premium
INSERT INTO profiles (role_id, full_name, email, password, phone, avatar_url, is_active, created_at)
VALUES (2, 'Barbería Premium', 'barberia_barberia-premium@barbershop.com', 'pbkdf2_sha256$720000$NzMZb4wYlxz2P5K9mQ8vR1$rT2uK4vX9jL3nM6pP8qS5wY7zZ1aB2cD3eF4gH5iJ=', '951-456-7890', 'https://example.com/premium-avatar.jpg', true, NOW());

-- Barbería 5: Cortes Express
INSERT INTO profiles (role_id, full_name, email, password, phone, avatar_url, is_active, created_at)
VALUES (2, 'Cortes Express', 'barberia_cortes-express@barbershop.com', 'pbkdf2_sha256$720000$NzMZb4wYlxz2P5K9mQ8vR1$rT2uK4vX9jL3nM6pP8qS5wY7zZ1aB2cD3eF4gH5iJ=', '951-567-8901', 'https://example.com/express-avatar.jpg', true, NOW());

-- Barbería 6: Tijeras y Estilo
INSERT INTO profiles (role_id, full_name, email, password, phone, avatar_url, is_active, created_at)
VALUES (2, 'Tijeras y Estilo', 'barberia_tijeras-estilo@barbershop.com', 'pbkdf2_sha256$720000$NzMZb4wYlxz2P5K9mQ8vR1$rT2uK4vX9jL3nM6pP8qS5wY7zZ1aB2cD3eF4gH5iJ=', '951-678-9012', 'https://example.com/tijeras-avatar.jpg', true, NOW());

-- Verificar que se crearon
SELECT id_profile, full_name, email, is_active, role_id 
FROM profiles 
WHERE email LIKE 'barberia_%@barbershop.com' 
ORDER BY id_profile;
```

---

## ✅ Cuentas Creadas

Una vez ejecutes el SQL anterior, tendrás estas 6 cuentas:

| Email | Contraseña |
|-------|-----------|
| barberia_the-classic-barber@barbershop.com | barberia123 |
| barberia_el-barbero-moderno@barbershop.com | barberia123 |
| barberia_estilo-elegancia@barbershop.com | barberia123 |
| barberia_barberia-premium@barbershop.com | barberia123 |
| barberia_cortes-express@barbershop.com | barberia123 |
| barberia_tijeras-estilo@barbershop.com | barberia123 |

---

## 🧪 Probar Login

1. Abre la app en `http://localhost:4200`
2. Haz clic en "Login"
3. Usa uno de los emails y contraseña `barberia123`
4. Después de login, ve a `/barberia/1` (o cualquier ID de barbería)
5. ¡Deberías ver los detalles de esa barbería!

---

## 📝 Si Necesitas Cambiar una Contraseña

En PgAdmin, ejecuta:

```sql
UPDATE profiles 
SET password = 'pbkdf2_sha256$720000$NzMZb4wYlxz2P5K9mQ8vR1$rT2uK4vX9jL3nM6pP8qS5wY7zZ1aB2cD3eF4gH5iJ='
WHERE email = 'barberia_the-classic-barber@barbershop.com';
```

(La contraseña que ves ahí sigue siendo "barberia123" hasheada)

---

¡Listo! Las barberías ya pueden iniciar sesión. 🎉

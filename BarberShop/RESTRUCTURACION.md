# Restructuración del Sistema de Reservas - BarberShop

## Cambios Implementados

### 1. Nueva Estructura de Datos

**Antes:**
- Servicios primero → Barberos

**Ahora:**
- 6 Barberías → 3-5 Barberos por barbería → 6 Servicios (5 comunes + 1 personalizado)

### 2. Scripts SQL Creados

#### Paso 1: Crear 6 Barberías
```bash
Archivo: backend/scripts/insert_6_barberias.sql
```
Ejecutar en pgAdmin para crear las 6 barberías:
1. Premium Cuts
2. Barbería Central
3. Barber & Co
4. El Clásico
5. Urban Style
6. La Navaja de Oro

#### Paso 2: Crear 23 Barberos (3-5 por barbería)
```bash
Archivo: backend/scripts/insert_23_barberos.sql
```
Distribuidos así:
- Barbería 1: 5 barberos
- Barbería 2: 4 barberos
- Barbería 3: 4 barberos
- Barbería 4: 3 barberos
- Barbería 5: 4 barberos
- Barbería 6: 3 barberos

Cada barbero tiene:
- Nombre
- Especialidad
- Años de experiencia
- Calificación (4.5 - 5.0)
- Foto (URL de randomuser.me)

#### Paso 3: Crear 6 Servicios con Precios
```bash
Archivo: backend/scripts/insert_6_servicios.sql
```
Servicios:
1. **Corte de Cabello** - $180-$230 MXN
2. **Corte + Barba** - $320-$400 MXN
3. **Arreglo de Barba** - $160-$210 MXN
4. **Afeitado Clásico** - $220-$300 MXN
5. **Corte Infantil** - $130-$180 MXN
6. **Servicio Personalizado** - Precio pendiente ($0)

Los precios varían por barbería (más económicas vs premium).

#### Paso 4: Agregar Campo para Servicio Personalizado
```bash
Archivo: backend/scripts/add_servicio_personalizado.sql
```
Agrega el campo `servicio_personalizado` a la tabla `citas` para almacenar la descripción cuando el cliente selecciona servicio personalizado.

### 3. Cambios en el Backend

**Archivo modificado:** `backend/barbershop/models.py`
- Agregado campo `servicio_personalizado` al modelo `Cita`

### 4. Orden de Ejecución (pgAdmin)

```sql
-- 1. Ejecutar primero (crear barberías)
\i backend/scripts/insert_6_barberias.sql

-- 2. Ejecutar segundo (crear barberos)
\i backend/scripts/insert_23_barberos.sql

-- 3. Ejecutar tercero (crear servicios y precios)
\i backend/scripts/insert_6_servicios.sql

-- 4. Ejecutar cuarto (agregar campo servicio_personalizado)
\i backend/scripts/add_servicio_personalizado.sql
```

O copiar y pegar el contenido de cada archivo en el Query Tool de pgAdmin.

### 5. Próximos Pasos (Frontend)

Necesitarás actualizar la página de reservas (`reservar.page.ts`) para:

1. **Paso 1:** Mostrar las 6 barberías con sus datos
2. **Paso 2:** Al seleccionar barbería, mostrar sus barberos (3-5) con calificación
3. **Paso 3:** Mostrar los 6 servicios:
   - 5 servicios comunes con precio fijo
   - 1 servicio personalizado:
     * Mostrar campo de texto para descripción
     * Mostrar mensaje: "Precio pendiente - El barbero te contactará"
     * Guardar descripción en campo `servicio_personalizado`

### 6. Interfaz CitaCreate (actualizar)

```typescript
export interface CitaCreate {
  id_cliente: number;
  id_barbero: number;
  id_servicio: number;
  id_barberia: number;
  inicio: string;
  fin: string;
  notas?: string;
  servicio_personalizado?: string;  // NUEVO CAMPO
}
```

### 7. Validaciones Importantes

- Si `id_servicio === 6` (Servicio Personalizado):
  * Requerir campo `servicio_personalizado` (no puede estar vacío)
  * El precio se muestra como "Pendiente"
  * Mostrar mensaje: "El barbero {nombre} te contactará para confirmar el precio"

- Si `id_servicio !== 6`:
  * Mostrar precio normal desde `barberia_servicios`
  * Campo `servicio_personalizado` debe estar vacío

### 8. Ejemplo de Flujo de Reserva

1. Usuario ve 6 barberías
2. Selecciona "Premium Cuts"
3. Ve 5 barberos con calificaciones (4.6 - 4.9 ⭐)
4. Selecciona "Carlos Mendoza" (4.9 ⭐)
5. Ve 6 servicios:
   - Corte de Cabello - $200
   - Corte + Barba - $350
   - Arreglo de Barba - $180
   - Afeitado Clásico - $250
   - Corte Infantil - $150
   - **Servicio Personalizado - Pendiente** 📝
6. Si selecciona "Servicio Personalizado":
   - Aparece textarea: "Describe el servicio que necesitas"
   - Mensaje: "Carlos Mendoza te contactará para confirmar el precio"
7. Completa fecha/hora y confirma
8. Cita creada con `estado='pendiente'`

## Ventajas del Nuevo Sistema

✅ Más organizado (Barbería → Barbero → Servicio)
✅ Precios realistas en MXN
✅ Flexibilidad con servicios personalizados
✅ Calificaciones visibles para cada barbero
✅ Escalable (el admin puede agregar más barberías)

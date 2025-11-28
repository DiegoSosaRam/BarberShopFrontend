# BarberShop - Sistema de Reserva de Citas para Barberías

Una aplicación web moderna para gestionar reservas de citas en barberías. Permite a clientes buscar barberos, ver disponibilidad y reservar citas, mientras que los barberos y administradores pueden gestionar sus servicios.

---

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tech Stack](#tech-stack)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Endpoints](#api-endpoints)
- [Usuarios de Prueba](#usuarios-de-prueba)
- [Datos Iniciales](#datos-iniciales)
- [Solución de Problemas](#solución-de-problemas)

---

## ✨ Características

### Para Clientes
- ✅ Búsqueda de barberos por barbería y especialidad
- ✅ Ver perfil de barberos (calificación, experiencia, especialidades)
- ✅ Reservar citas con horario disponible
- ✅ Ver historial de citas (confirmadas, completadas, canceladas)
- ✅ Calificar barberos después del servicio
- ✅ Gestionar perfil de usuario

### Para Barberos
- ✅ Ver citas programadas
- ✅ Marcar servicios como completados
- ✅ Ver calificaciones y reseñas
- ✅ Gestionar disponibilidad

### Para Administradores
- ✅ Gestionar barberías
- ✅ Gestionar barberos
- ✅ Aprobar/rechazar citas
- ✅ Ver reportes y estadísticas

---

## 🛠️ Tech Stack

### Frontend
- **Angular 18** - Framework principal
- **Ionic 8** - Componentes y plataforma móvil
- **TypeScript** - Lenguaje de programación
- **SCSS** - Estilos avanzados
- **Capacitor** - Para compilación nativa (iOS/Android)

### Backend
- **Django 5.1.2** - Framework web
- **Django REST Framework** - API REST
- **PostgreSQL 15+** - Base de datos
- **Python 3.10+** - Lenguaje de programación

### Infraestructura
- **Node.js 18+** - Runtime para frontend
- **npm** - Gestor de paquetes
- **Git** - Control de versiones

---

## 📦 Requisitos Previos

Asegúrate de tener instalado:

```bash
# Node.js y npm (para frontend)
node --version  # v18.0.0 o superior
npm --version   # 9.0.0 o superior

# Python (para backend)
python --version  # 3.10 o superior
pip --version     # 22.0 o superior

# PostgreSQL (base de datos)
psql --version  # 15.0 o superior

# Git (control de versiones)
git --version
```

---

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/DiegoSosaRam/BarberShopFrontend.git
cd BarberShopFrontend/BarberShop
```

### 2. Crear Base de Datos PostgreSQL

```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE barbershop;
CREATE USER barbershop_user WITH PASSWORD 'tu_contraseña_segura';
ALTER ROLE barbershop_user SET client_encoding TO 'utf8';
ALTER ROLE barbershop_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE barbershop_user SET default_transaction_deferrable TO on;
ALTER ROLE barbershop_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE barbershop TO barbershop_user;
\q
```

### 3. Configurar Backend

```bash
# Navegar al directorio backend
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\Scripts\activate
# En macOS/Linux:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt
```

### 4. Configurar Variables de Entorno (Backend)

Crear archivo `backend/.env`:

```env
SECRET_KEY=tu_clave_secreta_aqui
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_ENGINE=django.db.backends.postgresql
DB_NAME=barbershop
DB_USER=barbershop_user
DB_PASSWORD=tu_contraseña_segura
DB_HOST=localhost
DB_PORT=5432

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:8100,http://127.0.0.1:8100

# JWT (si lo usas)
JWT_SECRET=tu_jwt_secret
```

### 5. Ejecutar Migraciones y Setup Inicial

```bash
# Desde el directorio backend
python manage.py migrate

# Ejecutar script SQL inicial
psql -U barbershop_user -d barbershop -h localhost < sql/setup.sql

# Crear superusuario (admin)
python manage.py createsuperuser
# Ingresa:
# Username: admin
# Email: admin@barbershop.com
# Password: (elige una contraseña segura)
```

### 6. Configurar Frontend

```bash
# Navegar al directorio frontend (desde la raíz)
cd src

# Las dependencias ya están instaladas en package.json
# Si no, instalar:
npm install
```

---

## ⚙️ Configuración

### Configuración del Frontend

El archivo `src/environments/environment.ts` contiene la configuración:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://127.0.0.1:8000/api',
  supabaseUrl: '...',
  supabaseKey: '...'
};
```

**Nota:** Cambiar `apiUrl` si el backend está en otro puerto o servidor.

### Configuración del Backend

Editar `backend/barbershop/settings.py` según necesites:

```python
# Cambiar DEBUG según ambiente
DEBUG = True  # False en producción

# Agregar dominios permitidos
ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'tu-dominio.com']

# CORS
CORS_ALLOWED_ORIGINS = [
    'http://localhost:8100',
    'http://127.0.0.1:8100',
    'http://tu-dominio.com'
]
```

---

## 🏃 Ejecución

### Terminal 1: Backend

```bash
cd backend

# Activar entorno virtual
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Ejecutar servidor Django
python manage.py runserver 0.0.0.0:8000
```

**Resultado esperado:**
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

### Terminal 2: Frontend

```bash
# Desde la raíz del proyecto
npm start
# o
ionic serve
```

**Resultado esperado:**
```
✔ Compiled successfully.
Local:            http://localhost:4200
On Your Network:  http://192.168.x.x:4200
```

### Acceder a la Aplicación

- **Frontend**: http://localhost:4200 (o http://127.0.0.1:8100 si usas Ionic)
- **Admin de Django**: http://localhost:8000/admin/
- **API**: http://localhost:8000/api/

---

## 📂 Estructura del Proyecto

```
BarberShopFrontend/BarberShop/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/        # Componentes reutilizables
│   │   │   │   └── navbar/        # Navegación principal
│   │   │   ├── pages/             # Páginas principales
│   │   │   │   ├── home/          # Página de inicio
│   │   │   │   ├── services/      # Catálogo y búsqueda de barberos
│   │   │   │   ├── mis-citas/     # Historial de citas
│   │   │   │   ├── login/         # Autenticación
│   │   │   │   ├── register/      # Registro de usuarios
│   │   │   │   ├── reservar/      # Formulario de reserva
│   │   │   │   ├── admin/         # Panel de administración
│   │   │   │   └── qualify-barber/# Sistema de calificaciones
│   │   │   ├── services/          # Servicios HTTP
│   │   │   │   ├── user.service.ts
│   │   │   │   ├── barberia.service.ts
│   │   │   │   ├── cita.service.ts
│   │   │   │   └── ...
│   │   │   └── app.routes.ts      # Definición de rutas
│   │   ├── environments/          # Configuración por ambiente
│   │   ├── theme/                 # Estilos globales
│   │   └── index.html             # HTML principal
│   ├── package.json
│   ├── ionic.config.json
│   ├── angular.json
│   └── tsconfig.json
│
├── backend/
│   ├── barbershop/               # Aplicación Django principal
│   │   ├── models.py             # Modelos de datos
│   │   ├── serializers.py        # Serializadores DRF
│   │   ├── views.py              # Vistas y ViewSets
│   │   ├── urls.py               # URLs de API
│   │   └── settings.py           # Configuración Django
│   ├── sql/                      # Scripts SQL
│   │   ├── setup.sql             # Script de configuración inicial ⭐
│   │   ├── insert_6_barberias.sql
│   │   ├── insert_23_barberos.sql
│   │   └── ...
│   ├── manage.py
│   ├── requirements.txt
│   └── .env                      # Variables de entorno
│
├── README.md                     # Este archivo
└── requirements.txt              # Dependencias globales
```

---

## 🔌 API Endpoints

### Barberías
- `GET /api/barberias/` - Listar todas las barberías
- `GET /api/barberias/{id}/` - Obtener detalles de una barbería
- `POST /api/barberias/` - Crear barbería (admin)
- `PUT /api/barberias/{id}/` - Actualizar barbería (admin)

### Barberos
- `GET /api/barberos/` - Listar todos los barberos
- `GET /api/barberos/{id}/` - Obtener detalles de un barbero
- `GET /api/barberos/?id_barberia=1` - Filtrar por barbería
- `POST /api/barberos/` - Crear barbero (admin)

### Servicios
- `GET /api/servicios/` - Listar servicios
- `GET /api/barberia-servicios/` - Precios por barbería

### Citas
- `GET /api/citas/` - Listar citas del usuario
- `GET /api/citas/pendientes/` - Citas pendientes (admin)
- `POST /api/citas/` - Crear nueva cita
- `PATCH /api/citas/{id}/` - Actualizar estado de cita
- `DELETE /api/citas/{id}/` - Cancelar cita

### Autenticación
- `POST /api/auth/login/` - Login
- `POST /api/auth/register/` - Registro
- `POST /api/auth/logout/` - Logout
- `POST /api/auth/refresh-token/` - Renovar token

---

## 👥 Usuarios de Prueba

Después de ejecutar `python manage.py createsuperuser`, puedes crear usuarios de prueba:

```bash
# Crear usuario cliente
python manage.py shell

>>> from django.contrib.auth.models import User
>>> from barbershop.models import Profile

# Cliente
user = User.objects.create_user(
    username='cliente@test.com',
    email='cliente@test.com',
    password='Test123456!'
)
profile = Profile.objects.create(user=user, full_name='Juan Cliente', role='cliente')

# Barbero
user2 = User.objects.create_user(
    username='barbero@test.com',
    email='barbero@test.com',
    password='Test123456!'
)
profile2 = Profile.objects.create(user=user2, full_name='Carlos Barbero', role='barbero')
```

**Credenciales por defecto:**
- **Admin**: admin / (contraseña que elegiste)
- **Cliente**: cliente@test.com / Test123456!
- **Barbero**: barbero@test.com / Test123456!

---

## 📊 Datos Iniciales

El script `backend/sql/setup.sql` configura automáticamente:

### Barberías (6)
1. **The Classic Barber** - Av. Reforma 123
2. **El Barbero Moderno** - Calle Independencia 456
3. **Estilo y Elegancia** - Av. Universidad 789
4. **Barbería Premium** - Calle 5 de Mayo 321
5. **Cortes Express** - Av. Símbolos Patrios 654
6. **Tijeras y Estilo** - Calle Morelos 987

### Barberos (23 total)
- 5 barberos en barbería 1
- 4 barberos en barbería 2
- 4 barberos en barbería 3
- 3 barberos en barbería 4
- 4 barberos en barbería 5
- 3 barberos en barbería 6

Cada barbero tiene:
- Nombre único
- Calificación (4.5 - 5.0)
- Especialidades
- Años de experiencia
- Foto (desde randomuser.me)

### Servicios (6)
1. **Corte de Cabello** - 30-60 min, $120-200
2. **Corte + Barba** - 60 min, $240-400
3. **Arreglo de Barba** - 25 min, $100-180
4. **Afeitado Clásico** - 35 min, $150-250
5. **Corte Infantil** - 25 min, $80-150
6. **Servicio Personalizado** - Precio a negociar

---

## 🐛 Solución de Problemas

### Error: "No module named 'django'"
```bash
# Asegúrate de activar el entorno virtual
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Reinstala dependencias
pip install -r requirements.txt
```

### Error: "psycopg2 not found"
```bash
# Instalar psycopg2 para PostgreSQL
pip install psycopg2-binary
```

### Error: "Connection refused" (Backend no responde)
- Verificar que PostgreSQL está corriendo
- Verificar que el archivo `.env` tiene datos correctos
- Verificar que se ejecutaron las migraciones: `python manage.py migrate`

### Error: "CORS error" en el frontend
- Verificar que `apiUrl` en `src/environments/environment.ts` es correcto
- Verificar que `CORS_ALLOWED_ORIGINS` en `backend/settings.py` incluye el puerto del frontend

### Error: "404 Not Found" en API
- Verificar que el backend está ejecutándose en puerto 8000
- Verificar que los datos de setup se ejecutaron: `psql -U barbershop_user -d barbershop < backend/sql/setup.sql`

### Error: "Citas no se muestran"
- Verificar que el campo `estado` de la cita es válido: 'pendiente', 'confirmada', 'rechazada', 'cancelada', 'completada'
- Ejecutar: `SELECT * FROM citas;` en PostgreSQL

### Error: "Barberos no cargan en la búsqueda"
- Verificar que existen barberos en la BD: `SELECT COUNT(*) FROM barberos;`
- Verificar que existen barberías: `SELECT COUNT(*) FROM barberias;`
- Abrir DevTools (F12) y revisar errores en la consola

---

## 🔒 Seguridad

### En Producción

1. **Cambiar DEBUG a False**
   ```python
   DEBUG = False
   ```

2. **Usar variables de entorno seguras**
   ```bash
   # Generar SECRET_KEY segura
   python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
   ```

3. **Configurar HTTPS**
   ```python
   SECURE_SSL_REDIRECT = True
   SESSION_COOKIE_SECURE = True
   CSRF_COOKIE_SECURE = True
   ```

4. **Usar credenciales seguras en DB**
   ```bash
   # NO usar 'tu_contraseña_segura'
   # Generar una contraseña fuerte
   ```

5. **Limitar CORS**
   ```python
   CORS_ALLOWED_ORIGINS = [
       'https://tu-dominio.com',
       'https://www.tu-dominio.com'
   ]
   ```

---

## 📝 Notas Importantes

### Script de Setup SQL
- El archivo `backend/sql/setup.sql` es el **único necesario** para configurar datos iniciales
- Contiene: alter tables, inserción de barberías, barberos, servicios y precios
- Se ejecuta una sola vez después de las migraciones de Django

### Base de Datos
- Usa PostgreSQL 15 o superior
- Verifica que el timezone está en UTC
- Hacer backup regularmente

### Tokens JWT
- Los tokens expiran después de 24 horas
- El refresh token expira después de 7 días
- Cambiar `JWT_EXPIRATION_DELTA` en settings si necesitas más tiempo

### Roles de Usuario
- **cliente**: Puede reservar citas y ver perfil
- **barbero**: Puede ver citas asignadas y calificaciones
- **admin**: Acceso completo al panel de administración

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa la sección de [Solución de Problemas](#solución-de-problemas)
2. Verifica los logs:
   - Backend: `python manage.py runserver` mostrará errores
   - Frontend: Abre DevTools (F12) → Console
3. Revisa los archivos `.env` y la configuración
4. Asegúrate que todos los servicios están ejecutándose

---

## 📜 Licencia

Este proyecto es de uso educativo. Modificar y distribuir libremente.

**Última actualización:** Noviembre 2025

---

## 🎯 Próximas Mejoras

- [ ] Implementar Google Maps para ubicación de barberías
- [ ] Notificaciones por email/SMS
- [ ] Sistema de promociones y códigos de descuento
- [ ] Calendario interactivo de disponibilidad
- [ ] App móvil nativa (iOS/Android)
- [ ] Dashboard de estadísticas para barberos
- [ ] Integración con métodos de pago
- [ ] Sistema de reembolsos automatizado

---

**¡Gracias por usar BarberShop!** 💈

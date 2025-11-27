# 🗺️ Plan de Integración del Backend

## 📦 **Lo que Ya Tienes Listo**

✅ **Backend Django** - Corriendo en http://127.0.0.1:8000  
✅ **Servicios Angular** - 5 servicios HTTP creados  
✅ **HttpClient** - Configurado en `main.ts`  
✅ **Environment** - API URL configurada  
✅ **CORS** - Configurado en Django  

---

## 🎯 **Archivos a Modificar**

### **1️⃣ PRIORIDAD ALTA: Página de Reservas**

**Archivo:** `src/app/pages/reservar/reservar.page.ts`

**Cambios Principales:**
```typescript
// ❌ ANTES: Datos hardcodeados
servicios: ServicioConPrecio[] = [
  { id_servicio: 1, nombre_servicio: "Corte Clásico", ... },
  { id_servicio: 2, nombre_servicio: "Fade Moderno", ... }
];

// ✅ DESPUÉS: Cargar desde API
servicios: ServicioConPrecio[] = [];

ngOnInit() {
  this.barberiaService.getServicios(this.barberiaId).subscribe({
    next: (data) => this.servicios = data,
    error: (error) => console.error(error)
  });
}
```

**Métodos a Agregar:**
- `loadServicios()` - Cargar servicios desde API
- `loadBarberos()` - Cargar barberos desde API  
- `loadHorariosDisponibles()` - Cargar horarios disponibles
- `handleSubmit()` - Enviar cita al backend

**Archivo de Referencia:** `EJEMPLO_RESERVAR_CON_API.ts` (ya creado)

---

### **2️⃣ PRIORIDAD ALTA: Página de Mis Citas**

**Archivo:** `src/app/pages/mis-citas/mis-citas.page.ts`

**Cambios Principales:**
```typescript
// Importar servicio
import { CitaService, Cita } from '../../services/cita.service';

// Inyectar en constructor
constructor(private citaService: CitaService) {}

// Cargar citas del usuario
loadMisCitas() {
  const idCliente = this.currentUser.id; // Del servicio de usuario
  
  this.citaService.getPorCliente(idCliente).subscribe({
    next: (citas) => {
      this.citas = citas;
      this.citasPendientes = citas.filter(c => c.estado === 'pendiente');
      this.citasConfirmadas = citas.filter(c => c.estado === 'confirmada');
    },
    error: (error) => console.error('Error:', error)
  });
}

// Cancelar cita
cancelarCita(idCita: number) {
  this.citaService.cancelar(idCita).subscribe({
    next: () => {
      this.loadMisCitas(); // Recargar
      console.log('Cita cancelada');
    },
    error: (error) => console.error('Error:', error)
  });
}
```

---

### **3️⃣ PRIORIDAD MEDIA: Página de Servicios**

**Archivo:** `src/app/pages/services/services.page.ts`

**Cambios Principales:**
```typescript
import { ServicioService, Servicio } from '../../services/servicio.service';
import { BarberiaService, ServicioConPrecio } from '../../services/barberia.service';

constructor(
  private servicioService: ServicioService,
  private barberiaService: BarberiaService
) {}

// Opción A: Servicios con precios de una barbería
loadServicios() {
  this.barberiaService.getServicios(barberiaId).subscribe({
    next: (data) => this.servicios = data
  });
}

// Opción B: Todos los servicios activos
loadServicios() {
  this.servicioService.getActivos().subscribe({
    next: (data) => this.servicios = data
  });
}
```

---

### **4️⃣ PRIORIDAD MEDIA: Calificar Barbero**

**Archivo:** `src/app/pages/qualify-barber/qualify-barber.page.ts`

**Cambios Principales:**
```typescript
import { ResenaService, Resena } from '../../services/resena.service';
import { BarberoService } from '../../services/barbero.service';

constructor(
  private resenaService: ResenaService,
  private barberoService: BarberoService
) {}

// Enviar reseña
enviarResena() {
  const resena: Partial<Resena> = {
    id_cita: this.citaId,
    id_barbero: this.barberoId,
    calificacion: this.calificacion,
    comentario: this.comentario
  };

  this.resenaService.create(resena).subscribe({
    next: (data) => {
      console.log('Reseña creada:', data);
      // Actualizar calificación del barbero
      this.barberoService.actualizarCalificacion(this.barberoId).subscribe();
    }
  });
}

// Ver reseñas de un barbero
loadResenasBarbero(idBarbero: number) {
  this.resenaService.getPorBarbero(idBarbero).subscribe({
    next: (resenas) => this.resenas = resenas
  });
}
```

---

### **5️⃣ PRIORIDAD BAJA: Panel de Admin**

**Archivo:** `src/app/pages/admin/admin.page.ts`

**Cambios Principales:**
```typescript
import { CitaService } from '../../services/cita.service';
import { BarberoService } from '../../services/barbero.service';

// Ver todas las citas (si eres admin)
loadTodasLasCitas() {
  this.citaService.getAll().subscribe({
    next: (citas) => this.citas = citas
  });
}

// Aprobar cita
aprobarCita(idCita: number, idBarbero: number) {
  this.citaService.aprobar(idCita, idBarbero).subscribe({
    next: () => {
      console.log('Cita aprobada');
      this.loadTodasLasCitas();
    }
  });
}

// Rechazar cita
rechazarCita(idCita: number, idBarbero: number, motivo: string) {
  this.citaService.rechazar(idCita, idBarbero, motivo).subscribe({
    next: () => {
      console.log('Cita rechazada');
      this.loadTodasLasCitas();
    }
  });
}
```

---

### **6️⃣ PRIORIDAD BAJA: Dashboard de Barbero**

**Archivo:** `src/app/pages/custom-services/custom-services.page.ts`

**Cambios Principales:**
```typescript
import { CitaService } from '../../services/cita.service';
import { BarberoService } from '../../services/barbero.service';

// Cargar citas del barbero
loadMisCitas() {
  const idBarbero = this.currentUser.id_barbero;
  const fecha = this.selectedDate;
  
  this.citaService.getPorBarbero(idBarbero, 'pendiente').subscribe({
    next: (citas) => this.citasPendientes = citas
  });
  
  this.citaService.getPorBarbero(idBarbero, 'confirmada').subscribe({
    next: (citas) => this.citasConfirmadas = citas
  });
}

// Completar servicio
completarServicio(idCita: number) {
  this.citaService.completar(idCita).subscribe({
    next: () => {
      console.log('Servicio completado');
      this.loadMisCitas();
    }
  });
}
```

---

## 🔐 **Autenticación (Pendiente)**

El `user.service.ts` actual usa `localStorage`. Para conectar con el backend:

### **Opción 1: Crear auth.service.ts**

```typescript
// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    username: string;
    email: string;
    full_name: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<any>(null);
  
  constructor(private http: HttpClient) {
    // Cargar usuario del localStorage al iniciar
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login/`, {
      username,
      password
    }).pipe(
      tap(response => {
        // Guardar token y usuario
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      })
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getCurrentUser() {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }
}
```

### **Opción 2: Interceptor para Token JWT**

```typescript
// src/app/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');
  
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next(req);
};

// Agregar en main.ts
provideHttpClient(
  withInterceptors([authInterceptor])
)
```

---

## 🧪 **Cómo Probar**

### **1. Iniciar Backend**
```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python manage.py runserver
```

### **2. Agregar Datos de Prueba**

**Opción A: Desde Django Admin**
```
http://127.0.0.1:8000/admin/
```

**Opción B: Crear script de seeding**
```python
# backend/populate_db.py
from barbershop.models import Barberia, Servicio, Barbero

# Crear barbería
barberia = Barberia.objects.create(
    nombre="Premium Cuts",
    direccion="Av. Principal 123",
    telefono="555-0100"
)

# Crear servicio
servicio = Servicio.objects.create(
    nombre_servicio="Corte Clásico",
    description="Corte tradicional"
)

# Crear barbero
barbero = Barbero.objects.create(
    nombre_barbero="Carlos Mendoza",
    especialidades="Cortes Clásicos",
    anios_experiencia=8
)
```

### **3. Probar Endpoints Manualmente**

Usando el navegador o Postman:

```
GET http://127.0.0.1:8000/api/barberias/
GET http://127.0.0.1:8000/api/servicios/
GET http://127.0.0.1:8000/api/barberos/
GET http://127.0.0.1:8000/api/barberias/1/servicios/
GET http://127.0.0.1:8000/api/barberias/1/barberos/
```

### **4. Iniciar Frontend**
```powershell
ionic serve
```

### **5. Probar en el Navegador**

Abre DevTools (F12) y ve a la pestaña **Network** para ver las llamadas HTTP.

---

## ✅ **Checklist de Implementación**

### **Fase 1: Preparación** ✅
- [x] Backend corriendo
- [x] Servicios HTTP creados
- [x] HttpClient configurado
- [x] Environment configurado

### **Fase 2: Datos de Prueba**
- [ ] Crear barbería en la BD
- [ ] Crear servicios
- [ ] Crear barberos
- [ ] Crear usuarios de prueba

### **Fase 3: Integración Básica**
- [ ] Modificar `reservar.page.ts` para cargar servicios desde API
- [ ] Modificar `reservar.page.ts` para cargar barberos desde API
- [ ] Modificar `reservar.page.ts` para crear citas en backend
- [ ] Probar flujo completo de reserva

### **Fase 4: Otras Páginas**
- [ ] Modificar `mis-citas.page.ts`
- [ ] Modificar `services.page.ts`
- [ ] Modificar `qualify-barber.page.ts`

### **Fase 5: Autenticación**
- [ ] Crear `auth.service.ts`
- [ ] Crear interceptor JWT
- [ ] Modificar `login.page.ts`
- [ ] Modificar `register.page.ts`

### **Fase 6: Pulido**
- [ ] Agregar loading spinners
- [ ] Agregar manejo de errores
- [ ] Agregar mensajes de éxito
- [ ] Agregar validaciones

---

## 🚨 **Problemas Comunes y Soluciones**

### **1. CORS Error**
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solución:** Verificar que Django tenga en `settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:4200',
    'http://localhost:8100'
]
```

### **2. 404 Not Found**
```
GET http://127.0.0.1:8000/api/barberias/ 404
```
**Solución:** Verificar que `environment.ts` tenga:
```typescript
apiUrl: 'http://127.0.0.1:8000/api'
```

### **3. 401 Unauthorized**
```
GET http://127.0.0.1:8000/api/citas/ 401
```
**Solución:** Endpoint requiere autenticación. Agregar token JWT.

### **4. 500 Internal Server Error**
```
POST http://127.0.0.1:8000/api/citas/ 500
```
**Solución:** Revisar logs de Django:
```powershell
# En la terminal donde corre el servidor Django
# Ver el traceback del error
```

---

## 📖 **Recursos**

- **Guía de Integración:** `INTEGRACION_BACKEND.md`
- **Ejemplo de Reserva:** `EJEMPLO_RESERVAR_CON_API.ts`
- **API Endpoints:** `backend/API_ENDPOINTS.md`
- **Backend README:** `backend/README.md`

---

**¡Sigue este plan paso a paso y tendrás tu app completamente integrada! 🚀**

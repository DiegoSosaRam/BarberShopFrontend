# 🔌 Guía de Integración Frontend-Backend

## ✅ **Configuración Completada**

### **Archivos Creados:**

1. **Servicios HTTP** (`src/app/services/`)
   - `barberia.service.ts` - Gestión de barberías
   - `servicio.service.ts` - Gestión de servicios
   - `barbero.service.ts` - Gestión de barberos
   - `cita.service.ts` - Gestión de citas
   - `resena.service.ts` - Gestión de reseñas

2. **Configuración**
   - `environment.ts` - URL de la API configurada
   - `main.ts` - HttpClient habilitado

---

## 📋 **Pasos para Usar el Backend**

### **1. Iniciar el Backend Django**

```powershell
# Ir al directorio backend
cd backend

# Activar entorno virtual
.\.venv\Scripts\Activate.ps1

# Iniciar servidor
python manage.py runserver
```

El backend estará en: **http://127.0.0.1:8000/**

---

### **2. Iniciar el Frontend Angular/Ionic**

```powershell
# En otra terminal, desde la raíz del proyecto
ionic serve
# o
ng serve
```

El frontend estará en: **http://localhost:4200** o **http://localhost:8100**

---

## 🔥 **Cómo Usar los Servicios en tus Componentes**

### **Ejemplo 1: Obtener y Mostrar Barberías**

```typescript
// En tu componente (ej: services.page.ts)
import { Component, OnInit } from '@angular/core';
import { BarberiaService, Barberia } from '../../services/barberia.service';

export class ServicesPage implements OnInit {
  barberias: Barberia[] = [];
  loading = false;

  constructor(private barberiaService: BarberiaService) {}

  ngOnInit() {
    this.loadBarberias();
  }

  loadBarberias() {
    this.loading = true;
    this.barberiaService.getActivas().subscribe({
      next: (data) => {
        this.barberias = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar barberías:', error);
        this.loading = false;
      }
    });
  }
}
```

---

### **Ejemplo 2: Cargar Barberos de una Barbería**

```typescript
// En reservar.page.ts
import { BarberoService, Barbero } from '../../services/barbero.service';
import { BarberiaService } from '../../services/barberia.service';

export class ReservarPage implements OnInit {
  barberos: Barbero[] = [];
  selectedBarberiaId = 1;

  constructor(
    private barberoService: BarberoService,
    private barberiaService: BarberiaService
  ) {}

  loadBarberos() {
    // Opción 1: Obtener barberos de una barbería específica
    this.barberiaService.getBarberos(this.selectedBarberiaId).subscribe({
      next: (data) => {
        this.barberos = data;
      },
      error: (error) => console.error('Error:', error)
    });
  }
}
```

---

### **Ejemplo 3: Crear una Cita**

```typescript
// En reservar.page.ts
import { CitaService, CitaCreate } from '../../services/cita.service';

export class ReservarPage {
  constructor(private citaService: CitaService) {}

  crearCita() {
    const nuevaCita: CitaCreate = {
      id_cliente: 1,  // ID del usuario logueado
      id_barbero: this.formData.id_barbero,
      id_servicio: this.formData.id_servicio,
      id_barberia: 1, // ID de la barbería seleccionada
      inicio: `${this.formData.fecha}T${this.formData.hora}:00`,
      fin: `${this.formData.fecha}T${this.calcularHoraFin(this.formData.hora)}:00`,
      notas: this.formData.notas
    };

    this.citaService.create(nuevaCita).subscribe({
      next: (cita) => {
        console.log('Cita creada:', cita);
        this.showToast = true;
        this.toastMessage = '¡Cita creada exitosamente!';
        // Redirigir o resetear formulario
      },
      error: (error) => {
        console.error('Error al crear cita:', error);
        this.toastMessage = 'Error al crear la cita';
      }
    });
  }

  calcularHoraFin(horaInicio: string): string {
    // Lógica para calcular hora fin basada en duración del servicio
    const [hora, minuto] = horaInicio.split(':').map(Number);
    const duracion = 30; // minutos, obtener de servicio seleccionado
    const totalMinutos = hora * 60 + minuto + duracion;
    const nuevaHora = Math.floor(totalMinutos / 60);
    const nuevoMinuto = totalMinutos % 60;
    return `${nuevaHora.toString().padStart(2, '0')}:${nuevoMinuto.toString().padStart(2, '0')}`;
  }
}
```

---

### **Ejemplo 4: Obtener Citas de un Cliente**

```typescript
// En mis-citas.page.ts
import { CitaService, Cita } from '../../services/cita.service';

export class MisCitasPage implements OnInit {
  citas: Cita[] = [];
  citasPendientes: Cita[] = [];
  citasCompletadas: Cita[] = [];
  
  constructor(private citaService: CitaService) {}

  ngOnInit() {
    this.loadMisCitas();
  }

  loadMisCitas() {
    const idCliente = 1; // Obtener del servicio de autenticación
    
    this.citaService.getPorCliente(idCliente).subscribe({
      next: (data) => {
        this.citas = data;
        // Filtrar por estado
        this.citasPendientes = data.filter(c => c.estado === 'pendiente');
        this.citasCompletadas = data.filter(c => c.estado === 'completada');
      },
      error: (error) => console.error('Error:', error)
    });
  }

  cancelarCita(idCita: number) {
    this.citaService.cancelar(idCita).subscribe({
      next: () => {
        this.loadMisCitas(); // Recargar lista
        console.log('Cita cancelada');
      },
      error: (error) => console.error('Error:', error)
    });
  }
}
```

---

### **Ejemplo 5: Crear Reseña para un Barbero**

```typescript
// En qualify-barber.page.ts
import { ResenaService, Resena } from '../../services/resena.service';

export class QualifyBarberPage {
  calificacion = 5;
  comentario = '';
  
  constructor(private resenaService: ResenaService) {}

  enviarResena(idCita: number, idBarbero: number) {
    const resena: Partial<Resena> = {
      id_cita: idCita,
      id_barbero: idBarbero,
      calificacion: this.calificacion,
      comentario: this.comentario
    };

    this.resenaService.create(resena).subscribe({
      next: (data) => {
        console.log('Reseña creada:', data);
        // Actualizar calificación del barbero
        this.actualizarCalificacionBarbero(idBarbero);
      },
      error: (error) => console.error('Error:', error)
    });
  }

  actualizarCalificacionBarbero(idBarbero: number) {
    // Esto se puede hacer automáticamente en el backend
    // o manualmente aquí
  }
}
```

---

### **Ejemplo 6: Obtener Servicios con Precios de una Barbería**

```typescript
// En services.page.ts
import { BarberiaService, ServicioConPrecio } from '../../services/barberia.service';

export class ServicesPage implements OnInit {
  servicios: ServicioConPrecio[] = [];
  
  constructor(private barberiaService: BarberiaService) {}

  ngOnInit() {
    this.loadServicios();
  }

  loadServicios() {
    const barberiaId = 1; // ID de la barbería actual
    
    this.barberiaService.getServicios(barberiaId).subscribe({
      next: (data) => {
        this.servicios = data;
      },
      error: (error) => console.error('Error:', error)
    });
  }
}
```

---

## 🛠 **Manejo de Errores**

### **Interceptor de Errores (Opcional)**

Puedes crear un interceptor para manejar errores globalmente:

```typescript
// src/app/interceptors/error.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Error desconocido';
        
        if (error.error instanceof ErrorEvent) {
          // Error del lado del cliente
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Error del lado del servidor
          errorMessage = `Código: ${error.status}\nMensaje: ${error.message}`;
        }
        
        console.error(errorMessage);
        return throwError(() => error);
      })
    );
  }
}
```

---

## 📊 **Estados de Citas**

Los posibles estados de una cita son:
- `pendiente` - Esperando aprobación
- `confirmada` - Aprobada por el barbero
- `rechazada` - Rechazada por el barbero
- `cancelada` - Cancelada por el cliente
- `completada` - Servicio completado

---

## 🔐 **Autenticación (Próximamente)**

Actualmente el backend tiene JWT configurado pero no implementado. Para agregar autenticación:

1. Crear un `auth.service.ts`
2. Implementar login/logout
3. Guardar token en localStorage
4. Agregar token a headers HTTP

---

## ✨ **Próximos Pasos**

1. **Reemplazar datos mock** - Sustituir arrays hardcodeados en componentes por llamadas a servicios
2. **Implementar autenticación** - Conectar login/register con backend
3. **Agregar loading states** - Mostrar spinners durante carga
4. **Manejo de errores** - Mostrar mensajes amigables al usuario
5. **Optimización** - Implementar caché y paginación

---

## 🐛 **Solución de Problemas**

### **CORS Error**
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solución**: Verifica que el backend Django tenga CORS configurado correctamente en `settings.py`

### **Connection Refused**
```
net::ERR_CONNECTION_REFUSED
```
**Solución**: Asegúrate de que el backend Django esté corriendo en `http://127.0.0.1:8000`

### **404 Not Found**
```
GET http://127.0.0.1:8000/api/barberias/ 404 (Not Found)
```
**Solución**: Verifica que las URLs del backend coincidan con las del servicio

---

## 📝 **Checklist de Integración**

- [x] HttpClient configurado en `main.ts`
- [x] Servicios HTTP creados
- [x] Environment con `apiUrl` configurada
- [ ] Backend Django corriendo
- [ ] Reemplazar datos mock en componentes
- [ ] Probar endpoints desde componentes
- [ ] Implementar manejo de errores
- [ ] Agregar autenticación JWT

---

**¡Todo listo para conectar tu frontend con el backend! 🚀**

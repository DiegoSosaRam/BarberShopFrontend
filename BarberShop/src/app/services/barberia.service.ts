import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Barberia {
  id_barberias: number;
  nombre_barberia: string;
  direccion: string;
  telefono: string;
  timezone: string;
  slug: string;
  portada_url?: string;
  barberia_active: boolean;
  created_at: string;
  barberos_count?: number;
  servicios?: any[];
  horarios?: any[];
}

export interface ServicioConPrecio {
  id: number;
  id_barberia: number;
  id_servicio: number;
  nombre_servicio: string;
  description: string;
  precio_BarbServ: string;
  duracion_min: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class BarberiaService {
  private apiUrl = `${environment.apiUrl}/barberias`;

  constructor(private http: HttpClient) { }

  // Obtener todas las barberías
  getAll(): Observable<Barberia[]> {
    return this.http.get<Barberia[]>(`${this.apiUrl}/`);
  }

  // Obtener solo barberías activas
  getActivas(): Observable<Barberia[]> {
    return this.http.get<Barberia[]>(`${this.apiUrl}/activas/`);
  }

  // Obtener una barbería por ID (con detalles completos)
  getById(id: number): Observable<Barberia> {
    return this.http.get<Barberia>(`${this.apiUrl}/${id}/`);
  }

  // Obtener barberos de una barbería
  getBarberos(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/barberos/`);
  }

  // Obtener servicios de una barbería con precios
  getServicios(id: number): Observable<ServicioConPrecio[]> {
    return this.http.get<ServicioConPrecio[]>(`${this.apiUrl}/${id}/servicios/`);
  }

  // Obtener horarios de una barbería
  getHorarios(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/horarios/`);
  }

  // Verificar disponibilidad de barberos para una fecha y servicio
  getDisponibilidad(id: number, fecha: string, idServicio?: number): Observable<any[]> {
    let params = new HttpParams().set('fecha', fecha);
    if (idServicio) {
      params = params.set('id_servicio', idServicio.toString());
    }
    return this.http.get<any[]>(`${this.apiUrl}/${id}/disponibilidad/`, { params });
  }

  // Crear nueva barbería
  create(barberia: Partial<Barberia>): Observable<Barberia> {
    return this.http.post<Barberia>(`${this.apiUrl}/`, barberia);
  }

  // Actualizar barbería
  update(id: number, barberia: Partial<Barberia>): Observable<Barberia> {
    return this.http.put<Barberia>(`${this.apiUrl}/${id}/`, barberia);
  }

  // Actualización parcial
  patch(id: number, barberia: Partial<Barberia>): Observable<Barberia> {
    return this.http.patch<Barberia>(`${this.apiUrl}/${id}/`, barberia);
  }

  // Eliminar barbería
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }
}

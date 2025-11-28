import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Cita {
  id_cita?: number;
  id_cliente: number;
  cliente_nombre?: string;
  id_barbero: number;
  barbero_nombre?: string;
  id_servicio: number;
  servicio_nombre?: string;
  id_barberia: number;
  barberia_nombre?: string;
  inicio: string;
  fin: string;
  estado?: string;
  notas?: string;
  creada_por?: number;
  aprobada_por?: number;
  rechazada_por?: number;
  motivo_rechazo?: string;
  created_at?: string;
  pagos?: any[];
}

export interface CitaCreate {
  id_cliente: number;
  id_barbero: number;
  id_servicio: number;
  id_barberia: number;
  inicio: string;
  fin: string;
  notas?: string;
  servicio_personalizado?: string;
}

export interface Barberia {
  id_barberias: number;
  nombre_barberia: string;
  direccion: string;
  telefono: string;
  timezone?: string;
  slug?: string;
  portada_url?: string;
  barberia_active?: boolean;
  created_at?: string;
}

export interface Barbero {
  id_barbero: number;
  id_barberia: number;
  nombre_barbero: string;
  calificacion: number;
  especialidades?: string;
  anios_experiencia?: number;
  foto_url?: string;
  created_at?: string;
}

export interface Servicio {
  id_servicio: number;
  nombre_servicio: string;
  description?: string;
  precio_BarbServ?: number;
  duracion_min?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private apiUrl = `${environment.apiUrl}/citas`;
  private barberiasUrl = `${environment.apiUrl}/barberias`;
  private barberosUrl = `${environment.apiUrl}/barberos`;
  private serviciosUrl = `${environment.apiUrl}/servicios`;

  constructor(private http: HttpClient) { }

  // ========== ENDPOINTS PARA BARBERIAS ==========
  getBarberias(): Observable<Barberia[]> {
    return this.http.get<Barberia[]>(`${this.barberiasUrl}/`);
  }

  // ========== ENDPOINTS PARA BARBEROS ==========
  getBarberosPorBarberia(idBarberia: number): Observable<Barbero[]> {
    const params = new HttpParams().set('id_barberia', idBarberia.toString());
    return this.http.get<Barbero[]>(`${this.barberosUrl}/`, { params });
  }

  // ========== ENDPOINTS PARA SERVICIOS ==========
  getServiciosPorBarberia(idBarberia: number): Observable<Servicio[]> {
    const params = new HttpParams().set('id_barberia', idBarberia.toString());
    return this.http.get<Servicio[]>(`${this.serviciosUrl}/por_barberia/`, { params });
  }

  // ========== ENDPOINTS PARA CITAS ==========

  // Obtener todas las citas
  getAll(): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.apiUrl}/`);
  }

  // Obtener una cita por ID
  getById(id: number): Observable<Cita> {
    return this.http.get<Cita>(`${this.apiUrl}/${id}/`);
  }

  // Obtener citas de un cliente
  getPorCliente(idCliente: number): Observable<Cita[]> {
    const params = new HttpParams().set('id_cliente', idCliente.toString());
    return this.http.get<Cita[]>(`${this.apiUrl}/por_cliente/`, { params });
  }

  // Obtener citas de un barbero
  getPorBarbero(idBarbero: number, estado?: string): Observable<Cita[]> {
    let params = new HttpParams().set('id_barbero', idBarbero.toString());
    if (estado) {
      params = params.set('estado', estado);
    }
    return this.http.get<Cita[]>(`${this.apiUrl}/por_barbero/`, { params });
  }

  // Crear nueva cita
  create(cita: CitaCreate): Observable<Cita> {
    return this.http.post<Cita>(`${this.apiUrl}/`, cita);
  }

  // Actualizar cita
  update(id: number, cita: Partial<Cita>): Observable<Cita> {
    return this.http.put<Cita>(`${this.apiUrl}/${id}/`, cita);
  }

  // Actualización parcial
  patch(id: number, cita: Partial<Cita>): Observable<Cita> {
    return this.http.patch<Cita>(`${this.apiUrl}/${id}/`, cita);
  }

  // Aprobar una cita
  aprobar(id: number, idBarbero: number): Observable<Cita> {
    return this.http.post<Cita>(`${this.apiUrl}/${id}/aprobar/`, { id_barbero: idBarbero });
  }

  // Rechazar una cita
  rechazar(id: number, idBarbero: number, motivo: string): Observable<Cita> {
    return this.http.post<Cita>(`${this.apiUrl}/${id}/rechazar/`, { 
      id_barbero: idBarbero,
      motivo: motivo 
    });
  }

  // Cancelar una cita
  cancelar(id: number): Observable<Cita> {
    return this.http.post<Cita>(`${this.apiUrl}/${id}/cancelar/`, {});
  }

  // Completar una cita
  completar(id: number): Observable<Cita> {
    return this.http.post<Cita>(`${this.apiUrl}/${id}/completar/`, {});
  }

  // Eliminar cita
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }
}

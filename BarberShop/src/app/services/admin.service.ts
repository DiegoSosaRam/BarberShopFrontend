import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Barberia, Barbero, Servicio } from './cita.service';

export interface BarberiaCreate {
  nombre_barberia: string;
  direccion: string;
  telefono: string;
  timezone?: string;
  slug?: string;
  portada_url?: string;
  barberia_active?: boolean;
}

export interface BarberoCreate {
  id_barberia: number;
  nombre_barbero: string;
  especialidades?: string;
  anios_experiencia?: number;
  calificacion?: number;
  foto_url?: string;
}

export interface CitaAdmin {
  id_cita: number;
  id_cliente: number;
  nombre_usuario: string;
  email_usuario: string;
  id_barbero: number;
  nombre_barbero: string;
  id_servicio: number;
  nombre_servicio: string;
  id_barberia: number;
  nombre_barberia: string;
  fecha_cita: string;
  hora_cita: string;
  inicio: string;
  fin: string;
  estado: string;
  notas?: string;
  servicio_personalizado?: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private barberiasUrl = `${environment.apiUrl}/barberias`;
  private barberosUrl = `${environment.apiUrl}/barberos`;
  private serviciosUrl = `${environment.apiUrl}/servicios`;
  private citasUrl = `${environment.apiUrl}/citas`;

  constructor(private http: HttpClient) { }

  // ========== GESTIÓN DE BARBERÍAS ==========
  
  createBarberia(barberia: BarberiaCreate): Observable<Barberia> {
    return this.http.post<Barberia>(`${this.barberiasUrl}/`, barberia);
  }

  updateBarberia(id: number, barberia: Partial<BarberiaCreate>): Observable<Barberia> {
    return this.http.patch<Barberia>(`${this.barberiasUrl}/${id}/`, barberia);
  }

  deleteBarberia(id: number): Observable<void> {
    return this.http.delete<void>(`${this.barberiasUrl}/${id}/`);
  }

  // ========== GESTIÓN DE BARBEROS ==========
  
  createBarbero(barbero: BarberoCreate): Observable<Barbero> {
    return this.http.post<Barbero>(`${this.barberosUrl}/`, barbero);
  }

  updateBarbero(id: number, barbero: Partial<BarberoCreate>): Observable<Barbero> {
    return this.http.patch<Barbero>(`${this.barberosUrl}/${id}/`, barbero);
  }

  deleteBarbero(id: number): Observable<void> {
    return this.http.delete<void>(`${this.barberosUrl}/${id}/`);
  }

  // ========== GESTIÓN DE CITAS ==========
  
  getAllCitas(): Observable<CitaAdmin[]> {
    return this.http.get<CitaAdmin[]>(`${this.citasUrl}/`);
  }

  getCitasPendientes(): Observable<CitaAdmin[]> {
    return this.http.get<CitaAdmin[]>(`${this.citasUrl}/pendientes/`);
  }

  aprobarCita(id: number): Observable<CitaAdmin> {
    return this.http.post<CitaAdmin>(`${this.citasUrl}/${id}/aprobar/`, {});
  }

  rechazarCita(id: number, motivo: string): Observable<CitaAdmin> {
    return this.http.post<CitaAdmin>(`${this.citasUrl}/${id}/rechazar/`, { 
      motivo: motivo 
    });
  }
}

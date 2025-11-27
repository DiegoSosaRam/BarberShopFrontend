import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Barbero {
  id_barbero: number;
  id_barberia: number;
  nombre_barberia?: string;
  calificacion: number;
  nombre_barbero: string;
  foto_url?: string;
  especialidades?: string;
  anios_experiencia: number;
  created_at: string;
  servicios?: any[];
}

export interface BarberoDetalle extends Barbero {
  barberia?: any;
  resenas?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class BarberoService {
  private apiUrl = `${environment.apiUrl}/barberos`;

  constructor(private http: HttpClient) { }

  // Obtener todos los barberos
  getAll(): Observable<Barbero[]> {
    return this.http.get<Barbero[]>(`${this.apiUrl}/`);
  }

  // Obtener un barbero por ID (con detalles completos)
  getById(id: number): Observable<BarberoDetalle> {
    return this.http.get<BarberoDetalle>(`${this.apiUrl}/${id}/`);
  }

  // Obtener servicios que ofrece un barbero
  getServicios(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/servicios/`);
  }

  // Obtener citas de un barbero
  getCitas(id: number, fecha?: string, inicio?: string, fin?: string): Observable<any[]> {
    let params = new HttpParams();
    if (fecha) {
      params = params.set('fecha', fecha);
    } else if (inicio && fin) {
      params = params.set('inicio', inicio).set('fin', fin);
    }
    return this.http.get<any[]>(`${this.apiUrl}/${id}/citas/`, { params });
  }

  // Obtener reseñas de un barbero
  getResenas(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/resenas/`);
  }

  // Actualizar calificación de un barbero
  actualizarCalificacion(id: number): Observable<{ calificacion: number }> {
    return this.http.post<{ calificacion: number }>(`${this.apiUrl}/${id}/actualizar_calificacion/`, {});
  }

  // Crear nuevo barbero
  create(barbero: Partial<Barbero>): Observable<Barbero> {
    return this.http.post<Barbero>(`${this.apiUrl}/`, barbero);
  }

  // Actualizar barbero
  update(id: number, barbero: Partial<Barbero>): Observable<Barbero> {
    return this.http.put<Barbero>(`${this.apiUrl}/${id}/`, barbero);
  }

  // Actualización parcial
  patch(id: number, barbero: Partial<Barbero>): Observable<Barbero> {
    return this.http.patch<Barbero>(`${this.apiUrl}/${id}/`, barbero);
  }

  // Eliminar barbero
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }
}

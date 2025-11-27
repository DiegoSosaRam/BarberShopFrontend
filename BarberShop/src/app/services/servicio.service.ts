import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Servicio {
  id_servicio: number;
  nombre_servicio: string;
  description: string;
  servicio_active: boolean;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  private apiUrl = `${environment.apiUrl}/servicios`;

  constructor(private http: HttpClient) { }

  // Obtener todos los servicios
  getAll(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.apiUrl}/`);
  }

  // Obtener solo servicios activos
  getActivos(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.apiUrl}/activos/`);
  }

  // Obtener un servicio por ID
  getById(id: number): Observable<Servicio> {
    return this.http.get<Servicio>(`${this.apiUrl}/${id}/`);
  }

  // Crear nuevo servicio
  create(servicio: Partial<Servicio>): Observable<Servicio> {
    return this.http.post<Servicio>(`${this.apiUrl}/`, servicio);
  }

  // Actualizar servicio
  update(id: number, servicio: Partial<Servicio>): Observable<Servicio> {
    return this.http.put<Servicio>(`${this.apiUrl}/${id}/`, servicio);
  }

  // Actualización parcial
  patch(id: number, servicio: Partial<Servicio>): Observable<Servicio> {
    return this.http.patch<Servicio>(`${this.apiUrl}/${id}/`, servicio);
  }

  // Eliminar servicio
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Resena {
  id_resenia?: number;
  id_cita: number;
  id_barbero: number;
  nombre_barbero?: string;
  calificacion: number;
  comentario?: string;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ResenaService {
  private apiUrl = `${environment.apiUrl}/resenas`;

  constructor(private http: HttpClient) { }

  // Obtener todas las reseñas
  getAll(): Observable<Resena[]> {
    return this.http.get<Resena[]>(`${this.apiUrl}/`);
  }

  // Obtener una reseña por ID
  getById(id: number): Observable<Resena> {
    return this.http.get<Resena>(`${this.apiUrl}/${id}/`);
  }

  // Obtener reseñas de un barbero
  getPorBarbero(idBarbero: number): Observable<Resena[]> {
    const params = new HttpParams().set('id_barbero', idBarbero.toString());
    return this.http.get<Resena[]>(`${this.apiUrl}/por_barbero/`, { params });
  }

  // Crear nueva reseña
  create(resena: Partial<Resena>): Observable<Resena> {
    return this.http.post<Resena>(`${this.apiUrl}/`, resena);
  }

  // Actualizar reseña
  update(id: number, resena: Partial<Resena>): Observable<Resena> {
    return this.http.put<Resena>(`${this.apiUrl}/${id}/`, resena);
  }

  // Eliminar reseña
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }
}

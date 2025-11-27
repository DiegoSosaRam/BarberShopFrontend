import { Injectable } from '@angular/core';
import { AuthService, AuthUser } from './auth.service';
import { Observable, map } from 'rxjs';

// Interface de compatibilidad para código existente
export interface Usuario {
  id_profile?: number;
  role?: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  is_active?: boolean;
  created_at?: string;
  email: string;
  
  // Propiedades de compatibilidad (deprecated)
  id?: string;
  nombre?: string;
  telefono?: string;
  tipo?: 'cliente' | 'barbero';
  fechaRegistro?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  constructor(private authService: AuthService) {}

  /**
   * Obtener usuario actual (delegado a AuthService)
   */
  getCurrentUser(): Usuario | null {
    const authUser = this.authService.getCurrentUser();
    if (!authUser) return null;
    
    return this.convertAuthUserToUsuario(authUser);
  }

  /**
   * Observable del usuario actual
   */
  get currentUser$() {
    return this.authService.currentUser$.pipe(
      map(authUser => authUser ? this.convertAuthUserToUsuario(authUser) : null)
    );
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    this.authService.logout();
  }

  /**
   * Verificar si hay usuario logueado
   */
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  /**
   * Convertir AuthUser a Usuario (para compatibilidad)
   */
  private convertAuthUserToUsuario(authUser: AuthUser): Usuario {
    return {
      id_profile: authUser.id_profile,
      role: authUser.role,
      full_name: authUser.full_name,
      phone: authUser.phone,
      avatar_url: authUser.avatar_url,
      is_active: authUser.is_active,
      created_at: authUser.created_at,
      email: authUser.email,
      
      // Compatibilidad con código antiguo
      id: authUser.id_profile.toString(),
      nombre: authUser.full_name,
      telefono: authUser.phone,
      tipo: this.mapRoleToTipo(authUser.role),
      fechaRegistro: authUser.created_at
    };
  }

  /**
   * Mapear role a tipo (para compatibilidad)
   */
  private mapRoleToTipo(role: string): 'cliente' | 'barbero' {
    if (role === 'BARBERO') return 'barbero';
    return 'cliente';
  }

  /**
   * Verificar si el usuario actual es cliente y tiene citas
   * @deprecated - Usar CitaService.getPorCliente() directamente
   */
  get clienteActualTieneCitas(): boolean {
    // Ya no se puede verificar sin llamar al backend
    // Este método queda deprecated
    return false;
  }

  // Admin methods - TODO: Convert to backend API calls
  getAllUsers(): Usuario[] {
    console.warn('getAllUsers: This method should call backend API');
    return [];
  }

  getUserStats() {
    console.warn('getUserStats: This method should call backend API');
    return {
      total: 0,
      clientes: 0,
      barberos: 0,
      admins: 0
    };
  }

  deleteUser(user: Usuario): void {
    console.warn('deleteUser: This method should call backend API', user);
  }

  clearAllUsers(): void {
    console.warn('clearAllUsers: This method should call backend API');
  }
}
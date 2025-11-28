import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
  phone: string;
  role_code?: string; // Deprecated - use role_code_input instead
  role_code_input?: string; // 'CLIENTE', 'BARBERO', 'ADMIN'
}

export interface AuthUser {
  id_profile: number;
  role: string;
  role_code?: string;
  id_barberia?: number;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  user: AuthUser;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  
  // BehaviorSubject para el usuario actual
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  // Key para localStorage
  private readonly USER_STORAGE_KEY = 'barbershop_user';

  constructor(private http: HttpClient) {}

  /**
   * Obtener usuario desde localStorage
   */
  private getUserFromStorage(): AuthUser | null {
    try {
      const userJson = localStorage.getItem(this.USER_STORAGE_KEY);
      if (userJson) {
        const user = JSON.parse(userJson) as any;
        // Mapear role_code a role si no existe
        if (user && !user.role && user.role_code) {
          user.role = user.role_code;
        }
        return user as AuthUser;
      }
    } catch (error) {
      console.error('Error al recuperar usuario de localStorage:', error);
      localStorage.removeItem(this.USER_STORAGE_KEY);
    }
    return null;
  }

  /**
   * Guardar usuario en localStorage
   */
  private saveUserToStorage(user: AuthUser | null): void {
    try {
      if (user) {
        localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(this.USER_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error al guardar usuario en localStorage:', error);
    }
  }

  /**
   * Login - Autenticar usuario por email y password
   */
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<any>(`${this.apiUrl}/usuarios/login/`, {
      email,
      password
    }).pipe(
      map(response => {
        // Mapear role_code a role si no existe
        const user = response.user;
        if (user && !user.role && (user as any).role_code) {
          user.role = (user as any).role_code;
        }
        return response as AuthResponse;
      }),
      tap(response => {
        console.log('Usuario autenticado:', response.user);
        // Guardar usuario en localStorage y memoria
        this.currentUserSubject.next(response.user);
        this.saveUserToStorage(response.user);
      }),
      catchError(error => {
        console.error('Error en login:', error);
        let errorMessage = 'Email o contraseña incorrectos';
        
        if (error.status === 404) {
          errorMessage = 'Usuario no encontrado';
        } else if (error.status === 403) {
          errorMessage = 'Usuario inactivo';
        } else if (error.error?.error) {
          errorMessage = error.error.error;
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**
   * Register - Registrar nuevo usuario
   */
  register(userData: RegisterRequest): Observable<AuthUser> {
    const profileData = {
      full_name: userData.full_name,
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
      role_code: userData.role_code || 'CLIENTE',
      is_active: true
    };

    return this.http.post<AuthUser>(`${this.apiUrl}/usuarios/`, profileData).pipe(
      tap(user => {
        // Después de registrar, hacer login automático
        this.currentUserSubject.next(user);
        this.saveUserToStorage(user);
      }),
      catchError(error => {
        console.error('Error en registro:', error);
        let errorMessage = 'Error al registrar usuario';
        
        if (error.status === 400) {
          if (error.error?.email) {
            errorMessage = 'El email ya está registrado';
          } else if (error.error?.phone) {
            errorMessage = 'El teléfono ya está registrado';
          } else if (error.error?.password) {
            errorMessage = 'La contraseña es muy corta (mínimo 6 caracteres)';
          }
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**
   * Logout - Cerrar sesión
   */
  logout(): void {
    this.currentUserSubject.next(null);
    this.saveUserToStorage(null);
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  /**
   * Verificar si hay usuario logueado
   */
  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Obtener perfil actualizado del backend
   */
  refreshUserProfile(): Observable<AuthUser> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('No hay usuario logueado'));
    }

    return this.http.get<AuthUser>(`${this.apiUrl}/usuarios/${currentUser.id_profile}/`).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        this.saveUserToStorage(user);
      })
    );
  }

  /**
   * Actualizar perfil del usuario
   */
  updateProfile(profileData: Partial<AuthUser>): Observable<AuthUser> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('No hay usuario logueado'));
    }

    return this.http.patch<AuthUser>(`${this.apiUrl}/usuarios/${currentUser.id_profile}/`, profileData).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        this.saveUserToStorage(user);
      })
    );
  }

  /**
   * Verificar si el email ya existe (para validación en registro)
   */
  emailExists(email: string): Observable<boolean> {
    return this.http.get<AuthUser[]>(`${this.apiUrl}/usuarios/?email=${email}`).pipe(
      map((users: AuthUser[]) => users.length > 0)
    );
  }

  /**
   * Obtener tipo de usuario (rol)
   */
  getUserRole(): string | null {
    return this.currentUserSubject.value?.role || null;
  }

  /**
   * Verificar si el usuario es cliente
   */
  isCliente(): boolean {
    return this.getUserRole() === 'CLIENTE';
  }

  /**
   * Verificar si el usuario es barbero
   */
  isBarbero(): boolean {
    return this.getUserRole() === 'BARBERO';
  }

  /**
   * Verificar si el usuario es admin
   */
  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }
}

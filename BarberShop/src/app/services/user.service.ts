import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Usuario {
  id: string;
  email: string;
  password: string;
  nombre: string;
  telefono?: string;
  tipo: 'cliente' | 'barbero';
  fechaRegistro: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly USERS_KEY = 'barbershop_users';
  private readonly CURRENT_USER_KEY = 'barbershop_current_user';
  
  // BehaviorSubject para notificar cambios en el usuario actual
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.initializeDefaultUsers();
    // Cargar usuario actual si existe
    const currentUser = this.getCurrentUser();
    this.currentUserSubject.next(currentUser);
  }

  // Inicializar usuarios por defecto si no existen
  private initializeDefaultUsers() {
    const existingUsers = this.getAllUsers();
    
    if (existingUsers.length === 0) {
      const defaultUsers: Usuario[] = [
        {
          id: 'cliente-001',
          email: 'cliente@barbershop.com',
          password: '123456',
          nombre: 'Juan Pérez',
          telefono: '555-0001',
          tipo: 'cliente',
          fechaRegistro: new Date().toISOString()
        },
        {
          id: 'barbero-001',
          email: 'barbero@barbershop.com',
          password: '123456',
          nombre: 'Carlos Mendoza',
          telefono: '555-0002',
          tipo: 'barbero',
          fechaRegistro: new Date().toISOString()
        }
      ];
      
      this.saveUsers(defaultUsers);
    }
  }

  // Obtener todos los usuarios
  getAllUsers(): Usuario[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  // Guardar usuarios en localStorage
  private saveUsers(users: Usuario[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  // Buscar usuario por email y password
  authenticateUser(email: string, password: string): Usuario | null {
    const users = this.getAllUsers();
    return users.find(user => user.email === email && user.password === password) || null;
  }

  // Verificar si un email ya existe
  emailExists(email: string): boolean {
    const users = this.getAllUsers();
    return users.some(user => user.email === email);
  }

  // Registrar nuevo usuario
  registerUser(userData: Omit<Usuario, 'id' | 'fechaRegistro'>): Usuario {
    const users = this.getAllUsers();
    
    // Generar ID único
    const id = `${userData.tipo}-${Date.now().toString(36)}`;
    
    const newUser: Usuario = {
      ...userData,
      id,
      fechaRegistro: new Date().toISOString()
    };
    
    users.push(newUser);
    this.saveUsers(users);
    
    return newUser;
  }

  // Obtener usuario actual de la sesión
  getCurrentUser(): Usuario | null {
    const currentUser = localStorage.getItem(this.CURRENT_USER_KEY);
    return currentUser ? JSON.parse(currentUser) : null;
  }

  // Guardar usuario actual en sesión
  setCurrentUser(user: Usuario): void {
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user); // Notificar cambio
  }

  // Cerrar sesión
  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
    this.currentUserSubject.next(null); // Notificar cambio
  }

  // Obtener usuarios por tipo
  getUsersByType(tipo: 'cliente' | 'barbero'): Usuario[] {
    const users = this.getAllUsers();
    return users.filter(user => user.tipo === tipo);
  }

  // Eliminar usuario (para testing)
  deleteUser(id: string): boolean {
    const users = this.getAllUsers();
    const filteredUsers = users.filter(user => user.id !== id);
    
    if (filteredUsers.length !== users.length) {
      this.saveUsers(filteredUsers);
      return true;
    }
    
    return false;
  }

  // Limpiar todos los usuarios (para testing)
  clearAllUsers(): void {
    localStorage.removeItem(this.USERS_KEY);
    localStorage.removeItem(this.CURRENT_USER_KEY);
    this.initializeDefaultUsers();
  }

  // Obtener estadísticas
  getUserStats() {
    const users = this.getAllUsers();
    return {
      total: users.length,
      clientes: users.filter(u => u.tipo === 'cliente').length,
      barberos: users.filter(u => u.tipo === 'barbero').length,
      registrosHoy: users.filter(u => {
        const today = new Date().toDateString();
        const userDate = new Date(u.fechaRegistro).toDateString();
        return today === userDate;
      }).length
    };
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent, 
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonBadge,
  IonToast
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  calendarOutline, 
  timeOutline, 
  personOutline,
  checkmarkCircleOutline,
  hourglassOutline,
  closeCircleOutline,
  arrowBackOutline
} from 'ionicons/icons';
import { UserService, Usuario } from '../../services/user.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';

// Interface para las citas del cliente (basada en la tabla citas + joins)
export interface CitaCliente {
  id_cita: number;
  id_cliente: number;
  id_barbero: number;
  id_servicio: number;
  id_barberia: number;
  inicio: string;
  fin: string;
  estado: 'pendiente' | 'aceptada' | 'completada' | 'cancelada';
  notas?: string;
  created_at: string;
  // Campos de joins para display
  nombre_barbero: string;
  nombre_servicio: string;
  nombre_barberia: string;
  precio_BarbServ: number;
  duracion_min: string;
  // Campos de compatibilidad (deprecated)
  id?: string;
  barbero?: string;
  servicio?: string;
  fecha?: string;
  hora?: string;
  precio?: number;
  duracion?: string;
  fechaCreacion?: string;
}

@Component({
  selector: 'app-mis-citas',
  templateUrl: './mis-citas.page.html',
  styleUrls: ['./mis-citas.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent, 
    IonCard,
    IonCardContent,
    IonButton,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonBadge,
    IonToast,
    NavbarComponent
  ]
})
export class MisCitasPage implements OnInit {

  currentUser: Usuario | null = null;
  misCitas: CitaCliente[] = [];
  showToast = false;
  toastMessage = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {
    addIcons({
      calendarOutline, 
      timeOutline, 
      personOutline,
      checkmarkCircleOutline,
      hourglassOutline,
      closeCircleOutline,
      arrowBackOutline
    });
  }

  ngOnInit() {
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadMisCitas();
      }
    });
  }

  get firstName(): string {
    if (!this.currentUser?.nombre) {
      return 'Cliente';
    }
    return this.currentUser.nombre.split(' ')[0] || 'Cliente';
  }

  get citasPendientes(): CitaCliente[] {
    return this.misCitas.filter(c => c.estado === 'pendiente');
  }

  get citasAceptadas(): CitaCliente[] {
    return this.misCitas.filter(c => c.estado === 'aceptada');
  }

  get citasCompletadas(): CitaCliente[] {
    return this.misCitas.filter(c => c.estado === 'completada');
  }

  get citasCanceladas(): CitaCliente[] {
    return this.misCitas.filter(c => c.estado === 'cancelada');
  }

  get citasProximas(): CitaCliente[] {
    return [...this.citasPendientes, ...this.citasAceptadas];
  }

  loadMisCitas() {
    // Simular citas del cliente (aquí conectarías con tu API)
    this.misCitas = [
      {
        id_cita: 1,
        id_cliente: 1,
        id_barbero: 1,
        id_servicio: 3,
        id_barberia: 1,
        inicio: '2024-10-20T14:30:00',
        fin: '2024-10-20T15:15:00',
        estado: 'aceptada',
        notas: 'Corte degradado, barba con diseño',
        created_at: '2024-10-15T10:00:00',
        nombre_barbero: 'Carlos Martínez',
        nombre_servicio: 'Corte Premium + Barba',
        nombre_barberia: 'Premium Cuts',
        precio_BarbServ: 25000,
        duracion_min: '45',
        // Campos de compatibilidad
        id: '1',
        barbero: 'Carlos Martínez',
        servicio: 'Corte Premium + Barba',
        fecha: '2024-10-20',
        hora: '14:30',
        precio: 25000,
        duracion: '45 min',
        fechaCreacion: '2024-10-15'
      },
      {
        id_cita: 2,
        id_cliente: 1,
        id_barbero: 4,
        id_servicio: 1,
        id_barberia: 1,
        inicio: '2024-10-18T16:00:00',
        fin: '2024-10-18T16:30:00',
        estado: 'pendiente',
        created_at: '2024-10-16T09:00:00',
        nombre_barbero: 'Miguel Rodriguez',
        nombre_servicio: 'Corte Clásico',
        nombre_barberia: 'Premium Cuts',
        precio_BarbServ: 15000,
        duracion_min: '30',
        // Campos de compatibilidad
        id: '2',
        barbero: 'Miguel Rodriguez',
        servicio: 'Corte Clásico',
        fecha: '2024-10-18',
        hora: '16:00',
        precio: 15000,
        duracion: '30 min',
        fechaCreacion: '2024-10-15'
      },
      {
        id_cita: 3,
        id_cliente: 1,
        id_barbero: 1,
        id_servicio: 4,
        id_barberia: 1,
        inicio: '2024-10-12T11:00:00',
        fin: '2024-10-12T11:25:00',
        estado: 'completada',
        notas: 'Afeitado con navaja tradicional',
        created_at: '2024-10-10T14:00:00',
        nombre_barbero: 'Carlos Martínez',
        nombre_servicio: 'Afeitado Tradicional',
        nombre_barberia: 'Premium Cuts',
        precio_BarbServ: 12000,
        duracion_min: '25',
        // Campos de compatibilidad
        id: '3',
        barbero: 'Carlos Martínez',
        servicio: 'Afeitado Tradicional',
        fecha: '2024-10-12',
        hora: '11:00',
        precio: 12000,
        duracion: '25 min',
        fechaCreacion: '2024-10-10'
      },
      {
        id_cita: 4,
        id_cliente: 1,
        id_barbero: 5,
        id_servicio: 1,
        id_barberia: 2,
        inicio: '2024-10-10T09:30:00',
        fin: '2024-10-10T10:10:00',
        estado: 'cancelada',
        created_at: '2024-10-08T12:00:00',
        nombre_barbero: 'Luis García',
        nombre_servicio: 'Corte + Lavado',
        nombre_barberia: 'Barbería Central',
        precio_BarbServ: 18000,
        duracion_min: '40',
        // Campos de compatibilidad
        id: '4',
        barbero: 'Luis García',
        servicio: 'Corte + Lavado',
        fecha: '2024-10-10',
        hora: '09:30',
        precio: 18000,
        duracion: '40 min',
        fechaCreacion: '2024-10-08'
      }
    ];
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'pendiente':
        return 'warning';
      case 'aceptada':
        return 'primary';
      case 'completada':
        return 'success';
      case 'cancelada':
        return 'danger';
      default:
        return 'medium';
    }
  }

  getEstadoIcon(estado: string): string {
    switch (estado) {
      case 'pendiente':
        return 'hourglass-outline';
      case 'aceptada':
        return 'checkmark-circle-outline';
      case 'completada':
        return 'checkmark-circle-outline';
      case 'cancelada':
        return 'close-circle-outline';
      default:
        return 'calendar-outline';
    }
  }

  formatFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  cancelarCita(cita: CitaCliente) {
    if (cita.estado === 'pendiente' || cita.estado === 'aceptada') {
      cita.estado = 'cancelada';
      this.showToastMessage('Cita cancelada exitosamente');
    }
  }

  agendarNuevaCita() {
    this.router.navigate(['/services']);
  }

  goBack() {
    this.router.navigate(['/']);
  }

  showToastMessage(message: string) {
    this.toastMessage = message;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  // Track function para el *ngFor
  trackByCitaId(index: number, cita: CitaCliente): string {
    return cita.id || cita.id_cita.toString();
  }
}
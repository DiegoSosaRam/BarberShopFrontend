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

// Interface para las citas del cliente
export interface CitaCliente {
  id: string;
  barbero: string;
  servicio: string;
  fecha: string;
  hora: string;
  estado: 'pendiente' | 'aceptada' | 'completada' | 'cancelada';
  precio: number;
  duracion: string;
  notas?: string;
  fechaCreacion: string;
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
        id: '1',
        barbero: 'Carlos Martínez',
        servicio: 'Corte Premium + Barba',
        fecha: '2024-10-20',
        hora: '14:30',
        estado: 'aceptada',
        precio: 250,
        duracion: '45 min',
        notas: 'Corte degradado, barba con diseño',
        fechaCreacion: '2024-10-15'
      },
      {
        id: '2',
        barbero: 'Miguel Rodriguez',
        servicio: 'Corte Clásico',
        fecha: '2024-10-18',
        hora: '16:00',
        estado: 'pendiente',
        precio: 150,
        duracion: '30 min',
        fechaCreacion: '2024-10-15'
      },
      {
        id: '3',
        barbero: 'Carlos Martínez',
        servicio: 'Afeitado Tradicional',
        fecha: '2024-10-12',
        hora: '11:00',
        estado: 'completada',
        precio: 120,
        duracion: '25 min',
        notas: 'Afeitado con navaja tradicional',
        fechaCreacion: '2024-10-10'
      },
      {
        id: '4',
        barbero: 'Luis García',
        servicio: 'Corte + Lavado',
        fecha: '2024-10-10',
        hora: '09:30',
        estado: 'cancelada',
        precio: 180,
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
    return cita.id;
  }
}
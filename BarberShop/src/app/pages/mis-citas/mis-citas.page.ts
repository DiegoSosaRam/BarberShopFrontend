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
import { CitaService, Cita } from '../../services/cita.service';
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
  estado: 'pendiente' | 'aceptada' | 'confirmada' | 'completada' | 'cancelada' | 'rechazada';
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
  loading = false;

  constructor(
    private userService: UserService,
    private citaService: CitaService,
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
      if (!user) {
        // Si no hay usuario logueado, redirigir a login
        this.router.navigate(['/login']);
        return;
      }
      this.loadMisCitas();
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
    return this.misCitas.filter(c => c.estado === 'aceptada' || c.estado === 'confirmada');
  }

  get citasCompletadas(): CitaCliente[] {
    return this.misCitas.filter(c => c.estado === 'completada');
  }

  get citasCanceladas(): CitaCliente[] {
    return this.misCitas.filter(c => c.estado === 'cancelada' || c.estado === 'rechazada');
  }

  get citasProximas(): CitaCliente[] {
    return [...this.citasPendientes, ...this.citasAceptadas];
  }

  loadMisCitas() {
    if (!this.currentUser?.id_profile) {
      console.log('No hay usuario logueado');
      return;
    }

    this.loading = true;
    this.citaService.getPorCliente(this.currentUser.id_profile).subscribe({
      next: (citas) => {
        console.log('Citas obtenidas del backend:', citas);
        // Mapear las citas del backend al formato esperado
        this.misCitas = citas.map(cita => this.mapCitaToCliente(cita));
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar citas:', error);
        this.misCitas = [];
        this.loading = false;
        this.showToastMessage('Error al cargar tus citas');
      }
    });
  }

  private mapCitaToCliente(cita: Cita): CitaCliente {
    return {
      id_cita: cita.id_cita || 0,
      id_cliente: cita.id_cliente,
      id_barbero: cita.id_barbero,
      id_servicio: cita.id_servicio,
      id_barberia: cita.id_barberia,
      inicio: cita.inicio,
      fin: cita.fin,
      estado: (cita.estado || 'pendiente') as 'pendiente' | 'aceptada' | 'confirmada' | 'completada' | 'cancelada' | 'rechazada',
      notas: cita.notas,
      created_at: cita.created_at || '',
      nombre_barbero: cita.barbero_nombre || 'Sin asignar',
      nombre_servicio: cita.servicio_nombre || 'Sin nombre',
      nombre_barberia: cita.barberia_nombre || 'Sin barbería',
      precio_BarbServ: (cita as any).precio_BarbServ || 0,
      duracion_min: (cita as any).duracion_min || '30',
    };
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'pendiente':
        return 'warning';
      case 'aceptada':
      case 'confirmada':
        return 'primary';
      case 'completada':
        return 'success';
      case 'cancelada':
      case 'rechazada':
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
    if (cita.estado !== 'pendiente' && cita.estado !== 'aceptada') {
      this.showToastMessage('Solo puedes cancelar citas pendientes o aceptadas');
      return;
    }

    if (!confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
      return;
    }

    this.citaService.cancelar(cita.id_cita).subscribe({
      next: () => {
        cita.estado = 'cancelada';
        this.showToastMessage('Cita cancelada exitosamente');
      },
      error: (error) => {
        console.error('Error al cancelar cita:', error);
        this.showToastMessage('Error al cancelar la cita');
      }
    });
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
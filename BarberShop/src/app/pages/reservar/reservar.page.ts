import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent, 
  IonCard, 
  IonCardContent, 
  IonButton, 
  IonInput, 
  IonTextarea, 
  IonItem,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonToast,
  IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  calendarOutline, 
  timeOutline, 
  cutOutline, 
  personOutline, 
  starOutline,
  checkmarkCircle,
  arrowBack,
  arrowForward,
  star,
  locationOutline,
  callOutline, informationCircleOutline } from 'ionicons/icons';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { AuthService, AuthUser } from '../../services/auth.service';
import { CitaService, CitaCreate, Barberia, Barbero, Servicio } from '../../services/cita.service';

@Component({
  selector: 'app-reservar',
  templateUrl: './reservar.page.html',
  styleUrls: ['./reservar.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonCard, IonCardContent, 
    IonButton, IonInput, IonTextarea, IonItem, 
    IonLabel, IonGrid, IonRow, IonCol, IonIcon, IonToast,
    IonSpinner, CommonModule, FormsModule, NavbarComponent
  ]
})
export class ReservarPage implements OnInit {

  // Control de pasos
  step: number = 1;
  loading: boolean = false;
  showToast: boolean = false;
  toastMessage: string = '';
  toastColor: string = 'success';

  // Usuario actual
  currentUser: AuthUser | null = null;

  // Datos del formulario
  barberias: Barberia[] = [];
  barberos: Barbero[] = [];
  servicios: Servicio[] = [];

  // Selecciones del usuario
  barberiaSeleccionada: Barberia | null = null;
  barberoSeleccionado: Barbero | null = null;
  servicioSeleccionado: Servicio | null = null;
  fecha: string = '';
  hora: string = '';
  notas: string = '';
  descripcionPersonalizada: string = '';

  constructor(
    private authService: AuthService,
    private citaService: CitaService,
    private router: Router
  ) {
    addIcons({checkmarkCircle,locationOutline,callOutline,arrowForward,arrowBack,timeOutline,informationCircleOutline,calendarOutline,cutOutline,personOutline,starOutline,star});
  }

  ngOnInit() {
    // Verificar si hay usuario logueado
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (!user) {
        this.router.navigate(['/login']);
      }
    });

    // Cargar las 6 barberías
    this.cargarBarberias();
  }

  cargarBarberias() {
    this.loading = true;
    this.citaService.getBarberias().subscribe({
      next: (barberias) => {
        this.barberias = barberias.filter(b => b.barberia_active);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando barberías:', err);
        this.mostrarToast('Error al cargar barberías', 'danger');
        this.loading = false;
      }
    });
  }

  seleccionarBarberia(barberia: Barberia) {
    this.barberiaSeleccionada = barberia;
    this.barberoSeleccionado = null;
    this.servicioSeleccionado = null;
    this.loading = true;

    // Cargar barberos de esta barbería
    this.citaService.getBarberosPorBarberia(barberia.id_barberias).subscribe({
      next: (barberos) => {
        this.barberos = barberos;
        this.step = 2;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando barberos:', err);
        this.mostrarToast('Error al cargar barberos', 'danger');
        this.loading = false;
      }
    });
  }

  seleccionarBarbero(barbero: Barbero) {
    this.barberoSeleccionado = barbero;
    this.servicioSeleccionado = null;
    this.loading = true;

    // Cargar servicios de esta barbería
    this.citaService.getServiciosPorBarberia(this.barberiaSeleccionada!.id_barberias).subscribe({
      next: (servicios) => {
        this.servicios = servicios;
        this.step = 3;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando servicios:', err);
        this.mostrarToast('Error al cargar servicios', 'danger');
        this.loading = false;
      }
    });
  }

  seleccionarServicio(servicio: Servicio) {
    this.servicioSeleccionado = servicio;
  }

  volverPaso() {
    if (this.step > 1) {
      this.step--;
      if (this.step === 1) {
        this.barberiaSeleccionada = null;
        this.barberoSeleccionado = null;
        this.servicioSeleccionado = null;
      } else if (this.step === 2) {
        this.barberoSeleccionado = null;
        this.servicioSeleccionado = null;
      }
    }
  }

  getStarArray(calificacion: number): number[] {
    return Array(5).fill(0).map((_, i) => i < Math.round(calificacion) ? 1 : 0);
  }

  esServicioPersonalizado(): boolean {
    return this.servicioSeleccionado?.id_servicio === 6;
  }

  confirmarReserva() {
    // Validaciones
    if (!this.barberiaSeleccionada || !this.barberoSeleccionado || !this.servicioSeleccionado) {
      this.mostrarToast('Por favor complete todos los pasos', 'warning');
      return;
    }

    if (!this.fecha || !this.hora) {
      this.mostrarToast('Por favor seleccione fecha y hora', 'warning');
      return;
    }

    if (this.esServicioPersonalizado() && !this.descripcionPersonalizada.trim()) {
      this.mostrarToast('Por favor describa el servicio personalizado', 'warning');
      return;
    }

    // Validar horario de atención (10 AM - 6 PM)
    const [horaNum, minutos] = this.hora.split(':').map(Number);
    if (horaNum < 10 || horaNum >= 18) {
      this.mostrarToast('El horario de atención es de 10:00 AM a 6:00 PM', 'warning');
      return;
    }

    this.loading = true;

    // Construir fecha y hora de inicio
    const inicio = `${this.fecha}T${this.hora}:00`;
    
    // Calcular fin (agregar duración del servicio o 60 min por defecto)
    const duracionMin = this.servicioSeleccionado.duracion_min 
      ? parseInt(this.servicioSeleccionado.duracion_min) 
      : 60;
    const inicioDate = new Date(inicio);
    const finDate = new Date(inicioDate.getTime() + duracionMin * 60000);
    const fin = finDate.toISOString().slice(0, 19);

    const nuevaCita: CitaCreate = {
      id_cliente: this.currentUser!.id_profile,
      id_barbero: this.barberoSeleccionado.id_barbero,
      id_servicio: this.servicioSeleccionado.id_servicio,
      id_barberia: this.barberiaSeleccionada.id_barberias,
      inicio: inicio,
      fin: fin,
      notas: this.notas,
      servicio_personalizado: this.esServicioPersonalizado() ? this.descripcionPersonalizada : undefined
    };

    this.citaService.create(nuevaCita).subscribe({
      next: (cita) => {
        console.log('Cita creada:', cita);
        this.mostrarToast('¡Cita reservada exitosamente!', 'success');
        this.loading = false;
        
        // Navegar a mis citas sin recargar la página
        setTimeout(() => {
          this.router.navigate(['/mis-citas']);
        }, 1500);
      },
      error: (err) => {
        console.error('Error al crear cita:', err);
        this.mostrarToast('Error al crear la cita. Intente nuevamente.', 'danger');
        this.loading = false;
      }
    });
  }

  mostrarToast(mensaje: string, color: string = 'success') {
    this.toastMessage = mensaje;
    this.toastColor = color;
    this.showToast = true;
  }

}

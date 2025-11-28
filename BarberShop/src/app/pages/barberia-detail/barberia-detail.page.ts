import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { 
  IonContent, 
  IonCard, 
  IonCardContent, 
  IonCardHeader, 
  IonCardTitle, 
  IonButton, 
  IonItem, 
  IonLabel,
  IonList,
  IonBadge,
  IonIcon,
  IonInput,
  IonSpinner,
  IonToast,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonSegment,
  IonSegmentButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  personOutline, 
  createOutline,
  closeOutline,
  checkmarkOutline,
  locationOutline,
  callOutline,
  timeOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  arrowBack, 
  calendarOutline, 
  peopleOutline, 
  pricetagOutline, 
  informationCircleOutline, 
  starOutline, 
  chevronBackOutline,
  star
} from 'ionicons/icons';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { AuthService, AuthUser } from '../../services/auth.service';
import { CitaService, Barberia, Barbero, Cita } from '../../services/cita.service';

interface BarberiaDetalle extends Barberia {
  barberos: BarberoConDisponibilidad[];
  citas: CitaDetalle[];
}

interface BarberoConDisponibilidad extends Barbero {
  disponible: boolean;
  proximaCita?: string;
}

interface CitaDetalle extends Cita {
  nombre_cliente?: string;
  nombre_barbero?: string;
}

@Component({
  selector: 'app-barberia-detail',
  templateUrl: './barberia-detail.page.html',
  styleUrls: ['./barberia-detail.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    IonButton, IonItem, IonLabel, IonList, IonBadge, IonIcon,
    IonInput, IonSpinner, IonToast, IonModal, IonHeader, IonToolbar, 
    IonTitle, IonButtons, IonSegment, IonSegmentButton,
    CommonModule, FormsModule, NavbarComponent
  ]
})
export class BarberiDetailPage implements OnInit {

  // Control
  loading: boolean = true;
  showToast: boolean = false;
  toastMessage: string = '';
  toastColor: string = 'success';

  // Usuario actual
  currentUser: AuthUser | null = null;

  // Datos de barbería
  barberia: BarberiaDetalle | null = null;
  barberiaId: number = 0;

  // Control de vista
  activeTab: 'citas' | 'barberos' | 'precios' = 'citas';

  // Modales
  showPrecioModal = false;
  selectedServicioId: number | null = null;
  selectedPrecio: number = 0;

  // Datos estaticos de servicios (como fue antes)
  servicios = [
    { id: 1, nombre: 'Corte Clásico', precio: 15000 },
    { id: 2, nombre: 'Fade Moderno', precio: 18000 },
    { id: 3, nombre: 'Corte + Barba', precio: 25000 },
    { id: 4, nombre: 'Arreglo de Barba', precio: 12000 },
    { id: 5, nombre: 'Corte Infantil', precio: 10000 },
    { id: 6, nombre: 'Paquete Premium', precio: 35000 }
  ];

  // Almacenamiento local de precios editados
  preciosEditados: { [key: number]: number } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private citaService: CitaService
  ) {
    addIcons({chevronBackOutline,informationCircleOutline,locationOutline,callOutline,calendarOutline,peopleOutline,pricetagOutline,timeOutline,starOutline,star,createOutline,closeOutline,checkmarkOutline,personOutline,checkmarkCircleOutline,closeCircleOutline,arrowBack});
  }

  ngOnInit() {
    // Verificar usuario y permisos
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (!user) {
        // No autenticado: ir a login
        this.router.navigate(['/login']);
        return;
      }

      // Verificar si es usuario de barbería (role_code === 'barberia')
      // Nota: Si el usuario tiene role_code diferente a 'barberia', puede ver pero no editar
      // Comentado por ahora para permitir que admin y otros vean también
      
      // Obtener ID de la barbería de los parámetros
      this.route.params.subscribe(params => {
        this.barberiaId = parseInt(params['id']);
        this.cargarBarberia();
      });

      // Cargar precios guardados localmente
      this.cargarPreciosLocales();
    });
  }

  cargarBarberia() {
    this.loading = true;
    this.citaService.getBarberias().subscribe({
      next: (barberias) => {
        const barberia = barberias.find(b => b.id_barberias === this.barberiaId);
        if (barberia) {
          this.construirDetalleBarberia(barberia);
        } else {
          this.mostrarToast('Barbería no encontrada', 'danger');
          this.router.navigate(['/services']);
        }
      },
      error: (error) => {
        console.error('Error cargando barberías:', error);
        this.mostrarToast('Error al cargar barbería', 'danger');
        this.loading = false;
      }
    });
  }

  construirDetalleBarberia(barberia: Barberia) {
    // Cargar barberos y citas
    this.citaService.getBarberosPorBarberia(barberia.id_barberias).subscribe({
      next: (barberos) => {
        // Crear datos estaticos con disponibilidad
        const barberosConDisponibilidad: BarberoConDisponibilidad[] = barberos.map((b, index) => ({
          ...b,
          disponible: index % 2 === 0, // Alternando disponibilidad (estático)
          proximaCita: index % 2 === 0 ? undefined : `Hoy a las ${10 + index}:00`
        }));

        // Crear citas simuladas para demostración
        const citasSimuladas: CitaDetalle[] = [
          {
            id_cita: 1,
            id_cliente: 1,
            id_barbero: barberos[0]?.id_barbero || 1,
            id_servicio: 1,
            id_barberia: barberia.id_barberias,
            inicio: new Date(new Date().getTime() + 3600000).toISOString(),
            fin: new Date(new Date().getTime() + 5400000).toISOString(),
            notas: 'Corte clásico',
            nombre_cliente: 'Juan Pérez',
            nombre_barbero: barberos[0]?.nombre_barbero || 'Barbero'
          },
          {
            id_cita: 2,
            id_cliente: 2,
            id_barbero: barberos[1]?.id_barbero || 2,
            id_servicio: 3,
            id_barberia: barberia.id_barberias,
            inicio: new Date(new Date().getTime() + 7200000).toISOString(),
            fin: new Date(new Date().getTime() + 10800000).toISOString(),
            notas: 'Corte + Barba',
            nombre_cliente: 'Carlos López',
            nombre_barbero: barberos[1]?.nombre_barbero || 'Barbero'
          }
        ];

        this.barberia = {
          ...barberia,
          barberos: barberosConDisponibilidad,
          citas: citasSimuladas
        };

        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error cargando barberos:', error);
        this.mostrarToast('Error al cargar barberos', 'danger');
        this.loading = false;
      }
    });
  }

  abrirModalPrecio(servicioId: number) {
    this.selectedServicioId = servicioId;
    const servicio = this.servicios.find(s => s.id === servicioId);
    this.selectedPrecio = this.preciosEditados[servicioId] || servicio?.precio || 0;
    this.showPrecioModal = true;
  }

  guardarPrecio() {
    if (this.selectedServicioId !== null) {
      this.preciosEditados[this.selectedServicioId] = this.selectedPrecio;
      this.guardarPreciosLocales();
      this.mostrarToast('Precio actualizado', 'success');
      this.showPrecioModal = false;
    }
  }

  obtenerPrecioServicio(servicioId: number): number {
    return this.preciosEditados[servicioId] || (this.servicios.find(s => s.id === servicioId)?.precio || 0);
  }

  guardarPreciosLocales() {
    localStorage.setItem(`precios_barberia_${this.barberiaId}`, JSON.stringify(this.preciosEditados));
  }

  cargarPreciosLocales() {
    const precioGuardados = localStorage.getItem(`precios_barberia_${this.barberiaId}`);
    if (precioGuardados) {
      this.preciosEditados = JSON.parse(precioGuardados);
    }
  }

  obtenerEstadoCita(cita: CitaDetalle): string {
    const ahora = new Date();
    const inicio = new Date(cita.inicio);
    
    if (inicio > ahora) {
      return 'pendiente';
    } else if (inicio.getTime() < ahora.getTime() && new Date(cita.fin) > ahora) {
      return 'en-curso';
    } else {
      return 'completada';
    }
  }

  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-MX', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatearPrecio(precio: number): string {
    return precio.toLocaleString('es-MX', { style: 'currency', currency: 'COP' });
  }

  mostrarToast(mensaje: string, color: string = 'success') {
    this.toastMessage = mensaje;
    this.toastColor = color;
    this.showToast = true;
  }

  volver() {
    this.router.navigate(['/services']);
  }

  segmentChanged(event: any) {
    this.activeTab = event.detail.value;
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonModal,
  IonList,
  IonBadge,
  IonFab,
  IonFabButton,
  IonToast,
  IonAlert
} from '@ionic/angular/standalone';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { UserService, Usuario } from 'src/app/services/user.service';
import { addIcons } from 'ionicons';
import { 
  addOutline, 
  createOutline, 
  trashOutline, 
  eyeOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  timeOutline,
  personOutline,
  calendarOutline,
  cutOutline, closeOutline } from 'ionicons/icons';

import { Servicio, Cita } from '../../models/interfaces';

// Interfaces basadas en las tablas de BD
export interface ServicioCustom extends Servicio {
  id_barbero: number;
  precio_BarbServ: number;
  duracion_min: string;
  categoria: string;
  // Campos de compatibilidad (deprecated)
  id?: string;
  nombre?: string;
  descripcion?: string;
  precio?: number;
  duracion?: string;
  barberoId?: string;
  activo?: boolean;
  fechaCreacion?: Date;
}

export interface CitaPendiente extends Cita {
  // Campos de joins para display
  nombre_cliente: string;
  email_cliente: string;
  telefono_cliente: string;
  nombre_servicio: string;
  // Campos de compatibilidad (deprecated)
  id?: string;
  clienteNombre?: string;
  clienteEmail?: string;
  clienteTelefono?: string;
  servicio?: string;
  fecha?: string;
  hora?: string;
  fechaSolicitud?: Date;
}

@Component({
  selector: 'app-custom-services',
  templateUrl: './custom-services.page.html',
  styleUrls: ['./custom-services.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, 
    CommonModule, FormsModule, NavbarComponent,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonButton, IonIcon, IonGrid, IonRow, IonCol,
    IonItem, IonLabel, IonInput, IonTextarea,
    IonSelect, IonSelectOption, IonModal,
    IonBadge, IonFab, IonFabButton, IonToast
  ]
})
export class CustomServicesPage implements OnInit {

  currentUser: Usuario | null = null;
  activeTab: 'dashboard' | 'servicios' | 'citas' = 'dashboard';
  
  // Servicios del barbero
  misServicios: ServicioCustom[] = [];
  
  // Citas pendientes
  citasPendientes: CitaPendiente[] = [];
  
  // Modal para crear/editar servicio
  isModalOpen = false;
  editingService: ServicioCustom | null = null;
  
  // Formulario de servicio
  nuevoServicio: Partial<ServicioCustom> = {
    nombre_servicio: '',
    description: '',
    precio_BarbServ: 0,
    duracion_min: '',
    categoria: 'Corte',
    // Campos de compatibilidad
    nombre: '',
    descripcion: '',
    precio: 0,
    duracion: ''
  };
  
  // Categorías disponibles
  categorias = ['Corte', 'Barba', 'Peinado', 'Tratamiento', 'Combo'];
  
  // Toast y alerts
  showToast = false;
  toastMessage = '';
  showAlert = false;
  alertMessage = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    addIcons({cutOutline,calendarOutline,checkmarkCircleOutline,addOutline,timeOutline,createOutline,trashOutline,personOutline,closeCircleOutline,closeOutline,eyeOutline});
  }

  ngOnInit() {
    // Verificar que el usuario sea barbero
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user?.tipo !== 'barbero') {
        this.router.navigate(['/']);
        return;
      }
      this.loadBarberoData();
    });

    // Manejar query parameters para cambiar de tab
    this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        this.activeTab = params['tab'];
      }
    });
  }

  get isBarbero(): boolean {
    return this.currentUser?.tipo === 'barbero';
  }

  get serviciosActivos(): number {
    return this.misServicios.filter(s => s.activo).length;
  }

  get citasPendientesCount(): number {
    return this.citasPendientes.filter(c => c.estado === 'pendiente').length;
  }

  get firstName(): string {
    if (!this.currentUser?.nombre) {
      return 'Barbero';
    }
    return this.currentUser.nombre.split(' ')[0] || 'Barbero';
  }

  get citasAceptadasCount(): number {
    return this.citasPendientes.filter(c => c.estado === 'aceptada').length;
  }

  get citasCompletadasCount(): number {
    return this.citasPendientes.filter(c => c.estado === 'completada').length;
  }

  loadBarberoData() {
    // Cargar servicios del barbero
    this.loadMisServicios();
    // Cargar citas pendientes
    this.loadCitasPendientes();
  }

  loadMisServicios() {
    // Simular servicios del barbero (aquí conectarías con tu API)
    this.misServicios = [
      {
        id_servicio: 1,
        nombre_servicio: 'Corte Clásico Premium',
        description: 'Corte tradicional con acabado profesional',
        servicio_active: true,
        created_at: new Date().toISOString(),
        id_barbero: 1,
        precio_BarbServ: 25000,
        duracion_min: '45',
        categoria: 'Corte',
        // Campos de compatibilidad
        id: '1',
        nombre: 'Corte Clásico Premium',
        descripcion: 'Corte tradicional con acabado profesional',
        precio: 25000,
        duracion: '45 min',
        barberoId: this.currentUser?.id || '',
        activo: true,
        fechaCreacion: new Date()
      },
      {
        id_servicio: 2,
        nombre_servicio: 'Barba y Bigote',
        description: 'Arreglo completo de barba con aceites premium',
        servicio_active: true,
        created_at: new Date().toISOString(),
        id_barbero: 1,
        precio_BarbServ: 18000,
        duracion_min: '30',
        categoria: 'Barba',
        // Campos de compatibilidad
        id: '2',
        nombre: 'Barba y Bigote',
        descripcion: 'Arreglo completo de barba con aceites premium',
        precio: 18000,
        duracion: '30 min',
        barberoId: this.currentUser?.id || '',
        activo: true,
        fechaCreacion: new Date()
      }
    ];
  }

  loadCitasPendientes() {
    // Simular citas pendientes (aquí conectarías con tu API)
    this.citasPendientes = [
      {
        id_cita: 1,
        id_cliente: 1,
        id_barbero: 1,
        id_servicio: 1,
        id_barberia: 1,
        inicio: '2025-10-15T10:00:00',
        fin: '2025-10-15T10:45:00',
        estado: 'pendiente',
        notas: 'Prefiere corte no tan corto',
        creada_por: 1,
        created_at: new Date().toISOString(),
        nombre_cliente: 'Juan Pérez',
        email_cliente: 'juan@email.com',
        telefono_cliente: '+56 9 1234 5678',
        nombre_servicio: 'Corte Clásico Premium',
        // Campos de compatibilidad
        id: '1',
        clienteNombre: 'Juan Pérez',
        clienteEmail: 'juan@email.com',
        clienteTelefono: '+56 9 1234 5678',
        servicio: 'Corte Clásico Premium',
        fecha: '2025-10-15',
        hora: '10:00',
        fechaSolicitud: new Date()
      },
      {
        id_cita: 2,
        id_cliente: 2,
        id_barbero: 1,
        id_servicio: 2,
        id_barberia: 1,
        inicio: '2025-10-15T14:30:00',
        fin: '2025-10-15T15:00:00',
        estado: 'pendiente',
        notas: '',
        creada_por: 2,
        created_at: new Date().toISOString(),
        nombre_cliente: 'Carlos Silva',
        email_cliente: 'carlos@email.com',
        telefono_cliente: '+56 9 8765 4321',
        nombre_servicio: 'Barba y Bigote',
        // Campos de compatibilidad
        id: '2',
        clienteNombre: 'Carlos Silva',
        clienteEmail: 'carlos@email.com',
        clienteTelefono: '+56 9 8765 4321',
        servicio: 'Barba y Bigote',
        fecha: '2025-10-15',
        hora: '14:30',
        fechaSolicitud: new Date()
      }
    ];
  }

  // Métodos para gestión de servicios
  openServiceModal(service?: ServicioCustom) {
    if (service) {
      this.editingService = service;
      this.nuevoServicio = { ...service };
    } else {
      this.editingService = null;
      this.nuevoServicio = {
        nombre_servicio: '',
        description: '',
        precio_BarbServ: 0,
        duracion_min: '',
        categoria: 'Corte',
        // Campos de compatibilidad
        nombre: '',
        descripcion: '',
        precio: 0,
        duracion: ''
      };
    }
    this.isModalOpen = true;
  }

  closeServiceModal() {
    this.isModalOpen = false;
    this.editingService = null;
  }

  saveService() {
    if (!this.nuevoServicio.nombre || !this.nuevoServicio.descripcion || !this.nuevoServicio.precio) {
      this.showToastMessage('Por favor completa todos los campos obligatorios');
      return;
    }

    if (this.editingService) {
      // Editar servicio existente
      const index = this.misServicios.findIndex(s => s.id === this.editingService!.id);
      if (index !== -1) {
        this.misServicios[index] = {
          ...this.editingService,
          ...this.nuevoServicio
        } as ServicioCustom;
      }
      this.showToastMessage('Servicio actualizado exitosamente');
    } else {
      // Crear nuevo servicio
      const newService: ServicioCustom = {
        id: Date.now().toString(),
        ...this.nuevoServicio,
        barberoId: this.currentUser?.id || '',
        activo: true,
        fechaCreacion: new Date()
      } as ServicioCustom;
      
      this.misServicios.push(newService);
      this.showToastMessage('Servicio creado exitosamente');
    }

    this.closeServiceModal();
  }

  deleteService(serviceId: string) {
    this.misServicios = this.misServicios.filter(s => s.id !== serviceId);
    this.showToastMessage('Servicio eliminado');
  }

  toggleServiceStatus(service: ServicioCustom) {
    service.activo = !service.activo;
    this.showToastMessage(`Servicio ${service.activo ? 'activado' : 'desactivado'}`);
  }

  // Métodos para gestión de citas
  aceptarCita(cita: CitaPendiente) {
    cita.estado = 'aceptada';
    this.showToastMessage(`Cita de ${cita.clienteNombre} aceptada`);
  }

  rechazarCita(cita: CitaPendiente) {
    cita.estado = 'rechazada';
    this.showToastMessage(`Cita de ${cita.clienteNombre} rechazada`);
  }

  completarCita(cita: CitaPendiente) {
    cita.estado = 'completada';
    this.showToastMessage(`Cita de ${cita.clienteNombre} marcada como completada`);
  }

  // Métodos de utilidad
  formatPrice(price: number): string {
    return price.toLocaleString('es-CL');
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-CL');
  }

  getEstadoBadgeColor(estado: string): string {
    switch (estado) {
      case 'pendiente': return 'warning';
      case 'aceptada': return 'success';
      case 'rechazada': return 'danger';
      case 'completada': return 'medium';
      default: return 'primary';
    }
  }

  showToastMessage(message: string) {
    this.toastMessage = message;
    this.showToast = true;
  }

  setActiveTab(tab: 'dashboard' | 'servicios' | 'citas') {
    this.activeTab = tab;
    // Actualizar URL sin recargar la página
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tab === 'dashboard' ? null : tab },
      queryParamsHandling: 'merge'
    });
  }

  // Métodos de navegación rápida
  goToDashboard() {
    this.setActiveTab('dashboard');
  }

  goToServicios() {
    this.setActiveTab('servicios');
  }

  goToCitas() {
    this.setActiveTab('citas');
  }
}


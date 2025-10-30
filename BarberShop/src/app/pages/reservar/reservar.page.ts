import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { 
  IonContent, 
  IonCard, 
  IonCardContent, 
  IonCardHeader, 
  IonCardTitle, 
  IonButton, 
  IonInput, 
  IonTextarea, 
  IonSelect, 
  IonSelectOption,
  IonItem,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonProgressBar,
  IonIcon,
  IonToast,
  IonSpinner,
  IonBadge
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
  arrowForward, personAddOutline, checkmarkCircleOutline, 
  star, searchOutline, closeCircleOutline } from 'ionicons/icons';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { UserService, Usuario } from '../../services/user.service';
import { Servicio, Barbero, ServicioConPrecio, BarberoConBarberia } from '../../models/interfaces';

interface FormDataCita {
  nombre: string;
  telefono: string;
  email: string;
  id_servicio: number;
  id_barbero: number;
  fecha: string;
  hora: string;
  notas: string;
  // Campos de compatibilidad
  servicio?: string;
  barbero?: string;
}

@Component({
  selector: 'app-reservar',
  templateUrl: './reservar.page.html',
  styleUrls: ['./reservar.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonCard, IonCardContent, IonCardHeader, IonCardTitle, 
    IonButton, IonInput, IonTextarea, IonSelect, IonSelectOption, IonItem, 
    IonLabel, IonGrid, IonRow, IonCol, IonIcon, IonToast,
    IonSpinner, CommonModule, FormsModule, NavbarComponent
  ]
})
export class ReservarPage implements OnInit {

  step: number = 1;
  loading: boolean = false;
  showToast: boolean = false;
  toastMessage: string = '';
  searchTerm: string = ''; // Nueva propiedad para el buscador
  // Estado de autenticación
  currentUser: Usuario | null = null;
  showGuestForm = false;

  // Getter para verificar si el usuario está logueado
  get isUserLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  formData: FormDataCita = {
    nombre: "",
    telefono: "",
    email: "",
    id_servicio: 0,
    id_barbero: 0,
    fecha: "",
    hora: "",
    notas: "",
    // Campos de compatibilidad
    servicio: "",
    barbero: ""
  };

  servicios: ServicioConPrecio[] = [
    { 
      id_servicio: 1, 
      nombre_servicio: "Corte Clásico", 
      description: "Corte tradicional con tijeras y máquina", 
      servicio_active: true, 
      created_at: new Date().toISOString(),
      precio_BarbServ: 15000, 
      duracion_min: "30"
    },
    { 
      id_servicio: 2, 
      nombre_servicio: "Fade Moderno", 
      description: "Degradado moderno con técnicas actuales", 
      servicio_active: true, 
      created_at: new Date().toISOString(),
      precio_BarbServ: 18000, 
      duracion_min: "45"
    },
    { 
      id_servicio: 3, 
      nombre_servicio: "Corte + Barba", 
      description: "Servicio completo de corte y arreglo de barba", 
      servicio_active: true, 
      created_at: new Date().toISOString(),
      precio_BarbServ: 25000, 
      duracion_min: "60"
    },
    { 
      id_servicio: 4, 
      nombre_servicio: "Arreglo de Barba", 
      description: "Perfilado y mantenimiento de barba", 
      servicio_active: true, 
      created_at: new Date().toISOString(),
      precio_BarbServ: 12000, 
      duracion_min: "20"
    },
    { 
      id_servicio: 5, 
      nombre_servicio: "Corte Infantil", 
      description: "Corte especializado para niños", 
      servicio_active: true, 
      created_at: new Date().toISOString(),
      precio_BarbServ: 10000, 
      duracion_min: "25"
    },
    { 
      id_servicio: 6, 
      nombre_servicio: "Paquete Premium", 
      description: "Corte + barba + shampoo + masaje", 
      servicio_active: true, 
      created_at: new Date().toISOString(),
      precio_BarbServ: 35000, 
      duracion_min: "90"
    }
  ];

  barberos: BarberoConBarberia[] = [
    // Especialistas en Fade y Degradados
    { 
      id_barbero: 1, 
      id_barberia: 1, 
      nombre_barbero: "Carlos Mendoza", 
      especialidades: "Fade y Degradados", 
      anios_experiencia: 8, 
      calificacion: 4.9, 
      foto_url: "https://example.com/carlos.jpg", 
      created_at: new Date().toISOString(),
      nombre_barberia: "Premium Cuts", 
      direccion: "Av. Principal 123"
    },
    { 
      id_barbero: 2, 
      id_barberia: 1, 
      nombre_barbero: "Alexis Vargas", 
      especialidades: "Fade y Degradados", 
      anios_experiencia: 5, 
      calificacion: 4.7, 
      foto_url: "https://example.com/alexis.jpg", 
      created_at: new Date().toISOString(),
      nombre_barberia: "Premium Cuts", 
      direccion: "Av. Principal 123"
    },
    { 
      id_barbero: 3, 
      id_barberia: 2, 
      nombre_barbero: "Samuel Herrera", 
      especialidades: "Fade y Degradados", 
      anios_experiencia: 7, 
      calificacion: 4.8, 
      foto_url: "https://example.com/samuel.jpg", 
      created_at: new Date().toISOString(),
      nombre_barberia: "Barbería Central", 
      direccion: "Calle Central 456"
    },
    
    // Especialistas en Cortes Clásicos
    { 
      id_barbero: 4, 
      id_barberia: 1, 
      nombre_barbero: "Miguel Torres", 
      especialidades: "Cortes Clásicos", 
      anios_experiencia: 12, 
      calificacion: 4.8, 
      foto_url: "https://example.com/miguel.jpg", 
      created_at: new Date().toISOString(),
      nombre_barberia: "Premium Cuts", 
      direccion: "Av. Principal 123"
    },
    { 
      id_barbero: 5, 
      id_barberia: 2, 
      nombre_barbero: "Eduardo Morales", 
      especialidades: "Cortes Clásicos", 
      anios_experiencia: 20, 
      calificacion: 4.9, 
      foto_url: "https://example.com/eduardo.jpg", 
      created_at: new Date().toISOString(),
      nombre_barberia: "Barbería Central", 
      direccion: "Calle Central 456"
    },
    { 
      id_barbero: 6, 
      id_barberia: 3, 
      nombre_barbero: "Pablo Jiménez", 
      especialidades: "Cortes Clásicos", 
      anios_experiencia: 14, 
      calificacion: 4.7, 
      foto_url: "https://example.com/pablo.jpg", 
      created_at: new Date().toISOString(),
      nombre_barberia: "Barber & Co", 
      direccion: "Plaza Mayor 789"
    }
  ];

  horariosDisponibles: string[] = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"
  ];

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private userService: UserService
  ) {
    addIcons({checkmarkCircle,timeOutline,arrowForward,searchOutline,closeCircleOutline,star,arrowBack,personOutline,personAddOutline,checkmarkCircleOutline,starOutline,calendarOutline,cutOutline});
  }

  ngOnInit() {
    // Verificar si hay usuario logueado
    this.currentUser = this.userService.getCurrentUser();
    
    // Si hay usuario logueado, pre-llenar los campos
    if (this.currentUser) {
      this.formData.nombre = this.currentUser.full_name || this.currentUser.nombre || '';
      this.formData.email = this.currentUser.email;
      this.formData.telefono = this.currentUser.phone || this.currentUser.telefono || '';
    }
    
    // Capturar parámetro de servicio desde la URL
    this.route.queryParams.subscribe(params => {
      if (params['servicio']) {
        this.formData.servicio = params['servicio'];
        this.step = 2; // Saltar directamente al paso 2
      }
      
      // Si viene desde login/registro, restaurar estado de reserva
      if (params['return_from_login'] || params['return_from_register']) {
        this.restoreReservationState();
      }
    });
  }

  restoreReservationState() {
    const reservaPendiente = localStorage.getItem('reserva_pendiente');
    if (reservaPendiente) {
      try {
        const savedData = JSON.parse(reservaPendiente);
        this.formData = { ...this.formData, ...savedData.formData };
        this.step = savedData.step || 3; // Ir al paso 3 por defecto
        
        // Actualizar datos del usuario si ahora está logueado
        if (this.currentUser) {
          this.formData.nombre = this.currentUser.full_name || this.currentUser.nombre || '';
          this.formData.email = this.currentUser.email;
          this.formData.telefono = this.currentUser.phone || this.currentUser.telefono || '';
        }
        
        localStorage.removeItem('reserva_pendiente');
      } catch (error) {
        console.error('Error al restaurar estado de reserva:', error);
      }
    }
  }

  // Métodos de autenticación para el paso 3
  goToLogin() {
    // Guardar el estado actual de la reserva
    this.saveReservationState();
    // Navegar a login
    this.router.navigate(['/login']);
  }

  goToRegister() {
    // Guardar el estado actual de la reserva
    this.saveReservationState();
    // Navegar a registro
    this.router.navigate(['/register']);
  }

  continueAsGuest() {
    // Mostrar el formulario sin requerir login
    this.showGuestForm = true;
  }

  saveReservationState() {
    const reservaData = {
      formData: this.formData,
      step: this.step
    };
    localStorage.setItem('reserva_pendiente', JSON.stringify(reservaData));
  }

  handleNextStep() {
    if (this.step < 3) this.step++;
  }

  handlePrevStep() {
    if (this.step > 1) this.step--;
  }

  goToStep1() {
    this.step = 1;
  }

  changeService() {
    this.formData.servicio = '';
    this.formData.barbero = ''; // Limpiar también el barbero
    this.step = 1;
  }

  selectServicio(servicioId: string) {
    this.formData.servicio = servicioId;
    
    // Verificar si el barbero actual sigue siendo válido para el nuevo servicio
    const barberosDisponibles = this.getFilteredBarberos();
    const barberoActual = this.formData.barbero;
    
    if (barberoActual && !barberosDisponibles.find(b => b.id_barbero.toString() === barberoActual)) {
      // Si el barbero actual no está disponible para el nuevo servicio, limpiar la selección
      this.formData.barbero = '';
    }
  }

  selectBarbero(barberoId: string) {
    this.formData.barbero = barberoId;
  }

  getFilteredBarberos(): Barbero[] {
    if (!this.formData.servicio) {
      return this.barberos;
    }

    // Mapeo de servicios a especialidades de barberos (por ID)
    const servicioToEspecialidades: { [key: string]: string[] } = {
      '1': ['Cortes Clásicos', 'Cortes Modernos'], // Corte Clásico
      '2': ['Fade y Degradados', 'Cortes Modernos'], // Fade Moderno
      '3': ['Barba y Bigote', 'Cortes Clásicos', 'Servicios Premium'], // Corte + Barba
      '4': ['Barba y Bigote', 'Servicios Premium'], // Arreglo de Barba
      '5': ['Cortes Infantiles', 'Cortes Clásicos'], // Corte Infantil
      '6': ['Servicios Premium', 'Barba y Bigote', 'Cortes Clásicos'] // Paquete Premium
    };

    const servicioId = this.formData.servicio || this.formData.id_servicio?.toString();
    const especialidadesPermitidas = servicioToEspecialidades[servicioId || ''] || [];
    
    return this.barberos.filter(barbero => 
      especialidadesPermitidas.includes(barbero.especialidades)
    );
  }

  // Nuevos métodos para el buscador
  getDisplayedBarberos(): Barbero[] {
    const filteredBarberos = this.getFilteredBarberos();
    
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      return filteredBarberos;
    }

    const searchTermLower = this.searchTerm.toLowerCase().trim();
    
    return filteredBarberos.filter(barbero => {
      // Buscar en nombre
      const matchesName = barbero.nombre_barbero.toLowerCase().includes(searchTermLower);
      
      // Buscar en especialidad
      const matchesSpecialty = barbero.especialidades.toLowerCase().includes(searchTermLower);
      
      // Buscar en experiencia (años de experiencia)
      const matchesExperience = barbero.anios_experiencia.toString().includes(searchTermLower);
      
      // Buscar en calificación
      const matchesRating = barbero.calificacion.toString().includes(searchTermLower);
      
      return matchesName || matchesSpecialty || matchesExperience || matchesRating;
    });
  }

  onSearchTermChange() {
    // Este método se puede usar para agregar funcionalidad adicional cuando cambie el término de búsqueda
    // Por ejemplo, analytics o debouncing
  }

  clearSearch() {
    this.searchTerm = '';
  }

  getCurrentDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  getSelectedServicio(): ServicioConPrecio | undefined {
    const servicioId = this.formData.servicio || this.formData.id_servicio?.toString();
    return this.servicios.find(s => s.id_servicio.toString() === servicioId);
  }

  getSelectedBarbero(): BarberoConBarberia | undefined {
    const barberoId = this.formData.barbero || this.formData.id_barbero?.toString();
    return this.barberos.find(b => b.id_barbero.toString() === barberoId);
  }

  formatPrice(price: number): string {
    return price.toLocaleString();
  }

  canContinueStep1(): boolean {
    return !!this.formData.servicio;
  }

  canContinueStep2(): boolean {
    return !!(this.formData.barbero && this.formData.fecha && this.formData.hora);
  }

  canSubmit(): boolean {
    return !!(this.formData.nombre && this.formData.telefono && this.formData.email);
  }

  async handleSubmit() {
    if (!this.canSubmit()) return;
    
    this.loading = true;
    
    // Simular llamada API
    setTimeout(() => {
      this.loading = false;
      this.toastMessage = `¡Cita reservada exitosamente! Tu cita está confirmada para el ${this.formData.fecha} a las ${this.formData.hora}`;
      this.showToast = true;
      
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 2000);
    }, 1500);
  }

  getStepTitle(): string {
    switch(this.step) {
      case 1: return "Selecciona tu Servicio";
      case 2: return "Elige Barbero y Horario";
      case 3: return "Confirma tus Datos";
      default: return "";
    }
  }

  getStepDescription(): string {
    switch(this.step) {
      case 1: return "Elige el servicio que más te convenga";
      case 2: return "Selecciona tu barbero preferido y horario";
      case 3: return "Revisa y confirma tu reserva";
      default: return "";
    }
  }
}

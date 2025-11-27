// ========================================
// EJEMPLO: reservar.page.ts CON API DEL BACKEND
// ========================================
// Este archivo muestra cómo reemplazar los datos mock con llamadas a la API
// Copia y adapta las secciones que necesites

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { 
  IonContent, IonCard, IonCardContent, IonCardHeader, IonCardTitle, 
  IonButton, IonInput, IonTextarea, IonSelect, IonSelectOption, IonItem, 
  IonLabel, IonGrid, IonRow, IonCol, IonIcon, IonToast,
  IonSpinner, CommonModule, FormsModule, NavbarComponent
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  calendarOutline, timeOutline, cutOutline, personOutline, starOutline,
  checkmarkCircle, arrowBack, arrowForward, personAddOutline, 
  checkmarkCircleOutline, star, searchOutline, closeCircleOutline 
} from 'ionicons/icons';

// ✅ IMPORTAR LOS SERVICIOS DEL BACKEND
import { ServicioService, ServicioConPrecio } from '../../services/servicio.service';
import { BarberoService, Barbero } from '../../services/barbero.service';
import { BarberiaService, Disponibilidad } from '../../services/barberia.service';
import { CitaService, CitaCreate } from '../../services/cita.service';
import { UserService, Usuario } from '../../services/user.service';

interface FormDataCita {
  nombre: string;
  telefono: string;
  email: string;
  id_servicio: number;
  id_barbero: number;
  fecha: string;
  hora: string;
  notas: string;
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
    IonSpinner, CommonModule, FormsModule
  ]
})
export class ReservarPage implements OnInit {

  step: number = 1;
  loading: boolean = false;
  loadingServicios: boolean = false;
  loadingBarberos: boolean = false;
  loadingHorarios: boolean = false;
  showToast: boolean = false;
  toastMessage: string = '';
  searchTerm: string = '';
  currentUser: Usuario | null = null;
  showGuestForm = false;
  barberiaId = 1; // ⚠️ Obtener del contexto o selección del usuario

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
    notas: ""
  };

  // ✅ DATOS AHORA SE CARGAN DESDE LA API
  servicios: ServicioConPrecio[] = [];
  barberos: Barbero[] = [];
  horariosDisponibles: string[] = [];

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private userService: UserService,
    // ✅ INYECTAR LOS SERVICIOS
    private servicioService: ServicioService,
    private barberoService: BarberoService,
    private barberiaService: BarberiaService,
    private citaService: CitaService
  ) {
    addIcons({
      checkmarkCircle, timeOutline, arrowForward, searchOutline, closeCircleOutline,
      star, arrowBack, personOutline, personAddOutline, checkmarkCircleOutline,
      starOutline, calendarOutline, cutOutline
    });
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
    
    // ✅ CARGAR SERVICIOS DESDE LA API
    this.loadServicios();
    
    // Capturar parámetros de la URL
    this.route.queryParams.subscribe(params => {
      if (params['servicio']) {
        this.formData.id_servicio = parseInt(params['servicio']);
        this.step = 2;
        this.loadBarberos(); // Cargar barberos cuando hay servicio seleccionado
      }
      
      if (params['return_from_login'] || params['return_from_register']) {
        this.restoreReservationState();
      }
    });
  }

  // ========================================
  // ✅ MÉTODO 1: CARGAR SERVICIOS DESDE API
  // ========================================
  loadServicios() {
    this.loadingServicios = true;
    
    // Opción A: Obtener servicios de una barbería específica CON PRECIOS
    this.barberiaService.getServicios(this.barberiaId).subscribe({
      next: (data) => {
        this.servicios = data;
        this.loadingServicios = false;
        console.log('Servicios cargados:', data);
      },
      error: (error) => {
        console.error('Error al cargar servicios:', error);
        this.loadingServicios = false;
        this.showError('Error al cargar los servicios disponibles');
      }
    });

    /* 
    // Opción B: Obtener todos los servicios activos SIN PRECIOS
    this.servicioService.getActivos().subscribe({
      next: (data) => {
        this.servicios = data;
        this.loadingServicios = false;
      },
      error: (error) => {
        console.error('Error al cargar servicios:', error);
        this.loadingServicios = false;
        this.showError('Error al cargar los servicios');
      }
    });
    */
  }

  // ========================================
  // ✅ MÉTODO 2: CARGAR BARBEROS DESDE API
  // ========================================
  loadBarberos() {
    this.loadingBarberos = true;

    // Opción A: Obtener barberos de una barbería específica
    this.barberiaService.getBarberos(this.barberiaId).subscribe({
      next: (data) => {
        this.barberos = data;
        this.loadingBarberos = false;
        console.log('Barberos cargados:', data);
      },
      error: (error) => {
        console.error('Error al cargar barberos:', error);
        this.loadingBarberos = false;
        this.showError('Error al cargar los barberos disponibles');
      }
    });

    /* 
    // Opción B: Obtener todos los barberos
    this.barberoService.getAll().subscribe({
      next: (data) => {
        this.barberos = data;
        this.loadingBarberos = false;
      },
      error: (error) => {
        console.error('Error al cargar barberos:', error);
        this.loadingBarberos = false;
      }
    });
    */
  }

  // ========================================
  // ✅ MÉTODO 3: CARGAR HORARIOS DISPONIBLES
  // ========================================
  loadHorariosDisponibles() {
    if (!this.formData.fecha || !this.formData.id_servicio) {
      return;
    }

    this.loadingHorarios = true;
    
    this.barberiaService.getDisponibilidad(
      this.barberiaId,
      this.formData.fecha,
      this.formData.id_servicio
    ).subscribe({
      next: (data: Disponibilidad) => {
        // Convertir los slots disponibles a array de strings
        this.horariosDisponibles = data.slots_disponibles.map(slot => slot.hora_inicio);
        this.loadingHorarios = false;
        console.log('Horarios disponibles:', this.horariosDisponibles);
      },
      error: (error) => {
        console.error('Error al cargar horarios:', error);
        this.loadingHorarios = false;
        this.showError('Error al verificar disponibilidad de horarios');
      }
    });
  }

  // ========================================
  // ✅ MÉTODO 4: CREAR CITA EN EL BACKEND
  // ========================================
  async handleSubmit() {
    if (!this.canSubmit()) return;
    
    this.loading = true;
    
    // Calcular hora de fin basada en la duración del servicio
    const servicioSeleccionado = this.getSelectedServicio();
    const duracionMinutos = servicioSeleccionado?.duracion_min 
      ? parseInt(servicioSeleccionado.duracion_min) 
      : 30;
    
    const horaFin = this.calcularHoraFin(this.formData.hora, duracionMinutos);
    
    // Construir objeto de cita para enviar al backend
    const nuevaCita: CitaCreate = {
      id_cliente: this.currentUser?.id || 0, // ⚠️ Manejar caso de invitado
      id_barbero: this.formData.id_barbero,
      id_servicio: this.formData.id_servicio,
      id_barberia: this.barberiaId,
      inicio: `${this.formData.fecha}T${this.formData.hora}:00`,
      fin: `${this.formData.fecha}T${horaFin}:00`,
      notas: this.formData.notas || ''
    };

    console.log('Creando cita:', nuevaCita);

    // ✅ LLAMAR AL BACKEND PARA CREAR LA CITA
    this.citaService.create(nuevaCita).subscribe({
      next: (cita) => {
        this.loading = false;
        console.log('Cita creada exitosamente:', cita);
        
        // Mostrar mensaje de éxito
        this.toastMessage = `¡Cita reservada exitosamente! ID: ${cita.id_cita}`;
        this.showToast = true;
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/mis-citas']);
        }, 2000);
      },
      error: (error) => {
        this.loading = false;
        console.error('Error al crear cita:', error);
        
        // Mostrar mensaje de error específico
        let errorMessage = 'Error al crear la cita';
        if (error.status === 400) {
          errorMessage = error.error?.message || 'Datos inválidos';
        } else if (error.status === 409) {
          errorMessage = 'El horario ya no está disponible';
        }
        
        this.showError(errorMessage);
      }
    });
  }

  // ========================================
  // MÉTODOS DE NAVEGACIÓN Y SELECCIÓN
  // ========================================
  selectServicio(servicioId: number) {
    this.formData.id_servicio = servicioId;
    
    // Resetear barbero y horarios cuando cambie el servicio
    this.formData.id_barbero = 0;
    this.formData.hora = '';
    this.horariosDisponibles = [];
    
    // Cargar barberos para el nuevo servicio
    this.loadBarberos();
  }

  selectBarbero(barberoId: number) {
    this.formData.id_barbero = barberoId;
    
    // Resetear horario cuando cambie el barbero
    this.formData.hora = '';
    this.horariosDisponibles = [];
    
    // Si ya hay fecha seleccionada, cargar horarios
    if (this.formData.fecha) {
      this.loadHorariosDisponibles();
    }
  }

  onFechaChange() {
    // Resetear horario cuando cambie la fecha
    this.formData.hora = '';
    
    // Cargar nuevos horarios disponibles
    this.loadHorariosDisponibles();
  }

  handleNextStep() {
    if (this.step === 1 && this.canContinueStep1()) {
      this.step++;
      // Cargar barberos al pasar al paso 2
      this.loadBarberos();
    } else if (this.step === 2 && this.canContinueStep2()) {
      this.step++;
    }
  }

  handlePrevStep() {
    if (this.step > 1) this.step--;
  }

  goToStep1() {
    this.step = 1;
  }

  changeService() {
    this.formData.id_servicio = 0;
    this.formData.id_barbero = 0;
    this.formData.hora = '';
    this.horariosDisponibles = [];
    this.step = 1;
  }

  // ========================================
  // MÉTODOS AUXILIARES
  // ========================================
  calcularHoraFin(horaInicio: string, duracionMinutos: number): string {
    const [hora, minuto] = horaInicio.split(':').map(Number);
    const totalMinutos = hora * 60 + minuto + duracionMinutos;
    const nuevaHora = Math.floor(totalMinutos / 60);
    const nuevoMinuto = totalMinutos % 60;
    return `${nuevaHora.toString().padStart(2, '0')}:${nuevoMinuto.toString().padStart(2, '0')}`;
  }

  getSelectedServicio(): ServicioConPrecio | undefined {
    return this.servicios.find(s => s.id_servicio === this.formData.id_servicio);
  }

  getSelectedBarbero(): Barbero | undefined {
    return this.barberos.find(b => b.id_barbero === this.formData.id_barbero);
  }

  formatPrice(price: number): string {
    return price.toLocaleString();
  }

  getCurrentDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  canContinueStep1(): boolean {
    return this.formData.id_servicio > 0;
  }

  canContinueStep2(): boolean {
    return !!(this.formData.id_barbero && this.formData.fecha && this.formData.hora);
  }

  canSubmit(): boolean {
    return !!(this.formData.nombre && this.formData.telefono && this.formData.email);
  }

  showError(message: string) {
    this.toastMessage = message;
    this.showToast = true;
  }

  // ========================================
  // MÉTODOS DE AUTENTICACIÓN (SIN CAMBIOS)
  // ========================================
  goToLogin() {
    this.saveReservationState();
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.saveReservationState();
    this.router.navigate(['/register']);
  }

  continueAsGuest() {
    this.showGuestForm = true;
  }

  saveReservationState() {
    const reservaData = {
      formData: this.formData,
      step: this.step
    };
    localStorage.setItem('reserva_pendiente', JSON.stringify(reservaData));
  }

  restoreReservationState() {
    const reservaPendiente = localStorage.getItem('reserva_pendiente');
    if (reservaPendiente) {
      try {
        const savedData = JSON.parse(reservaPendiente);
        this.formData = { ...this.formData, ...savedData.formData };
        this.step = savedData.step || 3;
        
        if (this.currentUser) {
          this.formData.nombre = this.currentUser.full_name || this.currentUser.nombre || '';
          this.formData.email = this.currentUser.email;
          this.formData.telefono = this.currentUser.phone || this.currentUser.telefono || '';
        }
        
        // Recargar datos si es necesario
        if (this.formData.id_servicio > 0) {
          this.loadBarberos();
        }
        
        localStorage.removeItem('reserva_pendiente');
      } catch (error) {
        console.error('Error al restaurar estado de reserva:', error);
      }
    }
  }

  // ========================================
  // MÉTODOS DE BÚSQUEDA Y FILTRADO
  // ========================================
  getDisplayedBarberos(): Barbero[] {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      return this.barberos;
    }

    const searchTermLower = this.searchTerm.toLowerCase().trim();
    
    return this.barberos.filter(barbero => {
      const matchesName = barbero.nombre_barbero.toLowerCase().includes(searchTermLower);
      const matchesSpecialty = barbero.especialidades?.toLowerCase().includes(searchTermLower);
      const matchesExperience = barbero.anios_experiencia?.toString().includes(searchTermLower);
      const matchesRating = barbero.calificacion?.toString().includes(searchTermLower);
      
      return matchesName || matchesSpecialty || matchesExperience || matchesRating;
    });
  }

  clearSearch() {
    this.searchTerm = '';
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

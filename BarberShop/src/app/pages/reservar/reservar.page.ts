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
  arrowForward
} from 'ionicons/icons';
import { NavbarComponent } from '../../components/navbar/navbar.component';

interface Servicio {
  id: string;
  nombre: string;
  precio: number;
  duracion: string;
  descripcion: string;
}

interface Barbero {
  id: string;
  nombre: string;
  especialidad: string;
  experiencia: string;
  rating: number;
}

interface FormData {
  nombre: string;
  telefono: string;
  email: string;
  servicio: string;
  barbero: string;
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
    IonSpinner, CommonModule, FormsModule, NavbarComponent
  ]
})
export class ReservarPage implements OnInit {

  step: number = 1;
  loading: boolean = false;
  showToast: boolean = false;
  toastMessage: string = '';

  formData: FormData = {
    nombre: "",
    telefono: "",
    email: "",
    servicio: "",
    barbero: "",
    fecha: "",
    hora: "",
    notas: ""
  };

  servicios: Servicio[] = [
    { id: "corte-clasico", nombre: "Corte Clásico", precio: 15000, duracion: "30 min", descripcion: "Corte tradicional con tijeras y máquina" },
    { id: "fade-moderno", nombre: "Fade Moderno", precio: 18000, duracion: "45 min", descripcion: "Degradado moderno con técnicas actuales" },
    { id: "corte-barba", nombre: "Corte + Barba", precio: 25000, duracion: "60 min", descripcion: "Servicio completo de corte y arreglo de barba" },
    { id: "arreglo-barba", nombre: "Arreglo de Barba", precio: 12000, duracion: "20 min", descripcion: "Perfilado y mantenimiento de barba" },
    { id: "corte-infantil", nombre: "Corte Infantil", precio: 10000, duracion: "25 min", descripcion: "Corte especializado para niños" },
    { id: "paquete-premium", nombre: "Paquete Premium", precio: 35000, duracion: "90 min", descripcion: "Corte + barba + shampoo + masaje" }
  ];

  barberos: Barbero[] = [
    { id: "carlos", nombre: "Carlos Mendoza", especialidad: "Fade y Degradados", experiencia: "8 años", rating: 4.9 },
    { id: "miguel", nombre: "Miguel Torres", especialidad: "Cortes Clásicos", experiencia: "12 años", rating: 4.8 },
    { id: "ricardo", nombre: "Ricardo Silva", especialidad: "Barba y Bigote", experiencia: "10 años", rating: 4.9 },
    { id: "fernando", nombre: "Fernando López", especialidad: "Cortes Modernos", experiencia: "6 años", rating: 4.7 }
  ];

  horariosDisponibles: string[] = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"
  ];

  constructor(private router: Router, private route: ActivatedRoute) {
    addIcons({ 
      calendarOutline, 
      timeOutline, 
      cutOutline, 
      personOutline, 
      starOutline,
      checkmarkCircle,
      arrowBack,
      arrowForward
    });
  }

  ngOnInit() {
    // Capturar parámetro de servicio desde la URL
    this.route.queryParams.subscribe(params => {
      if (params['servicio']) {
        this.formData.servicio = params['servicio'];
        this.step = 2; // Saltar directamente al paso 2
      }
    });
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
    this.step = 1;
  }

  selectServicio(servicioId: string) {
    this.formData.servicio = servicioId;
  }

  selectBarbero(barberoId: string) {
    this.formData.barbero = barberoId;
  }

  getCurrentDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  getSelectedServicio(): Servicio | undefined {
    return this.servicios.find(s => s.id === this.formData.servicio);
  }

  getSelectedBarbero(): Barbero | undefined {
    return this.barberos.find(b => b.id === this.formData.barbero);
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

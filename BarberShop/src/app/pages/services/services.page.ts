import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonCard, 
  IonCardContent, 
  IonCardHeader, 
  IonCardTitle, 
  IonButton, 
  IonBadge,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonChip,
  IonSegment,
  IonSegmentButton
} from '@ionic/angular/standalone';
import { 
  timeOutline, 
  starOutline, 
  cutOutline, 
  ribbonOutline, 
  peopleOutline, 
  sparklesOutline,
  searchOutline,
  locationOutline,
  personOutline
} from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { UserService } from '../../services/user.service';
import { BarberiaService, Barberia } from '../../services/barberia.service';
import { ServicioConPrecio } from '../../models/interfaces';

interface Barbero {
  id_barbero: number;
  id_barberia: number;
  nombre_barbero: string;
  calificacion: number;
  foto_url?: string;
  especialidades?: string;
  anios_experiencia?: number;
  nombre_barberia?: string;
}

// Interface temporal para compatibilidad visual
interface ServicioDisplay extends ServicioConPrecio {
  caracteristicas: string[];
  popular: boolean;
  categoria: string;
}

interface Ventaja {
  icono: string;
  titulo: string;
  descripcion: string;
}

@Component({
  selector: 'app-services',
  templateUrl: './services.page.html',
  styleUrls: ['./services.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonCard, IonCardContent, 
    IonCardHeader, IonCardTitle, IonButton, IonBadge, IonIcon, IonGrid, 
    IonRow, IonCol, CommonModule, FormsModule, NavbarComponent,
    IonSearchbar,  IonLabel, IonChip
  ]
})
export class ServicesPage implements OnInit {

  // Propiedades de servicios (existentes)
  servicios: ServicioDisplay[] = [
    {
      id_servicio: 1,
      nombre_servicio: "Corte Clásico",
      description: "Corte tradicional con tijeras y máquina, perfecto para un look elegante y profesional.",
      servicio_active: true,
      created_at: new Date().toISOString(),
      precio_BarbServ: 15000,
      duracion_min: "30",
      caracteristicas: ["Lavado incluido", "Peinado final", "Acabado preciso"],
      popular: false,
      categoria: "Clásico"
    },
    {
      id_servicio: 2,
      nombre_servicio: "Fade Moderno",
      description: "Degradado moderno con técnicas actuales, ideal para un estilo contemporáneo y fresco.",
      servicio_active: true,
      created_at: new Date().toISOString(),
      precio_BarbServ: 18000,
      duracion_min: "45",
      caracteristicas: ["Degradado perfecto", "Diseño personalizado", "Técnicas modernas"],
      popular: true,
      categoria: "Moderno"
    },
    {
      id_servicio: 3,
      nombre_servicio: "Corte + Barba",
      description: "Servicio completo que combina corte de cabello y arreglo profesional de barba.",
      servicio_active: true,
      created_at: new Date().toISOString(),
      precio_BarbServ: 25000,
      duracion_min: "60",
      caracteristicas: ["Corte completo", "Perfilado de barba", "Aceites naturales", "Toalla caliente"],
      popular: true,
      categoria: "Completo"
    },
    {
      id_servicio: 4,
      nombre_servicio: "Arreglo de Barba",
      description: "Perfilado y mantenimiento especializado de barba con productos premium.",
      servicio_active: true,
      created_at: new Date().toISOString(),
      precio_BarbServ: 12000,
      duracion_min: "20",
      caracteristicas: ["Perfilado preciso", "Aceites aromáticos", "Cera de barba"],
      popular: false,
      categoria: "Barba"
    },
    {
      id_servicio: 5,
      nombre_servicio: "Corte Infantil",
      description: "Corte especializado para niños en ambiente cómodo y divertido.",
      servicio_active: true,
      created_at: new Date().toISOString(),
      precio_BarbServ: 10000,
      duracion_min: "25",
      caracteristicas: ["Ambiente amigable", "Paciencia especial", "Descuentos familiares"],
      popular: false,
      categoria: "Infantil"
    },
    {
      id_servicio: 6,
      nombre_servicio: "Paquete Premium",
      description: "Experiencia completa de barbería con todos nuestros servicios premium.",
      servicio_active: true,
      created_at: new Date().toISOString(),
      precio_BarbServ: 35000,
      duracion_min: "90",
      caracteristicas: ["Corte personalizado", "Arreglo de barba", "Shampoo premium", "Masaje relajante", "Productos exclusivos"],
      popular: true,
      categoria: "Premium"
    }
  ];

  ventajas: Ventaja[] = [
    {
      icono: "ribbon-outline",
      titulo: "Barberos Expertos",
      descripcion: "Más de 10 años de experiencia promedio"
    },
    {
      icono: "sparkles-outline",
      titulo: "Productos Premium",
      descripcion: "Utilizamos productos de las mejores marcas"
    },
    {
      icono: "people-outline",
      titulo: "Atención Personalizada",
      descripcion: "Cada cliente recibe un servicio único"
    },
    {
      icono: "star-outline",
      titulo: "Excelencia Garantizada",
      descripcion: "4.9/5 estrellas en satisfacción del cliente"
    }
  ];

  // Propiedades del buscador de barberos
  barberias: Barberia[] = [];
  barberosFiltrados: Barbero[] = [];
  todosLosBarberos: Barbero[] = [];
  barberiaSeleccionada: number | null = null;
  searchTerm: string = '';
  loading: boolean = true;
  activeTab: 'servicios' | 'barberos' = 'servicios';

  constructor(
    private router: Router,
    public userService: UserService,
    private barberiaService: BarberiaService,
    private http: HttpClient
  ) {
    addIcons({ 
      timeOutline, 
      starOutline, 
      cutOutline, 
      ribbonOutline, 
      peopleOutline, 
      sparklesOutline,
      searchOutline,
      locationOutline,
      personOutline
    });
  }

  ngOnInit() {
    this.loadBarberias();
    this.loadAllBarberos();
  }

  getCategoryColor(categoria: string): string {
    const colors: { [key: string]: string } = {
      "Clásico": "primary",
      "Moderno": "secondary", 
      "Completo": "tertiary",
      "Barba": "medium",
      "Infantil": "warning",
      "Premium": "success"
    };
    return colors[categoria] || "medium";
  }

  navigateToReservar(servicioId?: string) {
    if (servicioId) {
      this.router.navigate(['/reservar'], { queryParams: { servicio: servicioId } });
    } else {
      this.router.navigate(['/reservar']);
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  formatPrice(price: number): string {
    return price.toLocaleString();
  }

  get isLoggedIn(): boolean {
    return this.userService.getCurrentUser() !== null;
  }

  // Métodos del buscador de barberos
  loadBarberias() {
    this.loading = true;
    this.barberiaService.getAll().subscribe({
      next: (barberias) => {
        this.barberias = barberias.filter(b => b.barberia_active);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando barberías:', error);
        this.loading = false;
      }
    });
  }

  loadAllBarberos() {
    // Cargar todos los barberos usando el endpoint general
    this.http.get<any[]>(`${environment.apiUrl}/barberos/`).subscribe({
      next: (barberos: any[]) => {
        // Cargar barberías para obtener los nombres
        this.barberiaService.getAll().subscribe({
          next: (barberias: Barberia[]) => {
            const barberiasMap: { [key: number]: Barberia } = {};
            barberias.forEach(b => {
              barberiasMap[b.id_barberias] = b;
            });

            // Mapear barberos con información de barberías
            this.todosLosBarberos = barberos.map(b => ({
              id_barbero: b.id_barbero,
              id_barberia: b.id_barberia,
              nombre_barbero: b.nombre_barbero,
              calificacion: b.calificacion || 4.5,
              foto_url: b.foto_url,
              especialidades: b.especialidades,
              anios_experiencia: b.anios_experiencia,
              nombre_barberia: barberiasMap[b.id_barberia]?.nombre_barberia || 'Barbería'
            }));

            this.barberosFiltrados = [...this.todosLosBarberos];
            this.loading = false;
          },
          error: () => {
            this.loading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error cargando barberos:', error);
        this.loading = false;
      }
    });
  }

  seleccionarBarberia(id: number | null) {
    this.barberiaSeleccionada = id;
    
    if (id === null) {
      this.barberosFiltrados = [...this.todosLosBarberos];
    } else {
      this.barberosFiltrados = this.todosLosBarberos.filter(b => b.id_barberia === id);
    }
    
    if (this.searchTerm) {
      this.buscarBarberos({ detail: { value: this.searchTerm } } as any);
    }
  }

  buscarBarberos(event: any) {
    this.searchTerm = event.detail.value.toLowerCase();
    
    let barberos = this.barberiaSeleccionada === null 
      ? [...this.todosLosBarberos]
      : this.todosLosBarberos.filter(b => b.id_barberia === this.barberiaSeleccionada);
    
    if (this.searchTerm) {
      barberos = barberos.filter(b =>
        b.nombre_barbero.toLowerCase().includes(this.searchTerm) ||
        (b.especialidades && b.especialidades.toLowerCase().includes(this.searchTerm)) ||
        (b.nombre_barberia && b.nombre_barberia.toLowerCase().includes(this.searchTerm))
      );
    }
    
    this.barberosFiltrados = barberos;
  }

  reservarConBarbero(barbero: Barbero) {
    this.router.navigate(['/reservar'], {
      queryParams: {
        barbero_id: barbero.id_barbero,
        barberia_id: barbero.id_barberia
      }
    });
  }
}
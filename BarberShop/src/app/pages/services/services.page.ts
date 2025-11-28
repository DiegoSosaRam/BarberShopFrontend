import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { 
  IonContent, 
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonSearchbar,
  IonLabel,
  IonChip,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle
} from '@ionic/angular/standalone';
import { 
  ribbonOutline, 
  peopleOutline, 
  sparklesOutline,
  searchOutline,
  locationOutline,
  personOutline,
  starOutline, timeOutline, callOutline, arrowForward } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { UserService } from '../../services/user.service';
import { BarberiaService, Barberia } from '../../services/barberia.service';

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
    IonContent, IonButton, IonIcon, IonGrid, 
    IonRow, IonCol, CommonModule, FormsModule, NavbarComponent,
    IonSearchbar, IonLabel, IonChip, IonCard, IonCardContent
  ]
})
export class ServicesPage implements OnInit {

  // Propiedades de ventajas
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
    addIcons({locationOutline,callOutline,arrowForward,searchOutline,peopleOutline,starOutline,timeOutline,personOutline,ribbonOutline,sparklesOutline});
  }

  ngOnInit() {
    this.loadBarberias();
    this.loadAllBarberos();
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

  irADetalleBarberia(barberiaId: number) {
    this.router.navigate(['/barberia', barberiaId]);
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
  IonCol
} from '@ionic/angular/standalone';
import { 
  timeOutline, 
  starOutline, 
  cutOutline, 
  ribbonOutline, 
  peopleOutline, 
  sparklesOutline 
} from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { UserService } from '../../services/user.service';
import { ServicioConPrecio } from '../../models/interfaces';

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
    IonRow, IonCol, CommonModule, FormsModule, NavbarComponent
  ]
})
export class ServicesPage implements OnInit {

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

  constructor(
    private router: Router,
    public userService: UserService
  ) {
    addIcons({ 
      timeOutline, 
      starOutline, 
      cutOutline, 
      ribbonOutline, 
      peopleOutline, 
      sparklesOutline 
    });
  }

  ngOnInit() {
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
}
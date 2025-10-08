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


interface Servicio {
  id: string;
  nombre: string;
  precio: number;
  duracion: string;
  descripcion: string;
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

  servicios: Servicio[] = [
    {
      id: "corte-clasico",
      nombre: "Corte Clásico",
      precio: 15000,
      duracion: "30 min",
      descripcion: "Corte tradicional con tijeras y máquina, perfecto para un look elegante y profesional.",
      caracteristicas: ["Lavado incluido", "Peinado final", "Acabado preciso"],
      popular: false,
      categoria: "Clásico"
    },
    {
      id: "fade-moderno",
      nombre: "Fade Moderno",
      precio: 18000,
      duracion: "45 min",
      descripcion: "Degradado moderno con técnicas actuales, ideal para un estilo contemporáneo y fresco.",
      caracteristicas: ["Degradado perfecto", "Diseño personalizado", "Técnicas modernas"],
      popular: true,
      categoria: "Moderno"
    },
    {
      id: "corte-barba",
      nombre: "Corte + Barba",
      precio: 25000,
      duracion: "60 min",
      descripcion: "Servicio completo que combina corte de cabello y arreglo profesional de barba.",
      caracteristicas: ["Corte completo", "Perfilado de barba", "Aceites naturales", "Toalla caliente"],
      popular: true,
      categoria: "Completo"
    },
    {
      id: "arreglo-barba",
      nombre: "Arreglo de Barba",
      precio: 12000,
      duracion: "20 min",
      descripcion: "Perfilado y mantenimiento especializado de barba con productos premium.",
      caracteristicas: ["Perfilado preciso", "Aceites aromáticos", "Cera de barba"],
      popular: false,
      categoria: "Barba"
    },
    {
      id: "corte-infantil",
      nombre: "Corte Infantil",
      precio: 10000,
      duracion: "25 min",
      descripcion: "Corte especializado para niños en ambiente cómodo y divertido.",
      caracteristicas: ["Ambiente amigable", "Paciencia especial", "Descuentos familiares"],
      popular: false,
      categoria: "Infantil"
    },
    {
      id: "paquete-premium",
      nombre: "Paquete Premium",
      precio: 35000,
      duracion: "90 min",
      descripcion: "Experiencia completa de barbería con todos nuestros servicios premium.",
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

  constructor(private router: Router) {
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

  navigateToReservar() {
    this.router.navigate(['/reservar']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  formatPrice(price: number): string {
    return price.toLocaleString();
  }
}

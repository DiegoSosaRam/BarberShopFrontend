import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  IonHeader, 
  IonToolbar, 
  IonButton, 
  IonImg,
  IonIcon,
  IonToast
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  personOutline, 
  personAddOutline, 
  briefcaseOutline, 
  logOutOutline,
  cutOutline,
  calendarOutline,
  createOutline
} from 'ionicons/icons';
import { UserService, Usuario } from '../../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonButton,
    IonImg,
    IonIcon,
    IonToast
  ]
})
export class NavbarComponent implements OnInit {

  currentUser: Usuario | null = null;
  showToast = false;
  toastMessage = '';

  constructor(
    private router: Router,
    private userService: UserService
  ) {
    addIcons({
      personOutline, 
      personAddOutline, 
      briefcaseOutline, 
      logOutOutline,
      cutOutline,
      calendarOutline,
      createOutline
    });
  }

  ngOnInit() {
    // Suscribirse a cambios del usuario actual
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  get isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  get isBarbero(): boolean {
    return this.currentUser?.tipo === 'barbero';
  }

  get clienteTieneCitas(): boolean {
    return this.userService.clienteActualTieneCitas;
  }

  get userDisplayName(): string {
    return this.currentUser ? this.currentUser.nombre.split(' ')[0] : '';
  }

  navigateToHome() {
    // Si es barbero logueado, va a su dashboard principal (resumen)
    if (this.isBarbero) {
      this.router.navigate(['/custom-services'], { queryParams: { tab: 'dashboard' } });
    } else {
      // Si es cliente o no está logueado, va al home normal
      this.router.navigate(['/']);
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
  
  navigateToServices() {
    this.router.navigate(['/services']);
  }

  navigateToMisCitas() {
    this.router.navigate(['/mis-citas']);
  }

  // Navegación específica para barberos
  navigateToCustomServices() {
    this.router.navigate(['/custom-services'], { queryParams: { tab: 'citas' } });
  }

  navigateToMisServicios() {
    this.router.navigate(['/custom-services'], { queryParams: { tab: 'servicios' } });
  }
  
  // Método temporal para testing admin
  navigateToAdmin() {
    console.log('Navegando a admin desde navbar...');
    this.router.navigate(['/admin']);
  }

  logout() {
    const userName = this.userDisplayName;
    this.userService.logout();
    this.currentUser = null;
    
    this.toastMessage = `¡Hasta luego ${userName}!`;
    this.showToast = true;
    
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 1500);
  }
}

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
import { personOutline, personAddOutline, briefcaseOutline, logOutOutline } from 'ionicons/icons';
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
    addIcons({personOutline, personAddOutline, briefcaseOutline, logOutOutline});
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

  get userDisplayName(): string {
    return this.currentUser ? this.currentUser.nombre.split(' ')[0] : '';
  }

  navigateToHome() {
    this.router.navigate(['/']);
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

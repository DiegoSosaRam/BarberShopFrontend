import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent, 
  IonCard, 
  IonCardContent, 
  IonCardHeader, 
  IonCardTitle, 
  IonButton, 
  IonInput, 
  IonItem, 
  IonLabel,
  IonIcon,
  IonToast
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, lockClosedOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    IonButton, IonInput, IonItem, IonIcon, IonToast,
    CommonModule, FormsModule, NavbarComponent
  ]
})
export class LoginPage {

  loginData = {
    email: '',
    password: ''
  };

  showPassword = false;
  showToast = false;
  toastMessage = '';
  loading = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    addIcons({ personOutline, lockClosedOutline, eyeOutline, eyeOffOutline });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    if (!this.loginData.email || !this.loginData.password) {
      this.toastMessage = 'Por favor completa todos los campos';
      this.showToast = true;
      return;
    }

    this.loading = true;

    // Autenticar usuario usando el backend
    this.authService.login(this.loginData.email, this.loginData.password).subscribe({
      next: (response: any) => {
        const user = Array.isArray(response) ? response[0] : response.user;
        this.loading = false;
        this.toastMessage = `¡Bienvenido ${user.full_name}!`;
        this.showToast = true;
        
        setTimeout(() => {
          // Redirigir según el rol del usuario
          if (user.role === 'BARBERO') {
            this.router.navigate(['/custom-services']);
          } else if (user.role === 'ADMIN') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/services']);
          }
        }, 1500);
      },
      error: (error) => {
        this.loading = false;
        this.toastMessage = error.message || 'Credenciales incorrectas';
        this.showToast = true;
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToAdmin() {
    this.router.navigateByUrl('/admin');
  }
}

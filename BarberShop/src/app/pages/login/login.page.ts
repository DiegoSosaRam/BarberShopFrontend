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
import { UserService } from '../../services/user.service';

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

  constructor(
    private router: Router,
    private userService: UserService
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

    // Autenticar usuario usando el servicio
    const usuario = this.userService.authenticateUser(this.loginData.email, this.loginData.password);

    if (usuario) {
      this.toastMessage = `¡Bienvenido ${usuario.nombre}!`;
      this.showToast = true;
      
      // Guardar usuario en sesión
      this.userService.setCurrentUser(usuario);
      
      setTimeout(() => {
        // Verificar si hay una reserva pendiente
        const reservaPendiente = localStorage.getItem('reserva_pendiente');
        
        if (reservaPendiente) {
          // Limpiar reserva pendiente y volver a reservar
          localStorage.removeItem('reserva_pendiente');
          this.router.navigate(['/reservar'], { 
            queryParams: { return_from_login: 'true' } 
          });
        } else {
          // Redirigir según el tipo de usuario
          if (usuario.tipo === 'barbero') {
            this.router.navigate(['/custom-services']);
          } else {
            this.router.navigate(['/services']);
          }
        }
      }, 1500);
    } else {
      this.toastMessage = 'Credenciales incorrectas';
      this.showToast = true;
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToAdmin() {
    this.router.navigateByUrl('/admin');
  }

  // Método para obtener estadísticas (útil para testing)
  getStats() {
    return this.userService.getUserStats();
  }
}

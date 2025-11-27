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
import { personOutline, lockClosedOutline, eyeOutline, eyeOffOutline, mailOutline, phonePortraitOutline } from 'ionicons/icons';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    IonButton, IonInput, IonItem, IonIcon, IonToast,
    CommonModule, FormsModule, NavbarComponent
  ]
})
export class RegisterPage {
  
  registerData = {
    nombre: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  };

  showPassword = false;
  showConfirmPassword = false;
  showToast = false;
  toastMessage = '';
  loading = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    addIcons({ personOutline, lockClosedOutline, eyeOutline, eyeOffOutline, mailOutline, phonePortraitOutline });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onRegister() {
    // Validaciones básicas
    if (!this.registerData.nombre || !this.registerData.email || 
        !this.registerData.telefono || !this.registerData.password || 
        !this.registerData.confirmPassword) {
      this.toastMessage = 'Por favor completa todos los campos';
      this.showToast = true;
      return;
    }

    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.toastMessage = 'Las contraseñas no coinciden';
      this.showToast = true;
      return;
    }

    if (this.registerData.password.length < 6) {
      this.toastMessage = 'La contraseña debe tener al menos 6 caracteres';
      this.showToast = true;
      return;
    }

    this.loading = true;

    // Registrar nuevo usuario en el backend
    this.authService.register({
      full_name: this.registerData.nombre,
      email: this.registerData.email,
      phone: this.registerData.telefono,
      password: this.registerData.password,
      role_code_input: 'CLIENTE'
    }).subscribe({
      next: (user) => {
        this.loading = false;
        this.toastMessage = `¡Registro exitoso! Bienvenido ${user.full_name}`;
        this.showToast = true;
        
        setTimeout(() => {
          // Redirigir a la página de servicios
          this.router.navigate(['/services']);
        }, 1500);
      },
      error: (error) => {
        this.loading = false;
        this.toastMessage = error.message || 'Error al registrar usuario';
        this.showToast = true;
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}

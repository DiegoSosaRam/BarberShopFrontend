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
import { UserService } from '../../services/user.service';

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

  constructor(
    private router: Router,
    private userService: UserService
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

    // Verificar que el email no esté ya registrado
    if (this.userService.emailExists(this.registerData.email)) {
      this.toastMessage = 'Este email ya está registrado';
      this.showToast = true;
      return;
    }

    try {
      // Registrar nuevo usuario
      const nuevoUsuario = this.userService.registerUser({
        email: this.registerData.email,
        password: this.registerData.password,
        nombre: this.registerData.nombre,
        telefono: this.registerData.telefono,
        tipo: 'cliente'
      });

      this.toastMessage = `¡Registro exitoso! Bienvenido ${nuevoUsuario.nombre}`;
      this.showToast = true;
      
      // Establecer usuario en sesión
      this.userService.setCurrentUser(nuevoUsuario);
      
      setTimeout(() => {
        // Los clientes van a services
        this.router.navigate(['/services']);
      }, 1500);
      
    } catch (error) {
      this.toastMessage = 'Error al registrar usuario. Intenta nuevamente.';
      this.showToast = true;
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  // Métodos útiles para testing
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  getStats() {
    return this.userService.getUserStats();
  }
}

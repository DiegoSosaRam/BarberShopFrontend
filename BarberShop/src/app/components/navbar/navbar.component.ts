import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  IonHeader, 
  IonToolbar, 
  IonButton, 
  IonImg,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, personAddOutline, briefcaseOutline } from 'ionicons/icons';

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
    IonIcon
  ]
})
export class NavbarComponent implements OnInit {

  constructor(private router: Router) {
    addIcons({personOutline,personAddOutline,briefcaseOutline});
  }

  ngOnInit() {}

  navigateToHome() {
    this.router.navigate(['/']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToRegister() {
    this.router.navigate(['/register-barber']);
  }
  
  navigateToServices() {
    this.router.navigate(['/services']);
  }
}

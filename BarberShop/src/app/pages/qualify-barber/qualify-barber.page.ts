import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';

@Component({
  selector: 'app-qualify-barber',
  templateUrl: './qualify-barber.page.html',
  styleUrls: ['./qualify-barber.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, NavbarComponent]
})
export class QualifyBarberPage implements OnInit {
  // variable que contiene cuántas estrellas se escogieron
  rating: number = 0;
  name: string = 'Barbero pelón';
  constructor() { }

  ngOnInit() { }

  setRating(value: number) {
    this.rating = value;
  }

  submitRating(event: Event) {
    event.preventDefault();
    // aquí enviarías la calificación al backend; por ahora mostramos en consola
    console.log('Calificación enviada:', this.rating);
    // opcional: feedback al usuario (alert, toast...) — implementar según tu stack
  }
}

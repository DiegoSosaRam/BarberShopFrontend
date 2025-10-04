import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-qualify-barber',
  templateUrl: './qualify-barber.page.html',
  styleUrls: ['./qualify-barber.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class QualifyBarberPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

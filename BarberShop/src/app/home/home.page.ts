import { Component } from '@angular/core';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { IonContent } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    NavbarComponent,
    CommonModule
  ]
})
export class HomePage {
  constructor() {}
}

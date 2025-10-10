import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-pages',
  templateUrl: 'pages.page.html',
  styleUrls: ['pages.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class PagesPage {
  constructor() {}
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-register-barber',
  templateUrl: './register-barber.page.html',
  styleUrls: ['./register-barber.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class RegisterBarberPage implements OnInit {
  name: string = '';
  email: string = ''; // <-- nueva propiedad para el correo
  photoFile: File | null = null;
  photoPreview: string | null = null;

  // Servicios disponibles (cadena en .ts) - usado en template con *ngFor
  servicesOptions: string[] = ['cortes de pelo', 'masajes', 'barberia', 'exfollido facial'];

  // Servicios seleccionados por el usuario
  selectedServices: string[] = [];

  // Lista de barberías (variable en .ts)
  barberies: string[] = ['Barbería Central', 'Premium Cuts', 'Barber & Co'];
  selectedBarberia: string = '';

  constructor() { }

  ngOnInit() {
  }

  handlePhotoChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.photoFile = null;
      this.photoPreview = null;
      return;
    }

    this.photoFile = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.photoPreview = reader.result as string;
    };

    reader.readAsDataURL(this.photoFile);
  }

  toggleService(service: string, checked: boolean) {
    if (checked) {
      if (!this.selectedServices.includes(service)) this.selectedServices.push(service);
    } else {
      this.selectedServices = this.selectedServices.filter(s => s !== service);
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();
    const payload = {
      name: this.name,
      email: this.email, 
      barberia: this.selectedBarberia,
      services: this.selectedServices,
      // photoFile: this.photoFile (procesar FormData en integración real)
    };
    console.log('Register barber payload:', payload, 'photoFile:', this.photoFile);
  }
}

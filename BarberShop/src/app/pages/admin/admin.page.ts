import { Component, OnInit } from '@angular/core';
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
  IonItem, 
  IonLabel,
  IonList,
  IonBadge,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonAlert
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, trashOutline, statsChartOutline, refreshOutline } from 'ionicons/icons';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { UserService, Usuario } from '../../services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    IonButton, IonItem, IonLabel, IonList, IonBadge, IonIcon,
    IonGrid, IonRow, IonCol, IonAlert,
    CommonModule, FormsModule, NavbarComponent
  ]
})
export class AdminPage implements OnInit {

  usuarios: Usuario[] = [];
  stats: any = {};
  showDeleteAlert = false;
  userToDelete: string = '';
  
  alertButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => {
        this.showDeleteAlert = false;
      }
    },
    {
      text: 'Eliminar',
      role: 'confirm',
      handler: () => {
        this.deleteUser();
      }
    }
  ];

  constructor(
    private router: Router,
    private userService: UserService
  ) {
    addIcons({ personOutline, trashOutline, statsChartOutline, refreshOutline });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.usuarios = this.userService.getAllUsers();
    this.stats = this.userService.getUserStats();
  }

  confirmDelete(userId: string) {
    this.userToDelete = userId;
    this.showDeleteAlert = true;
  }

  deleteUser() {
    if (this.userToDelete) {
      this.userService.deleteUser(this.userToDelete);
      this.loadData();
      this.userToDelete = '';
    }
    this.showDeleteAlert = false;
  }

  clearAllUsers() {
    this.userService.clearAllUsers();
    this.loadData();
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getUserBadgeColor(tipo: string): string {
    return tipo === 'barbero' ? 'warning' : 'primary';
  }

  goBack() {
    this.router.navigate(['/']);
  }
}

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
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonSegment,
  IonSegmentButton,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonSpinner,
  IonToast
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  personOutline, 
  trashOutline, 
  statsChartOutline, 
  refreshOutline,
  addOutline,
  createOutline,
  closeOutline,
  checkmarkOutline,
  closeCircleOutline,
  locationOutline,
  callOutline,
  businessOutline,
  peopleOutline,
  calendarOutline
} from 'ionicons/icons';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { AuthService, AuthUser } from '../../services/auth.service';
import { AdminService, BarberiaCreate, BarberoCreate, CitaAdmin } from '../../services/admin.service';
import { CitaService, Barberia, Barbero } from '../../services/cita.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    IonButton, IonItem, IonLabel, IonList, IonBadge, IonIcon,
    IonInput, IonTextarea, IonSelect, IonSelectOption,
    IonSegment, IonSegmentButton, IonModal, IonHeader, IonToolbar, IonTitle,
    IonButtons, IonSpinner, IonToast,
    CommonModule, FormsModule, NavbarComponent
  ]
})
export class AdminPage implements OnInit {

  // Control de sección activa
  selectedSegment: string = 'barberias';

  // Usuario actual
  currentUser: AuthUser | null = null;

  // Datos
  barberias: Barberia[] = [];
  barberos: Barbero[] = [];
  citasPendientes: CitaAdmin[] = [];

  // Modales
  showBarberiaModal = false;
  showBarberoModal = false;
  showCitaModal = false;

  // Formularios
  barberiaForm: BarberiaCreate = {
    nombre_barberia: '',
    direccion: '',
    telefono: '',
    timezone: 'America/Mexico_City',
    slug: '',
    portada_url: '',
    barberia_active: true
  };

  barberoForm: BarberoCreate = {
    id_barberia: 0,
    nombre_barbero: '',
    especialidades: '',
    anios_experiencia: 0,
    calificacion: 5.0,
    foto_url: ''
  };

  citaSeleccionada: CitaAdmin | null = null;
  motivoRechazo: string = '';

  // Estados
  loading = false;
  isEditing = false;
  editingId: number = 0;

  // Toast
  showToast = false;
  toastMessage = '';
  toastColor = 'success';

  constructor(
    private router: Router,
    private authService: AuthService,
    private adminService: AdminService,
    private citaService: CitaService
  ) {
    addIcons({ 
      personOutline, 
      trashOutline, 
      statsChartOutline, 
      refreshOutline,
      addOutline,
      createOutline,
      closeOutline,
      checkmarkOutline,
      closeCircleOutline,
      locationOutline,
      callOutline,
      businessOutline,
      peopleOutline,
      calendarOutline
    });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loadBarberias();
    this.loadBarberos();
    this.loadCitasPendientes();
  }

  // ========== BARBERÍAS ==========

  loadBarberias() {
    this.loading = true;
    this.citaService.getBarberias().subscribe({
      next: (data) => {
        this.barberias = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando barberías:', err);
        this.mostrarToast('Error al cargar barberías', 'danger');
        this.loading = false;
      }
    });
  }

  openBarberiaModal(barberia?: Barberia) {
    if (barberia) {
      this.isEditing = true;
      this.editingId = barberia.id_barberias;
      this.barberiaForm = {
        nombre_barberia: barberia.nombre_barberia,
        direccion: barberia.direccion,
        telefono: barberia.telefono,
        timezone: barberia.timezone || 'America/Mexico_City',
        slug: barberia.slug || '',
        portada_url: barberia.portada_url || '',
        barberia_active: barberia.barberia_active
      };
    } else {
      this.isEditing = false;
      this.resetBarberiaForm();
    }
    this.showBarberiaModal = true;
  }

  saveBarberia() {
    if (!this.barberiaForm.nombre_barberia || !this.barberiaForm.direccion || !this.barberiaForm.telefono) {
      this.mostrarToast('Por favor complete todos los campos requeridos', 'warning');
      return;
    }

    // Generar slug si no existe
    if (!this.barberiaForm.slug) {
      this.barberiaForm.slug = this.barberiaForm.nombre_barberia
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    this.loading = true;

    if (this.isEditing) {
      this.adminService.updateBarberia(this.editingId, this.barberiaForm).subscribe({
        next: () => {
          this.mostrarToast('Barbería actualizada exitosamente', 'success');
          this.loadBarberias();
          this.closeBarberiaModal();
        },
        error: (err) => {
          console.error('Error actualizando barbería:', err);
          this.mostrarToast('Error al actualizar barbería', 'danger');
          this.loading = false;
        }
      });
    } else {
      this.adminService.createBarberia(this.barberiaForm).subscribe({
        next: () => {
          this.mostrarToast('Barbería creada exitosamente', 'success');
          this.loadBarberias();
          this.closeBarberiaModal();
        },
        error: (err) => {
          console.error('Error creando barbería:', err);
          this.mostrarToast('Error al crear barbería', 'danger');
          this.loading = false;
        }
      });
    }
  }

  deleteBarberia(id: number) {
    if (confirm('¿Está seguro de eliminar esta barbería? Se eliminarán todos sus barberos asociados.')) {
      this.loading = true;
      this.adminService.deleteBarberia(id).subscribe({
        next: () => {
          this.mostrarToast('Barbería eliminada exitosamente', 'success');
          this.loadBarberias();
        },
        error: (err) => {
          console.error('Error eliminando barbería:', err);
          this.mostrarToast('Error al eliminar barbería', 'danger');
          this.loading = false;
        }
      });
    }
  }

  closeBarberiaModal() {
    this.showBarberiaModal = false;
    this.resetBarberiaForm();
    this.loading = false;
  }

  resetBarberiaForm() {
    this.barberiaForm = {
      nombre_barberia: '',
      direccion: '',
      telefono: '',
      timezone: 'America/Mexico_City',
      slug: '',
      portada_url: '',
      barberia_active: true
    };
  }

  // ========== BARBEROS ==========

  loadBarberos() {
    this.loading = true;
    this.citaService.getBarberias().subscribe({
      next: (barberias) => {
        // Cargar barberos de todas las barberías
        const promises = barberias.map(b => 
          this.citaService.getBarberosPorBarberia(b.id_barberias).toPromise()
        );
        
        Promise.all(promises).then(results => {
          this.barberos = results.reduce((acc: Barbero[], curr) => acc.concat(curr || []), []);
          this.loading = false;
        }).catch(err => {
          console.error('Error cargando barberos:', err);
          this.loading = false;
        });
      },
      error: (err) => {
        console.error('Error:', err);
        this.loading = false;
      }
    });
  }

  openBarberoModal(barbero?: Barbero) {
    if (barbero) {
      this.isEditing = true;
      this.editingId = barbero.id_barbero;
      this.barberoForm = {
        id_barberia: barbero.id_barberia,
        nombre_barbero: barbero.nombre_barbero,
        especialidades: barbero.especialidades || '',
        anios_experiencia: barbero.anios_experiencia || 0,
        calificacion: barbero.calificacion || 5.0,
        foto_url: barbero.foto_url || ''
      };
    } else {
      this.isEditing = false;
      this.resetBarberoForm();
    }
    this.showBarberoModal = true;
  }

  saveBarbero() {
    if (!this.barberoForm.nombre_barbero || !this.barberoForm.id_barberia) {
      this.mostrarToast('Por favor complete todos los campos requeridos', 'warning');
      return;
    }

    this.loading = true;

    if (this.isEditing) {
      this.adminService.updateBarbero(this.editingId, this.barberoForm).subscribe({
        next: () => {
          this.mostrarToast('Barbero actualizado exitosamente', 'success');
          this.loadBarberos();
          this.closeBarberoModal();
        },
        error: (err) => {
          console.error('Error actualizando barbero:', err);
          this.mostrarToast('Error al actualizar barbero', 'danger');
          this.loading = false;
        }
      });
    } else {
      this.adminService.createBarbero(this.barberoForm).subscribe({
        next: () => {
          this.mostrarToast('Barbero creado exitosamente', 'success');
          this.loadBarberos();
          this.closeBarberoModal();
        },
        error: (err) => {
          console.error('Error creando barbero:', err);
          this.mostrarToast('Error al crear barbero', 'danger');
          this.loading = false;
        }
      });
    }
  }

  deleteBarbero(id: number) {
    if (confirm('¿Está seguro de eliminar este barbero?')) {
      this.loading = true;
      this.adminService.deleteBarbero(id).subscribe({
        next: () => {
          this.mostrarToast('Barbero eliminado exitosamente', 'success');
          this.loadBarberos();
        },
        error: (err) => {
          console.error('Error eliminando barbero:', err);
          this.mostrarToast('Error al eliminar barbero', 'danger');
          this.loading = false;
        }
      });
    }
  }

  closeBarberoModal() {
    this.showBarberoModal = false;
    this.resetBarberoForm();
    this.loading = false;
  }

  resetBarberoForm() {
    this.barberoForm = {
      id_barberia: 0,
      nombre_barbero: '',
      especialidades: '',
      anios_experiencia: 0,
      calificacion: 5.0,
      foto_url: ''
    };
  }

  getNombreBarberia(idBarberia: number): string {
    const barberia = this.barberias.find(b => b.id_barberias === idBarberia);
    return barberia?.nombre_barberia || 'Desconocida';
  }

  // ========== CITAS ==========

  loadCitasPendientes() {
    this.loading = true;
    this.adminService.getCitasPendientes().subscribe({
      next: (data) => {
        this.citasPendientes = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando citas pendientes:', err);
        this.mostrarToast('Error al cargar citas pendientes', 'danger');
        this.loading = false;
      }
    });
  }

  openCitaModal(cita: CitaAdmin) {
    this.citaSeleccionada = cita;
    this.motivoRechazo = '';
    this.showCitaModal = true;
  }

  aprobarCita() {
    if (!this.citaSeleccionada) return;

    this.loading = true;
    this.adminService.aprobarCita(this.citaSeleccionada.id_cita).subscribe({
      next: () => {
        this.mostrarToast('Cita aprobada exitosamente', 'success');
        this.loadCitasPendientes();
        this.closeCitaModal();
      },
      error: (err) => {
        console.error('Error aprobando cita:', err);
        console.error('Detalles del error:', err.error);
        this.mostrarToast('Error al aprobar cita: ' + (err.error?.error || 'Error desconocido'), 'danger');
        this.loading = false;
      }
    });
  }

  rechazarCita() {
    if (!this.citaSeleccionada) return;

    if (!this.motivoRechazo.trim()) {
      this.mostrarToast('Por favor ingrese el motivo del rechazo', 'warning');
      return;
    }

    this.loading = true;
    this.adminService.rechazarCita(this.citaSeleccionada.id_cita, this.motivoRechazo).subscribe({
      next: () => {
        this.mostrarToast('Cita rechazada', 'success');
        this.loadCitasPendientes();
        this.closeCitaModal();
      },
      error: (err) => {
        console.error('Error rechazando cita:', err);
        console.error('Detalles del error:', err.error);
        this.mostrarToast('Error al rechazar cita: ' + (err.error?.error || 'Error desconocido'), 'danger');
        this.loading = false;
      }
    });
  }

  closeCitaModal() {
    this.showCitaModal = false;
    this.citaSeleccionada = null;
    this.motivoRechazo = '';
    this.loading = false;
  }

  // ========== UTILIDADES ==========

  mostrarToast(mensaje: string, color: string) {
    this.toastMessage = mensaje;
    this.toastColor = color;
    this.showToast = true;
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }
}

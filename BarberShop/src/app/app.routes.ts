import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  // Removed duplicate and invalid 'pages' route. If you have a valid pages.page file, correct the import path.
  {
    path: 'index',
    loadComponent: () => import('./pages/index/index.page').then( m => m.IndexPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register-user',
    loadComponent: () => import('./pages/register-user/register-user.page').then( m => m.RegisterUserPage)
  },
  {
    path: 'register-barber',
    loadComponent: () => import('./pages/register-barber/register-barber.page').then( m => m.RegisterBarberPage)
  },
  {
    path: 'qualify-barber',
    loadComponent: () => import('./pages/qualify-barber/qualify-barber.page').then( m => m.QualifyBarberPage)
  },
  {
    path: 'appointment',
    loadComponent: () => import('./pages/appointment/appointment.page').then( m => m.AppointmentPage)
  },

];

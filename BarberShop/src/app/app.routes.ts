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
  {
    path: 'pages',
    loadComponent: () => import('./pages/pages.page').then( m => m.PagesPage)
  },
  {
    path: 'services',
    loadComponent: () => import('./pages/services/services.page').then( m => m.ServicesPage)
  },
  {
    path: 'custom-services',
    loadComponent: () => import('./pages/custom-services/custom-services.page').then( m => m.CustomServicesPage)
  },
  // {
  //   path: 'login',
  //   loadComponent: () => import('./pages/services/services.page').then( m => m.ServicesPage)
  // },
  {
    path: 'register',
    loadComponent: () => import('./pages/services/services.page').then( m => m.ServicesPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register-barber',
    loadComponent: () => import('./pages/register-barber/register-barber.page').then( m => m.RegisterBarberPage)
  },
  {
    path: 'register-user',
    loadComponent: () => import('./pages/register-user/register-user.page').then( m => m.RegisterUserPage)
  },
  {
    path: 'reservar',
    loadComponent: () => import('./pages/reservar/reservar.page').then( m => m.ReservarPage)
  },


];

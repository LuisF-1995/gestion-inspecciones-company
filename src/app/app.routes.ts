import { Routes } from '@angular/router';
import { adminDashboard, asesorDashboard, directorRegionalDashboard, directorTecnicoDashboard, inspectorDashboard, login, programadorAgendaDashboard, register } from '../constants/Routes';
import { ErrorPageComponent } from './pages/error-page/error-page.component';

export const routes: Routes = [
  login,
  register,
  adminDashboard,
  asesorDashboard,
  directorRegionalDashboard,
  directorTecnicoDashboard,
  inspectorDashboard,
  programadorAgendaDashboard,
  {
    path:'**',
    component:ErrorPageComponent
  }
];

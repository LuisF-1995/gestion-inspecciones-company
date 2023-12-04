import { AdminDashboard } from "../app/pages/admin-dashboard/admin-dashboard.component"
import { AsesorcomercialDashboard } from "../app/pages/asesorcomercial-dashboard/asesorcomercial-dashboard.component"
import { DirectorregionalDashboard } from "../app/pages/directorregional-dashboard/directorregional-dashboard.component"
import { DirectortecnicoDashboard } from "../app/pages/directortecnico-dashboard/directortecnico-dashboard.component"
import { InspectorDashboard } from "../app/pages/inspector-dashboard/inspector-dashboard.component"
import { LoginPage } from "../app/pages/login/login.component"
import { ProgramadoragendaDashboard } from "../app/pages/programadoragenda-dashboard/programadoragenda-dashboard.component"
import { RegisterPage } from "../app/pages/register/register.component"

export const login = {
  path:"",
  title: "Login",
  component: LoginPage
}

export const register = {
  path:"register",
  title: "Register",
  component: RegisterPage
}

export const adminDashboard = {
  path: "admin",
  title: "Admin Dashboard",
  component: AdminDashboard
}

export const asesorDashboard = {
  path: "asesor-comercial",
  title: "Comercial Dashboard",
  component: AsesorcomercialDashboard
}

export const directorRegionalDashboard = {
  path: "director-regional",
  title: "Director regional",
  component: DirectorregionalDashboard
}

export const directorTecnicoDashboard = {
  path: "director-tecnico",
  title: "Director tecnico",
  component: DirectortecnicoDashboard
}

export const inspectorDashboard = {
  path: "inspector",
  title: "Inspector Dashboard",
  component: InspectorDashboard
}

export const programadorAgendaDashboard = {
  path: "programador-agenda",
  title: "Programar agenda",
  component: ProgramadoragendaDashboard
}

import * as React from "react";
import * as ReactDOM from "react-dom/client";
import './index.css';
import Root from './pages/root/Root.tsx';
import reportWebVitals from './reportWebVitals';

import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { adminAddUserPath, adminLoginPath, adminProfilePath, adminRegisterPath, adminRootPath, adminPortalPath, loginPath, adminUsersPath, adminCompetencesPath, adminAddCompetencePath, adminRegionalsPath, adminAddRegionalPath, commercialAdvisorRoutes, regionalDirectorRoutes, technicalDirectorRoutes, inspectorRoutes, agendaProgrammerRoutes } from './constants/routes.ts';
//PAGES
import ErrorPage from './pages/errorpage/ErrorPage.tsx';
import GeneralLogin from './pages/login/Login.tsx';
import AdminLogin from './pages/admin/Login.tsx';
import AdminRegister from './pages/admin/Register.tsx';
import AdminHome from './pages/admin/AdminHome.tsx';
import AsesorDashboard from './pages/asesor-comercial/Dashboard.tsx';
import DirRegionalDashboard from './pages/director-regional/Dashboard.tsx';
import DirTecnicoDashboard from './pages/director-tecnico/Dashboard.tsx';
import InspectorDashboard from './pages/inspector/Dashboard.tsx';
import ProgramadorDashboard from './pages/programador-agenda/Dashboard.tsx';
// COMPONENTES
import ViewUsers from './components/admin/ViewUsers.tsx';
import AddUser from './components/admin/AddUser.tsx';
import ViewCompetences from './components/admin/ViewCompetences.tsx';
import AddCompetence from './components/admin/AddCompetence.tsx';
import ViewRegionals from './components/admin/ViewRegionals.tsx';
import AddRegional from './components/admin/AddRegional.tsx';
import AdminProfile from './components/admin/AdminProfile.tsx';
import CommercialAdvisorProfile from './components/commercialAdvisor/CommercialAdvisorProfile.tsx';
import Quotes from './components/commercialAdvisor/Quotes.tsx';
import CreateProject from './components/CreateProject.tsx';
import ViewClients from './components/commercialAdvisor/ViewClients.tsx';
import CreateClient from './components/CreateClient.tsx';

const routes = createBrowserRouter([
  {
      path:"/",
      element: <Root/>,
      errorElement: <ErrorPage/>,
      caseSensitive:false,
      children: [
        {
          path: loginPath,
          element: <GeneralLogin/>
        },
        {
          path: adminRootPath,
          children: [
            {
              path: adminLoginPath,
              element: <AdminLogin/>
            },
            {
              path: adminRegisterPath,
              element: <AdminRegister/>
            },
            {
              path: adminPortalPath,
              element: <AdminHome/>,
              children: [
                {
                  path: adminUsersPath,
                  element: <ViewUsers/>
                },
                {
                  path: adminAddUserPath,
                  element: <AddUser/>
                },
                {
                  path: adminCompetencesPath,
                  element: <ViewCompetences/>
                },
                {
                  path: adminAddCompetencePath,
                  element: <AddCompetence/>
                },
                {
                  path: `${adminRegionalsPath}/:regionalId?`,
                  element: <ViewRegionals/>
                },
                {
                  path: adminAddRegionalPath,
                  element: <AddRegional/>
                },
                {
                  path: adminProfilePath,
                  element: <AdminProfile/>
                }
              ]
            }
          ]
        },
        {
          path: commercialAdvisorRoutes.root,
          element: <AsesorDashboard/>,
          children: [
            {
              path: commercialAdvisorRoutes.profile,
              element: <CommercialAdvisorProfile/>
            },
            {
              path: commercialAdvisorRoutes.quotes,
              element: <Quotes/>
            },
            {
              path: commercialAdvisorRoutes.createProject,
              element: <CreateProject/>
            },
            {
              path: commercialAdvisorRoutes.clients.root,
              element: <ViewClients/>
            },
            {
              path: commercialAdvisorRoutes.clients.create,
              element: <CreateClient/>
            }
          ]
        },
        {
          path: regionalDirectorRoutes.root,
          element: <DirRegionalDashboard/>,
          children: [
            {
            }
          ]
        },
        {
          path: technicalDirectorRoutes.root,
          element: <DirTecnicoDashboard/>,
          children: [
            {
            }
          ]
        },
        {
          path: inspectorRoutes.root,
          element: <InspectorDashboard/>,
          children: [
            {
            }
          ]
        },
        {
          path: agendaProgrammerRoutes.root,
          element: <ProgramadorDashboard/>,
          children: [
            {
            }
          ]
        }
      ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={routes}/>
  </React.StrictMode> 
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

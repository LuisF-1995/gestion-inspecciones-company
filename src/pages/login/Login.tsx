import React, { useEffect, useState } from 'react';
import './login.styles.css';
import { API_GESTION_INSPECCIONES_URL, COMMERCIAL_ADVISORS, INSPECTORS, REGIONAL_DIRECTORS, SCHEDULE_PROGRAMMERS, TECHNICAL_DIRECTORS } from '../../constants/apis';
import { sendGet, sendPost } from '../../services/apiRequests';
import { adminRootPath, adminLoginPath, commercialAdvisorRoutes, inspectorRoutes, agendaProgrammerRoutes, technicalDirectorRoutes, regionalDirectorRoutes } from '../../constants/routes';
import { apiUserRoles, localUserIdKeyName, localUserRolKeyName, localUserTokenKeyName } from '../../constants/globalConstants';
import { getUserRoles } from '../../services/globalFunctions';
import { NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
// MATERIAL UI COMPONENTS
import { TextField, Button, MenuItem, FormControl, InputLabel, Select, Box } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';


const GeneralLogin = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState(['']);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    if( localStorage.length > 0 && 
        localStorage.getItem(localUserTokenKeyName) && localStorage.getItem(localUserTokenKeyName).length > 0 &&
        localStorage.getItem(localUserIdKeyName) && localStorage.getItem(localUserIdKeyName).length > 0 &&
        localStorage.getItem(localUserRolKeyName) && localStorage.getItem(localUserRolKeyName).length > 0 )
      redirectToPageByUserRol(localStorage.getItem(localUserRolKeyName));
    else
      getUserRolesArray();
  }, [])

  const getUserRolesArray = async() => {
    const userRoles = await getUserRoles();
    setRoles(userRoles);
  };
  
  const handleLogin = async (form:React.FormEvent<HTMLFormElement>) => {
    form.preventDefault();
    setWaiting(true);

    const loginObject = {
      email: email,
      password: password
    }

    try {
      const loginValidation = await validateLoginByRol(selectedRole, loginObject);
      setWaiting(false);
  
      if(loginValidation && loginValidation.authenticationSuccess && loginValidation.jwtToken && loginValidation.userInfo){
        localStorage.clear();
        localStorage.setItem(localUserTokenKeyName, loginValidation.jwtToken);
        localStorage.setItem(localUserIdKeyName, loginValidation.userInfo.id);
        localStorage.setItem(localUserRolKeyName, selectedRole);

        redirectToPageByUserRol(selectedRole);
      }
      else if(loginValidation && loginValidation.authInfo && !loginValidation.authenticationSuccess){
        Swal.fire({
          title: 'No se pudo iniciar sesión',
          text: `${loginValidation.authInfo}`,
          icon: 'info',
        })
      }
      else if(loginValidation && loginValidation.response && loginValidation.response.status && loginValidation.response.status === 401){
        Swal.fire({
          title: 'Credenciales erróneas',
          text: `Favor validar que el usuario y contraseña estén correctos`,
          icon: 'error',
        })
      }
      else{
        setWaiting(false);
        Swal.fire({
          title: 'No se puede iniciar sesión',
          text: ``,
          icon: 'error',
        })
      }
    } 
    catch (error) {
      Swal.fire({
        title: "Error de conexión",
        text: `No se pudo obtener información de los roles, verificar conexión a internet o comunicate con nosotros.`,
        icon: 'error'
      })
    }
  };

  const validateLoginByRol = async(rol:string, body:{email:string, password:string}) => {
    switch (rol) {
      case apiUserRoles.inspector:
        const loginInspectorResponse = await sendPost(`${API_GESTION_INSPECCIONES_URL}/${INSPECTORS}/login`, body);
        return loginInspectorResponse;
      case apiUserRoles.asesorComercial:
        const loginAsesorResponse = await sendPost(`${API_GESTION_INSPECCIONES_URL}/${COMMERCIAL_ADVISORS}/login`, body);
        return loginAsesorResponse;
      case apiUserRoles.directorRegional:
        const loginDirRegionalResponse = await sendPost(`${API_GESTION_INSPECCIONES_URL}/${REGIONAL_DIRECTORS}/login`, body);
        return loginDirRegionalResponse;
      case apiUserRoles.directorTecnico:
        const loginDirTecnicoResponse = await sendPost(`${API_GESTION_INSPECCIONES_URL}/${TECHNICAL_DIRECTORS}/login`, body);
        return loginDirTecnicoResponse;
      case apiUserRoles.programadorAgenda:
        const loginProgramadorResponse = await sendPost(`${API_GESTION_INSPECCIONES_URL}/${SCHEDULE_PROGRAMMERS}/login`, body);
        return loginProgramadorResponse;
        
      default:
        return null;
    }
  }

  const redirectToPageByUserRol = (userRol:string) => {
    switch (userRol) {
      case apiUserRoles.asesorComercial:
        navigate(`/${commercialAdvisorRoutes.root}`);
        break;
      case apiUserRoles.inspector:
        navigate(`/${inspectorRoutes.root}`);          
        break;
      case apiUserRoles.programadorAgenda:
        navigate(`/${agendaProgrammerRoutes.root}`);          
        break;
      case apiUserRoles.directorTecnico:
        navigate(`/${technicalDirectorRoutes.root}`);          
        break;
      case apiUserRoles.directorRegional:
        navigate(`/${regionalDirectorRoutes.root}`);          
        break;
      default:
        break;
    }
  }

  return (
    <main className="logincontainer">
      <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: 300,
            margin: 'auto',
            backgroundColor: 'rgb(255, 255, 255)',
            padding: 1,
            borderRadius: 4,
            boxShadow: '0px 2px 10px -1px rgb(32, 49, 137)',
          }}
        >
        <form onSubmit={handleLogin} className='generalLoginForm'>
          <h2>Login</h2>
          <TextField
            label="Email"
            variant="outlined"
            margin="normal"
            fullWidth
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            variant="outlined"
            margin="normal"
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FormControl variant="outlined" margin="normal" fullWidth>
            <InputLabel>Rol</InputLabel>
            <Select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              label="Rol"
              required
            >
              {roles && roles.length > 0 && roles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role && role.length > 0 ? role.replace("_", " ") : ""}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button type="submit" variant="outlined" color="primary" sx={{ mt: 2 }}>
            Iniciar sesión
          </Button>
        </form>
 
        <section className='adminSection'>
          <p>¿Eres administrador?</p>
          <NavLink to={`${adminRootPath}/${adminLoginPath}`}>
            Ir al sitio
          </NavLink>
        </section>
      </Box>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={waiting}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </main>
  );
}

export default GeneralLogin
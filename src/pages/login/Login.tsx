import React, { useEffect, useState } from 'react';
import './login.styles.css';
import { TextField, Button, MenuItem, FormControl, InputLabel, Select, Box } from '@mui/material';
import { API_GESTION_INSPECCIONES_URL } from '../../constants/apis';
import { sendGet, sendPost } from '../../services/apiRequests';
import { adminRootPath, adminLoginPath } from '../../constants/routes';
// MATERIAL UI COMPONENTS
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Swal from 'sweetalert2';
import { NavLink } from 'react-router-dom';


const GeneralLogin = () => {
  const [roles, setRoles] = useState([""]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    getUserRoles();
  }, [])

  const getUserRoles = async() => {
    const rolesFromApi:string[] = await sendGet(`${API_GESTION_INSPECCIONES_URL}/user-roles`);
    const filterClients:string[] = rolesFromApi.filter((rol:string) => rol !== "CLIENTE");
    const filteredRoles:string[] = filterClients.filter((rol:string) => rol !== "CONSTRUCTOR");

    setRoles(filteredRoles);
  }
  

  const handleLogin = async (form:React.FormEvent<HTMLFormElement>) => {
    form.preventDefault();
    setWaiting(true);

    const loginObject = {
      email: email,
      password: password
    }

    const loginValidation = await validateLoginByRol(selectedRole, loginObject);

    if(loginValidation && loginValidation.authenticationSuccess && loginValidation.jwtToken && loginValidation.userInfo){
      setWaiting(false);
    }
    else{
      setWaiting(false);
      Swal.fire({
        title: 'No se puede iniciar sesión',
        text: ``,
        icon: 'error',
      })
    }
  };

  const validateLoginByRol = async(rol:string, body:{email:string, password:string}) => {
    switch (rol) {
      case "INSPECTOR":
        const loginInspectorResponse = await sendPost(`${API_GESTION_INSPECCIONES_URL}/inspectores/login`, body);
        return loginInspectorResponse;
      case "ASESOR_COMERCIAL":
        const loginAsesorResponse = await sendPost(`${API_GESTION_INSPECCIONES_URL}/asesores-comerciales/login`, body);
        return loginAsesorResponse;
      case "DIRECTOR_REGIONAL":
        const loginDirRegionalResponse = await sendPost(`${API_GESTION_INSPECCIONES_URL}/directores-regional/login`, body);
        return loginDirRegionalResponse;
      case "DIRECTOR_TECNICO":
        const loginDirTecnicoResponse = await sendPost(`${API_GESTION_INSPECCIONES_URL}/directores-tecnicos/login`, body);
        return loginDirTecnicoResponse;
      case "PROGRAMADOR_AGENDA":
        const loginProgramadorResponse = await sendPost(`${API_GESTION_INSPECCIONES_URL}/programador-agenda/login`, body);
        return loginProgramadorResponse;
        
      default:
        return null;
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
              {roles.map((role) => (
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
          <NavLink to={`${adminRootPath}${adminLoginPath}`}>
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
import React, { useState } from 'react';
import './admin.styles.css';
import { TextField, Button, Box } from '@mui/material';
import { API_GESTION_INSPECCIONES_URL } from '../../constants/apis';
import { sendGet, sendPost } from '../../services/apiRequests';
import { adminRegisterPath } from '../../constants/routes';
// MATERIAL UI COMPONENTS
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Swal from 'sweetalert2';
import { NavLink, useNavigate } from 'react-router-dom';
import CountrySelect from '../../components/CountrySelect';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [waiting, setWaiting] = useState(false);
  const [countryInfo, setCountryInfo] = useState({
    code: "",
    label: "",
    phone: ""
  });
  const [loginData, setLoginData] = useState({
    email:'',
    numeroDocumento: '',
    password: '',
    privateKey: '',
    secret: '',
    country: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [event.target.name]: event.target.value
    });
  };

  const getCountry = (countrySelected:{
    code: string,
    label: string,
    phone: string
  }) => {
    setCountryInfo(countrySelected);
    setLoginData({
      ...loginData,
      country: countrySelected && countrySelected.label
    })
  }

  const handleLogin = async (form:React.FormEvent<HTMLFormElement>) => {
    form.preventDefault();
    setWaiting(true);

    try {
      const loginResponse:{authenticationSuccess:boolean, jwtToken:string|null, userInfo:any|null, authInfo:string|null} = await sendPost(`${API_GESTION_INSPECCIONES_URL}/admin/login`, loginData);

      if(loginResponse && loginResponse.authenticationSuccess && loginResponse.jwtToken && loginResponse.userInfo){
        setWaiting(false);
      }
      else if (!loginResponse.authenticationSuccess && loginResponse.userInfo){
        setWaiting(false);
        
        if(loginResponse.userInfo.status == "PENDING_APROVAL"){
          Swal.fire({
            title: 'Pendiente aprobación',
            text: `El usuario está pendiente de aprobación para acceder a la aplicación, favor contactarse con el administrador`,
            icon: 'info',
          })
        }
        else{
          Swal.fire({
            title: 'Credenciales erróneas',
            text: `${loginResponse && loginResponse.authInfo}`,
            icon: 'error',
          })
        }
      }
      else{
        setWaiting(false);
        Swal.fire({
          title: 'Usuario no registrado',
          text: `${loginResponse && loginResponse.authInfo}`,
          icon: 'error',
          confirmButtonText: "Ir a registro admin"
        })
        .then(option => {
          if(option.isConfirmed){
            navigate(`../${adminRegisterPath}`);
          }
        })
      }
    } 
    catch (error) {
      setWaiting(false);
      Swal.fire({
        title: 'Error al comunicarse con el servidor',
        text: `No se pudo enviar la solicitud, favor revisar su conexión a internet e intentarlo mas tarde.`,
        icon: 'error',
      })
    }   
  };

  return (
    <main className="loginAdmincontainer">
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
        <form onSubmit={handleLogin} className='adminLoginForm'>
          <h2>Login admin</h2>
          <TextField
            name='email'
            label="Email"
            variant="outlined"
            margin="normal"
            fullWidth
            type='email'
            value={loginData.email}
            onChange={handleChange}
            required
          />
          <TextField
            name='numeroDocumento'
            label="Número de documento"
            variant="outlined"
            margin="normal"
            fullWidth
            type='number'
            value={loginData.numeroDocumento}
            onChange={handleChange}
            required
          />
          <TextField
            name='password'
            label="Password"
            variant="outlined"
            margin="normal"
            fullWidth
            type="password"
            value={loginData.password}
            onChange={handleChange}
            required
          />
          <TextField
            name='privateKey'
            label="Private key"
            variant="outlined"
            margin="normal"
            fullWidth
            type="password"
            value={loginData.privateKey}
            onChange={handleChange}
            required
          />
          <TextField
            name='secret'
            label="Secret"
            variant="outlined"
            margin="normal"
            fullWidth
            type="password"
            value={loginData.secret}
            onChange={handleChange}
            required
          />
          <CountrySelect onChange={getCountry} required={true} margin={"16px 0px 8px 0px"}/>

          <Button type="submit" variant="outlined" color="primary" sx={{ mt: 2 }}>
            Iniciar sesión
          </Button>
        </form>

        <section className='adminSection'>
          <p>¿Aún no estas registrado?</p>
          <NavLink to={`../${adminRegisterPath}`}>
            Ir a registro
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
  )
}

export default AdminLogin
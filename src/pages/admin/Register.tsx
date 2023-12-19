import React, {useState} from 'react';
import { TextField, Button, Box, Grid, Container, InputAdornment } from '@mui/material';
import { API_GESTION_INSPECCIONES_URL } from '../../constants/apis';
import { sendGet, sendPost } from '../../services/apiRequests';
import { adminRegisterPath } from '../../constants/routes';
// MATERIAL UI COMPONENTS
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Swal from 'sweetalert2';
import { NavLink } from 'react-router-dom';
import CountrySelect from '../../components/CountrySelect';

const AdminRegister = () => {
  const [waiting, setWaiting] = useState(false);
  const [countryInfo, setCountryInfo] = useState({
    code: "",
    label: "",
    phone: ""
  });
  const [registerData, setLoginData] = useState({
    nombres: '',
    apellidos: '',
    numeroDocumento: '',
    email:'',
    password: '',
    country: '',
    telefono:'',
    companyName:'',
    companyId: '', //companyId es el mismo NIT
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;

    setLoginData({
      ...registerData,
      [name]: value
    });
  };

  const getCountry = (countrySelected:{
    code: string,
    label: string,
    phone: string
  }) => {
    setCountryInfo(countrySelected);
    setLoginData({
      ...registerData,
      country: countrySelected && countrySelected.label
    })
  }

  const handleRegister = async (form:React.FormEvent<HTMLFormElement>) => {
    form.preventDefault();
    setWaiting(true);

    registerData.telefono = countryInfo + registerData.telefono;

    const registerResponse = await sendPost(`${API_GESTION_INSPECCIONES_URL}/admin/register`, registerData);

    if(registerResponse && registerResponse.response && registerResponse.status && !registerResponse.userAlreadyExists){
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

  return (
    <main className="registerAdmincontainer">
      <Container maxWidth="lg">
        <form onSubmit={handleRegister} className='registerForm'>
          <Grid container spacing={2} sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-evenly',
            }}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{display:"flex", alignItems:"center", justifyContent:"center"}}>
              <h2>Registro admin</h2>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
              <TextField
                name='nombres'
                label="Nombres"
                variant="outlined"
                margin="normal"
                fullWidth
                type='text'
                value={registerData.nombres}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
              <TextField
                name='apellidos'
                label="Apellidos"
                variant="outlined"
                margin="normal"
                fullWidth
                type='text'
                value={registerData.apellidos}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
              <TextField
                name='numeroDocumento'
                label="Número de documento"
                variant="outlined"
                margin="normal"
                fullWidth
                type='number'
                value={registerData.numeroDocumento}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
              <TextField
                name='email'
                label="Email"
                variant="outlined"
                margin="normal"
                fullWidth
                type='email'
                value={registerData.email}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
              <TextField
                name='password'
                label="Password"
                variant="outlined"
                margin="normal"
                fullWidth
                type="password"
                value={registerData.password}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
              <CountrySelect onChange={getCountry} required={true} margin={"16px 0px 8px 0px"}/>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
              <TextField
                name='telefono'
                label="Telefono o celular"
                variant="outlined"
                margin="normal"
                fullWidth
                type='tel'
                value={registerData.telefono}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">{countryInfo && `+${countryInfo.phone}`}</InputAdornment>,
                }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
              <TextField
                name='companyName'
                label="Nombre de la empresa"
                variant="outlined"
                margin="normal"
                fullWidth
                type='text'
                value={registerData.companyName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
              <TextField
                name='companyId'
                label="NIT de la empresa"
                variant="outlined"
                margin="normal"
                fullWidth
                type='text'
                value={registerData.companyId}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{display:"flex", alignItems:"center", justifyContent:"center"}}>
              <Button type="submit" variant="outlined" color="primary" sx={{ mt: 2 }} size='large'>
                Registrar
              </Button>
            </Grid>
          </Grid>
        </form>

        <section className='adminSection'>
          <p>¿Ya estas registrado?</p>
          <NavLink to={`../${adminRegisterPath}`}>
            Ir a Login
          </NavLink>
        </section>
      </Container>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={waiting}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </main>
  )
}

export default AdminRegister
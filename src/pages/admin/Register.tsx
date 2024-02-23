import React, {useState} from 'react';
import { TextField, Button, Grid, Container, InputAdornment, FormControl, InputLabel, OutlinedInput, IconButton, Popover, Typography } from '@mui/material';
import { API_GESTION_INSPECCIONES_URL } from '../../constants/apis';
import { sendPost } from '../../services/apiRequests';
import { adminLoginPath } from '../../constants/routes';
// MATERIAL UI COMPONENTS
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Swal from 'sweetalert2';
import { NavLink, useNavigate } from 'react-router-dom';
import CountrySelect from '../../components/customComponents/CountrySelect';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const AdminRegister = () => {
  const navigate = useNavigate();
  const [waiting, setWaiting] = useState(false);
  const [countryInfo, setCountryInfo] = useState({
    code: "",
    label: "",
    phone: ""
  });
  const [registerData, setRegisterData] = useState({
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
  const [showPassword, setShowPassword] = useState(false);
  const [validatePass, setValidatePass] = useState("");
  const [showValidatePassword, setShowValidatePassword] = useState(false);
  const [samePass, setSamePass] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClickPopOver = (event: React.MouseEvent<HTMLButtonElement>) => {
    if(!samePass){
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClosePopOver = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;


  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleClickShowValidatePassword = () => setShowValidatePassword((show) => !show);
  const handleMouseDownValidatePassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const validateSamePass = (name:string, value:string) => {
    if(name === "validatePass"){
      setValidatePass(value);
      if(value === registerData.password){
        setSamePass(true);
      }
      else{
        setSamePass(false);
      }
    }
    else if (name == "password"){
      if(value == validatePass){
        setSamePass(true);
      }
      else{
        setSamePass(false);
      }
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;

    if(name == "validatePass" || name == "password"){
      validateSamePass(name, value);
    }

    setRegisterData({
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
    setRegisterData({
      ...registerData,
      country: countrySelected && countrySelected.label
    })
  }

  const handleRegister = async (form:React.FormEvent<HTMLFormElement>) => {
    form.preventDefault();
    setWaiting(true);

    if(samePass){
      try {
        const registerResponse = await sendPost(`${API_GESTION_INSPECCIONES_URL}/admin/register`, registerData);
    
        if (registerResponse && registerResponse.response && registerResponse.status && !registerResponse.userAlreadyExists){
          setWaiting(false);
          Swal.fire({
            title: 'Registro exitoso',
            text: `La solicitud de registro se radicó exitosamente. Después de la revisión se enviará una respuesta al correo ${registerResponse.response.email}.`,
            icon: 'success',
          })
          .then(() => {
            setValidatePass("");
            setCountryInfo({
              code: "",
              label: "",
              phone: ""
            });
            setRegisterData({
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
          })
        }
        else if (registerResponse.userAlreadyExists){
          setWaiting(false);
          Swal.fire({
            title: 'El usuario ya existe',
            text: `No se pudo registrar el usuario con documento número ${registerData.numeroDocumento}, porque ya existe.`,
            icon: 'info',
            confirmButtonText: "Ir al admin login"
          })
          .then(option => {
            if(option.isConfirmed){
              navigate(`../${adminLoginPath}`);
            }
          })
        }
        else{
          setWaiting(false);
          Swal.fire({
            title: 'No se pudo solicitar el registro',
            text: ``,
            icon: 'error',
          })
        }
      } 
      catch (error) {
        setWaiting(false);
          Swal.fire({
            title: 'Error de comunicación con el servidor',
            text: ``,
            icon: 'error',
          })
      }
    }
    else{
      setWaiting(false);
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
              <FormControl variant="outlined" margin='normal' fullWidth required>
                <InputLabel htmlFor="password">Password</InputLabel>
                <OutlinedInput
                  required
                  name='password'
                  id="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={registerData.password}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
              <FormControl variant="outlined" margin='normal' fullWidth required error={!samePass && validatePass.length > 0}>
                <InputLabel htmlFor="validate-password">Validate password</InputLabel>
                <OutlinedInput
                  required
                  name='validatePass'
                  id="validate-password"
                  label="Validate password"
                  type={showValidatePassword ? 'text' : 'password'}
                  value={validatePass}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowValidatePassword}
                        onMouseDown={handleMouseDownValidatePassword}
                        edge="end"
                      >
                        {showValidatePassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
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
              <Button type="submit" variant="outlined" color="primary" sx={{ mt: 2 }} size='large' onClick={handleClickPopOver}>
                Registrar
              </Button>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClosePopOver}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <Typography sx={{ p: 2 }}>Por favor validar la información</Typography>
              </Popover>
            </Grid>
          </Grid>
        </form>

        <section className='adminSection'>
          <p>¿Ya estas registrado?</p>
          <NavLink to={`../${adminLoginPath}`}>
            Ir al admin Login
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
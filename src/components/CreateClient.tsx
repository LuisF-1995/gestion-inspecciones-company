import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUserRoles } from '../constants/globalConstants';
import { sendPost } from '../services/apiRequests';
import { API_GESTION_INSPECCIONES_URL, CUSTOMERS } from '../constants/apis';
import { green } from '@mui/material/colors';
import { Box, Button, CircularProgress, Container, FormControl, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import CustomSnackbar from './customComponents/CustomSnackbar';
import { ICustomer } from './Interfaces';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const CreateCustomer = () => {
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState<ICustomer>(
    {
      id: null,
      nombre: "",
      telefono: "",
      email: "",
      password: "",
      proyectosCliente: [],
      rol: apiUserRoles.cliente,
    }
  );
  const [savingDataInfo, setSavingDataInfo] = useState<{saving:boolean, success?:boolean, info?:string, openNotification:boolean}>({
    saving: false,
    success: false,
    info: "",
    openNotification: false
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;

    setCustomerData({
      ...customerData,
      [name]: value
    });
  };

  const addCustomer = async (form:React.FormEvent<HTMLFormElement>) => {
    form.preventDefault();
    setSavingDataInfo({saving:true, openNotification:false});

    try {
      const addCustomerResponse = await sendPost(`${API_GESTION_INSPECCIONES_URL}/${CUSTOMERS}/register`, customerData);

      if(addCustomerResponse && addCustomerResponse.authenticationSuccess){
        setSavingDataInfo({saving:false, openNotification:true, success:true, info:`Cliente registrado!!`});
        setCustomerData({
          id: null,
          nombre: "",
          telefono: "",
          email: "",
          password: "",
          proyectosCliente: [],
          rol: "",
        });
      }
      else if (addCustomerResponse && !addCustomerResponse.authenticationSuccess){
        setSavingDataInfo({saving:false, openNotification:true, success:false, info: addCustomerResponse.authInfo});
      }
      else if(addCustomerResponse.response && addCustomerResponse.response.status && addCustomerResponse.response.status !== 200){
        setSavingDataInfo({saving:false, openNotification:true, success:false, info:"No se pudo registrar el cliente"});
      }
    } 
    catch (error) {
      setSavingDataInfo({saving:false, openNotification:true, success: false, info:"Error de conexión con el servidor!!" });
      console.error(error);
    }
  };

  const handleCloseSnackbar = () => {
    setSavingDataInfo({
      ...savingDataInfo,
      openNotification: false
    });
  };

  return (
    <Container maxWidth="xl" sx={{ m:"10px 0px" }}>
      <form onSubmit={addCustomer} className='addUsersForm'>
        <Grid container spacing={2} sx={{display: 'flex', alignItems: 'center', m:0, p:0}}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{display:"flex", alignItems:"center", justifyContent:"center"}}>
            <h2>Registrar Cliente</h2>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
            <TextField
              name='nombre'
              label="Nombre cliente"
              variant="outlined"
              margin="normal"
              fullWidth
              type='text'
              value={customerData.nombre}
              onChange={handleChange}
              required
              disabled={savingDataInfo.saving}
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
              value={customerData.email}
              onChange={handleChange}
              required
              disabled={savingDataInfo.saving}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
            <FormControl variant="outlined" margin='normal' fullWidth>
              <InputLabel htmlFor="password">Contraseña</InputLabel>
              <OutlinedInput
                name='password'
                id="password"
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                value={customerData.password}
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
            <TextField
              name='telefono'
              label="Teléfono"
              variant="outlined"
              margin="normal"
              fullWidth
              type='tel'
              value={customerData.telefono}
              onChange={handleChange}
              disabled={savingDataInfo.saving}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{display:"flex", alignItems:"center", justifyContent:"center"}}>
            <Box sx={{ m: 1, position: 'relative' }}>
              <Button
                variant="outlined"
                type="submit"
                color="primary"
                size='large'
                disabled={savingDataInfo.saving}
                startIcon={<PersonAddRoundedIcon/>}
              >
                Registrar cliente
              </Button>
              {savingDataInfo.saving && (
                <CircularProgress
                  size={24}
                  sx={{
                    color: green[500],
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                  }}
                />
              )}
            </Box>
          </Grid>
        </Grid>
      </form>
      <CustomSnackbar 
        open={savingDataInfo.openNotification}
        onClose={handleCloseSnackbar}
        horizontal={'center'}
        vertical={'bottom'}
        message={savingDataInfo.info}
        autoHideTime={5000}
        alertType={savingDataInfo.success ? 'success' : 'error'}
        variant='standard'
      />
    </Container>
  )
}

export default CreateCustomer
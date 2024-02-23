import React, { useEffect, useState } from 'react';
import './adminComponentsStyles.css';
import { API_GESTION_INSPECCIONES_URL, COMMERCIAL_ADVISORS, INSPECTORS, REGIONAL_DIRECTORS, SCHEDULE_PROGRAMMERS, TECHNICAL_DIRECTORS } from '../../constants/apis';
import { getUserRoles } from '../../services/globalFunctions';
import { useNavigate } from 'react-router-dom';
import { sendGet, sendPost } from '../../services/apiRequests';
import Swal from 'sweetalert2';
import { IUserApiData } from '../Interfaces';
import { apiUserRoles, localAdminTokenKeyName } from '../../constants/globalConstants';
// MATERIAL UI COMPONENTS
import { TextField, Button, Grid, Container, InputAdornment, FormControl, InputLabel, OutlinedInput, IconButton, Popover, Typography, Select, MenuItem, Autocomplete, Box } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Visibility, VisibilityOff } from '@mui/icons-material';


const AddUser = () => {
  const navigate = useNavigate();
  const [waiting, setWaiting] = useState(false);
  const [openRegionalsSelector, setOpenRegionalsSelector] = useState(false);
  const [regionalsOpt, setRegionalsOpt] = useState([]);
  const loadingRegionals = openRegionalsSelector && regionalsOpt.length === 0;
  const [userRoles, setUserRoles] = useState([]);
  const [token, setToken] = useState("");
  const [userData, setUserData] = useState<IUserApiData>({
    nombres: '',
    apellidos: '',
    email:'',
    password: '',
    telefono:'',
    regional: undefined,
    rol:''
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!loadingRegionals) {
      return undefined;
    }

    (async () => {
      await getRegionalsInfo(token);
    })();

  }, [loadingRegionals]);

  useEffect(() => {
    getUserRolesArray();
    if(sessionStorage.length > 0){
      const sessionToken:string = sessionStorage.getItem(localAdminTokenKeyName);
      setToken(sessionToken);
    }
  }, [])

  const getRegionalsInfo = async(jwtToken:string) => {
    if(jwtToken && jwtToken.length > 0){
      try {
        const regionalsInfo = await sendGet(`${API_GESTION_INSPECCIONES_URL}/regionales`, jwtToken);
        setWaiting(false);

        if(regionalsInfo && regionalsInfo.status === 200 && regionalsInfo.data){
          const regionalsData:any[] = regionalsInfo.data;
          const regionalDataArray = regionalsData.map(regional => ({
            ...regional,
            directorRegional: regional.directorRegional === null || regional.directorRegional === undefined ? "" : regional.directorRegional
          }));
          setRegionalsOpt(regionalDataArray);
        }
      } 
      catch (error) {
        setWaiting(false);
        sessionStorage.clear();
      }
    }
  }

  const getUserRolesArray = async() => {
    const roles = await getUserRoles();
    setUserRoles(roles);
  }
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;

    setUserData({
      ...userData,
      [name]: value
    });
  }

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const addUser = async(form:React.FormEvent<HTMLFormElement>) => {
    form.preventDefault();
    setWaiting(true);

    try{
      const userRegistrationResponse:IUserApiData|any|null = await registerUserByRol(userData.rol, userData);
      setWaiting(false);

      if(userRegistrationResponse && userRegistrationResponse.nombres != undefined){
        Swal.fire({
          title: "Registro exitoso",
          text: `El usuario ${userRegistrationResponse.nombres} se registró exitosamente para el rol de ${userRegistrationResponse.rol}`,
          icon: 'success'
        })
        .then(() => {
          setUserData({
            nombres: '',
            apellidos: '',
            email:'',
            password: '',
            telefono:'',
            regional: undefined,
            rol:''
          });
        })
      }
      else if(userRegistrationResponse.response.status != 200){
        Swal.fire({
          title: "Ha ocurrido un error",
          text: `No se pudo registrar al usuario, favor validar que el usuario no exista en el mismo Rol`,
          icon: 'error'
        })
      }
    }
    catch(rejected){
      setWaiting(false);
      Swal.fire({
        title: "Error de conexión",
        text: `No se pudo registrar al usuario, verificar conexión a internet o comunicate con nosotros.`,
        icon: 'error'
      })
    }
  }

  const registerUserByRol = async(rol:string, body:IUserApiData) => {
    switch (rol) {
      case apiUserRoles.inspector:
        const inspectorResponse = await sendPost(`${API_GESTION_INSPECCIONES_URL}/${INSPECTORS}/register`, body, token);
        return inspectorResponse;
      case apiUserRoles.asesorComercial:
        const asesorResponse = await sendPost(`${API_GESTION_INSPECCIONES_URL}/${COMMERCIAL_ADVISORS}/register`, body, token);
        return asesorResponse;
      case apiUserRoles.directorRegional:
        const dirRegionalResponse = await sendPost(`${API_GESTION_INSPECCIONES_URL}/${REGIONAL_DIRECTORS}/register`, body, token);
        return dirRegionalResponse;
      case apiUserRoles.directorTecnico:
        const dirTecnicoResponse = await sendPost(`${API_GESTION_INSPECCIONES_URL}/${TECHNICAL_DIRECTORS}/register`, body, token);
        return dirTecnicoResponse;
      case apiUserRoles.programadorAgenda:
        delete body.regional;
        const programadorAgendaResponse = await sendPost(`${API_GESTION_INSPECCIONES_URL}/${SCHEDULE_PROGRAMMERS}/register`, body, token);
        return programadorAgendaResponse;
        
      default:
        return null;
    }
  }

  return (
    <main className="addUserContainer">
      <Container maxWidth="lg">
        <form onSubmit={addUser} className='addUsersForm'>
          <Grid container spacing={2} sx={{
              display: 'flex',
              alignItems: 'center',
              m:0, p:0
            }}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{display:"flex", alignItems:"center", justifyContent:"center"}}>
              <h2>Registro usuario</h2>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
              <TextField
                name='nombres'
                label="Nombres"
                variant="outlined"
                margin="normal"
                fullWidth
                type='text'
                value={userData.nombres}
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
                value={userData.apellidos}
                onChange={handleChange}
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
                value={userData.email}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
              <FormControl variant="outlined" margin="normal" fullWidth>
                <InputLabel>Rol</InputLabel>
                <Select
                  name='rol'
                  value={userData.rol}
                  onChange={handleChange}
                  label="Rol"
                  required
                >
                  {userRoles && userRoles.length > 0 && userRoles.map((rol:string) => (
                    <MenuItem key={rol} value={rol}>
                      {rol && rol.length > 0 ? rol.replace("_", " ") : ""}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {userData.rol !== apiUserRoles.programadorAgenda &&
              <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
                <Autocomplete
                  fullWidth
                  open={openRegionalsSelector}
                  onOpen={() => {setOpenRegionalsSelector(true);}}
                  onClose={() => {setOpenRegionalsSelector(false);}}
                  value={userData.regional}
                  onChange={(event: any, newValue:{ciudad:string; id:number}|null) => {
                    setUserData({
                      ...userData,
                      regional: newValue && newValue.id ? newValue.id : undefined
                    });
                  }}
                  id="set-regional"
                  autoHighlight
                  options={regionalsOpt}
                  getOptionLabel={(option) => option && option.ciudad}
                  renderOption={(props, option) => (
                    <Box key={option.id} component="li" {...props}>
                      {option.ciudad}
                    </Box>
                  )}
                  loading={loadingRegionals}
                  renderInput={(params) => 
                    <TextField 
                      {...params}
                      margin='normal'
                      required 
                      label="Regional" 
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {loadingRegionals ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                    />
                  }
                />
              </Grid>
            }
            <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
              <FormControl variant="outlined" margin='normal' fullWidth required>
                <InputLabel htmlFor="password">Password</InputLabel>
                <OutlinedInput
                  required
                  name='password'
                  id="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={userData.password}
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
                label="Telefono o celular"
                variant="outlined"
                margin="normal"
                fullWidth
                type='tel'
                value={userData.telefono}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{display:"flex", alignItems:"center", justifyContent:"center"}}>
              <Button type="submit" variant="outlined" color="primary" sx={{ mt: 2 }} size='large'>
                Agregar usuario
              </Button>
            </Grid>
          </Grid>
        </form>
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

export default AddUser;
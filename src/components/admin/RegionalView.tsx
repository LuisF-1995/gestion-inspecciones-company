import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Backdrop, Button, Card, CardActions, CardContent, CircularProgress, Container, Divider, Grid, List, ListItem, ListItemText, Paper, ThemeProvider, Typography, createTheme, styled } from '@mui/material';
import { localTokenKeyName } from '../../constants/globalConstants';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { adminLoginPath } from '../../constants/routes';
import { sendGet } from '../../services/apiRequests';
import { API_GESTION_INSPECCIONES_URL } from '../../constants/apis';
import { IInspector, IRegionalApiData, IUserApiData } from '../Interfaces';

const darkTheme = createTheme({
  palette: {
      mode: 'dark',
      primary: {
      main: '#1976d2',
      },
  },
});

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const RegionalView = (props:{regionalId:string|number}) => {
  const navigate = useNavigate();
  const [regionalInfo, setRegionalInfo] = useState<IRegionalApiData>(null);
  const [token, setToken] = useState("");
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    if(sessionStorage.length > 0){
      const jwtToken:string = sessionStorage.getItem(localTokenKeyName);
      setToken(jwtToken);

      if(props.regionalId && props.regionalId != undefined)
        getRegionalInfoById(props.regionalId, jwtToken);
    }
    else{
      setWaiting(false);
      Swal.fire({
        title: 'Expiró la sesión',
        text: `La sesión expiró, debe volver a iniciar sesión`,
        icon: 'info',
        confirmButtonText: "Iniciar sesión"
      })
      .then(option => {
        if(option.isConfirmed){
          Swal.close();
          navigate(`../${adminLoginPath}`);
        }
        else
          setTimeout(() => {
            Swal.close();
            navigate(`../${adminLoginPath}`);
          }, 5000);
      })
    }
  }, [props.regionalId])

  const getRegionalInfoById = async (idRegional:string|number, jwtToken:string) => {
    setWaiting(true);

    if(jwtToken){
      try {
        const regionalInfo = await sendGet(`${API_GESTION_INSPECCIONES_URL}/regionales/id/${idRegional}`, jwtToken);
        setWaiting(false);

        if(regionalInfo && regionalInfo.status === 200 && regionalInfo.data){
          const regionalData = regionalInfo.data;
          setRegionalInfo(regionalData);
        }
      }
      catch (error) {
        setWaiting(false);
        sessionStorage.clear();
      }
    }
  }

  return (
    <Container maxWidth="xl" sx={{ m:0, p:0 }}>
      <h3 style={{margin:"10px 0px", textAlign:"center"}}>Gestionar {regionalInfo && regionalInfo.ciudad ? `regional ${regionalInfo.ciudad}` : "regionales"}</h3>
      <Grid container spacing={2} mt={2}>
        <Grid item xs={12} md={12} lg={12} xl={12}>
          <Typography variant="h5" component="div" mb={1}>
            Regional {regionalInfo && regionalInfo.ciudad}
          </Typography>
          <Typography sx={{ mb: 1 }} >
            Dirección: {regionalInfo && regionalInfo.direccion ? regionalInfo.direccion : "No registra"}
          </Typography>
          <Typography >
            Teléfono: {regionalInfo && regionalInfo.telefono ? regionalInfo.telefono : "No registra"}
          </Typography>

          <Divider variant="fullWidth" sx={{mb:1, mt:1}}></Divider>

          <Typography variant="h5" component="div" mb={1}>
            Director de regional
          </Typography>
          <Typography sx={{ mb: 1 }} >
            Nombre completo: {regionalInfo && regionalInfo.directorRegional && regionalInfo.directorRegional.nombres ? regionalInfo.directorRegional.nombres : "No registra"} {regionalInfo && regionalInfo.directorRegional && regionalInfo.directorRegional.apellidos ? regionalInfo.directorRegional.apellidos : "No registra"}
          </Typography>
          <Typography sx={{ mb: 1 }} >
            Email: {regionalInfo && regionalInfo.directorRegional && regionalInfo.directorRegional.email ? regionalInfo.directorRegional.email : "No registra"}
          </Typography>
          <Typography sx={{ mb: 1 }} >
            Teléfono: {regionalInfo && regionalInfo.directorRegional && regionalInfo.directorRegional.telefono ? regionalInfo.directorRegional.telefono : "No registra"}
          </Typography>
        </Grid>
        <ThemeProvider theme={darkTheme}>
          <Grid item xs={12} md={6} lg={6} xl={6} >
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h5" component="div">
                  Asesores comerciales
                </Typography>
                <List dense={true} sx={{maxHeight:"60vh", overflow:"auto"}}>
                  {regionalInfo && regionalInfo.asesoresComerciales.length > 0 &&
                    regionalInfo.asesoresComerciales.map((asesor:IUserApiData, index:number) => {
                      if(index + 1 === regionalInfo.asesoresComerciales.length)
                        return(
                          <ListItem key={asesor.id}>
                            <ListItemText
                              primary={`${asesor.nombres ? asesor.nombres : ""} ${asesor.apellidos ? asesor.apellidos : ""}`}
                              secondary={`${asesor.email ? asesor.email : "Sin email"} - ${asesor.telefono ? asesor.telefono : "Sin teléfono"}`}
                            />
                          </ListItem>
                        );
                      else
                        return(
                          <div key={asesor.id}>
                          <ListItem>
                            <ListItemText
                              primary={`${asesor.nombres ? asesor.nombres : ""} ${asesor.apellidos ? asesor.apellidos : ""}`}
                              secondary={`${asesor.email ? asesor.email : "Sin email"} - ${asesor.telefono ? asesor.telefono : "Sin teléfono"}`}
                            />
                          </ListItem>
                          <Divider variant="middle" sx={{mb:1, mt:1}}></Divider>
                          </div>
                        );
                    })
                  }
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={6} xl={6} >
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h5" component="div">
                  Inspectores
                </Typography>
                <List dense={true} sx={{maxHeight:"60vh", overflow:"auto"}}>
                  {regionalInfo && regionalInfo.inspectores.length > 0 &&
                    regionalInfo.inspectores.map((inspector:IInspector, index:number) => {
                      if(index + 1 === regionalInfo.inspectores.length)
                        return(
                          <ListItem key={inspector.id}>
                            <ListItemText
                              primary={`${inspector.nombres ? inspector.nombres : ""} ${inspector.apellidos ? inspector.apellidos : ""}`}
                              secondary={`${inspector.email ? inspector.email : "Sin email"} - ${inspector.telefono ? inspector.telefono : "Sin teléfono"}`}
                            />
                          </ListItem>
                        );
                      else
                        return(
                          <div key={inspector.id}>
                            <ListItem >
                              <ListItemText
                                primary={`${inspector.nombres ? inspector.nombres : ""} ${inspector.apellidos ? inspector.apellidos : ""}`}
                                secondary={`${inspector.email ? inspector.email : "Sin email"} - ${inspector.telefono ? inspector.telefono : "Sin teléfono"}`}
                              />
                            </ListItem>
                            <Divider variant="middle" sx={{mb:1, mt:1}}></Divider>
                          </div>
                        );
                    })
                  }
                </List>
              </CardContent>
            </Card>
          </Grid>
        </ThemeProvider>
      </Grid>
      <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={waiting}
      >
          <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  )
}

RegionalView.propTypes = {}

export default RegionalView
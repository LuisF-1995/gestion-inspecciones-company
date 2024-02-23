import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { IInspector, IRegionalApiData, IUserApiData } from '../Interfaces';
import { localAdminTokenKeyName } from '../../constants/globalConstants';
import { adminLoginPath } from '../../constants/routes';
import { API_GESTION_INSPECCIONES_URL, REGIONALS } from '../../constants/apis';
import { sendGet, sendPut } from '../../services/apiRequests';
import CustomSnackbar from '../CustomSnackbar';
import Swal from 'sweetalert2';
import { green, red } from '@mui/material/colors';
import { Backdrop, Box, Button, Card, CardActions, CardContent, CircularProgress, Container, Divider, Fab, Grid, IconButton, List, ListItem, ListItemText, Paper, TextField, ThemeProvider, Tooltip, Typography, Zoom, createTheme, styled } from '@mui/material';
import SpellcheckRoundedIcon from '@mui/icons-material/SpellcheckRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';

const darkTheme = createTheme({
  palette: {
      mode: 'dark',
      primary: {
      main: '#1976d2',
      },
  },
});

const lightTheme = createTheme({
  palette: {
    mode:'light',
    primary: {
      main: '#1976d2',
    },
  },
});


const RegionalView = (props:{regionalId:string|number}) => {
  const navigate = useNavigate();
  const [regionalInfo, setRegionalInfo] = useState<IRegionalApiData>(null);
  const [token, setToken] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [infoEditWaiting, setInfoEditWaiting] = useState(false);
  const [infoToEdit, setInfoToEdit] = useState("");
  const [snackBarInfo, setSnackbarInfo] = useState<{open:boolean, message:string, alertType:"success"|"info"|"warning"|"error", variant:"filled" | "standard" | "outlined"}>({
    open: false,
    message: "",
    alertType: "info",
    variant: "standard"
  });

  const handleCloseSnackbar = () => {
    setSnackbarInfo({
      ...snackBarInfo,
      open: false
    });
  };

  useEffect(() => {
    if(sessionStorage.length > 0){
      const jwtToken:string = sessionStorage.getItem(localAdminTokenKeyName);
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
          navigate(`../../../${adminLoginPath}`);
        }
        else
          setTimeout(() => {
            Swal.close();
            navigate(`../../../${adminLoginPath}`);
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
  };

  const editInfo = (event: any) => {
    if(event){
      setInfoToEdit(event.target.id);
    }
    else
      setInfoToEdit("");
  };

  const handleRegionalInfoEdit = (changeEvent:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = changeEvent ? changeEvent.target.name : "";
    const value = changeEvent ? changeEvent.target.value : "";

    if(name && name.length > 0)
      setRegionalInfo({
        ...regionalInfo,
        [name]: value
      });
  }

  const updateRegionalInfo = async () => {
    setInfoEditWaiting(true);

    if(sessionStorage.length > 0){
      const jwtToken:string = sessionStorage.getItem(localAdminTokenKeyName);
      if(jwtToken.length > 0){
        try {
          const regionalUpdate = { ...regionalInfo };
          delete regionalUpdate.asesoresComerciales;
          delete regionalUpdate.inspectores;
          delete regionalUpdate.directorRegional;

          const regionalUpdateResponse = await sendPut(`${API_GESTION_INSPECCIONES_URL}/${REGIONALS}/update`, regionalUpdate, jwtToken);
          if(regionalUpdateResponse){
            setSnackbarInfo({
              open: true,
              message: "Información de regional actualizada",
              alertType:"success",
              variant: "standard"
            });
            setInfoEditWaiting(false);
            editInfo(null);
          }
        } 
        catch (error) {
          console.error(error);
        }
      }
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
          navigate(`../../../${adminLoginPath}`);
        }
        else
          setTimeout(() => {
            Swal.close();
            navigate(`../../../${adminLoginPath}`);
          }, 5000);
      })
    }
  };

  return (
    <Container maxWidth="xl" sx={{ m:0, p:0 }}>
      <h3 style={{margin:"10px 0px", textAlign:"center"}}>Gestionar {regionalInfo && regionalInfo.ciudad ? `regional ${regionalInfo.ciudad}` : "regionales"}</h3>
      <Grid container spacing={2} mt={2}>
        <Grid item xs={12} md={12} lg={12} xl={12}>
          <Typography variant="h5" component="div" mb={1}>
            Regional {regionalInfo && regionalInfo.ciudad}
          </Typography>
          
          {infoToEdit.length > 0 && infoToEdit === "regionalAddress" ?
            <div style={{display:"flex", alignItems:"center", gap:5}}>
              <TextField 
                type='text' 
                name="direccion" 
                id="regionalEdit" 
                label="Dirección" 
                variant="outlined" 
                value={regionalInfo.direccion ? regionalInfo.direccion : ""} 
                onChange={handleRegionalInfoEdit} 
                disabled={infoEditWaiting}
              />
              <Tooltip title="Guardar">
                <Box sx={{ position: 'relative' }} >
                  <Fab
                    onClick={updateRegionalInfo}
                    disabled={infoEditWaiting}
                    aria-label="save"
                    color="info"
                    sx={{
                      ...(infoEditWaiting && {
                        bgcolor: green[500],
                        '&:hover': {
                          bgcolor: green[800],
                        },
                      }),
                    }}
                  >
                    {infoEditWaiting ? <CheckIcon /> : <SaveIcon />}
                  </Fab>
                  {infoEditWaiting && (
                    <CircularProgress
                      size={68}
                      sx={{
                        color: green[500],
                        position: 'absolute',
                        top: -6,
                        left: -6,
                        zIndex: 1,
                      }}
                    />
                  )}
                </Box>
              </Tooltip>
              <Tooltip title="Cancelar">
                <Box sx={{ position: 'relative' }} >
                  <Fab
                    onClick={() => editInfo(null)}
                    disabled={infoEditWaiting}
                    aria-label="cancel"
                    color="error"
                    sx={{
                      ...(infoEditWaiting && {
                        bgcolor: red[500],
                        '&:hover': {
                          bgcolor: red[700],
                        },
                      }),
                    }}
                  >
                    <CancelRoundedIcon />
                  </Fab>
                </Box>
              </Tooltip>
            </div>
            :
            <Tooltip 
              title="Editar dirección"
              TransitionComponent={Zoom}
              arrow
              followCursor
            >
              <Typography sx={{ mb: 1, flexShrink: 0 }} id="regionalAddress" onClick={editInfo} >
                Dirección: {regionalInfo && regionalInfo.direccion ? regionalInfo.direccion : "No registra"}
              </Typography>
            </Tooltip>
          }

          {infoToEdit.length > 0 && infoToEdit === "editPhone" ?
            <div style={{display:"flex", alignItems:"center", gap:5}}>
              <TextField type='tel' name="telefono" id="editPhone" label="Teléfono" variant="outlined" value={regionalInfo.telefono ? regionalInfo.telefono : ""} onChange={handleRegionalInfoEdit} />
              <Tooltip title="Guardar">
                <Box sx={{ position: 'relative' }} >
                  <Fab
                    onClick={updateRegionalInfo}
                    disabled={infoEditWaiting}
                    aria-label="save"
                    color="info"
                    sx={{
                      ...(infoEditWaiting && {
                        bgcolor: green[500],
                        '&:hover': {
                          bgcolor: green[800],
                        },
                      }),
                    }}
                  >
                    {infoEditWaiting ? <CheckIcon /> : <SaveIcon />}
                  </Fab>
                  {infoEditWaiting && (
                    <CircularProgress
                      size={68}
                      sx={{
                        color: green[500],
                        position: 'absolute',
                        top: -6,
                        left: -6,
                        zIndex: 1,
                      }}
                    />
                  )}
                </Box>
              </Tooltip>
              <Tooltip title="Cancelar">
                <Box sx={{ position: 'relative' }} >
                  <Fab
                    onClick={() => editInfo(null)}
                    disabled={infoEditWaiting}
                    aria-label="cancel"
                    color="error"
                    sx={{
                      ...(infoEditWaiting && {
                        bgcolor: red[500],
                        '&:hover': {
                          bgcolor: red[700],
                        },
                      }),
                    }}
                  >
                    <CancelRoundedIcon />
                  </Fab>
                </Box>
              </Tooltip>
            </div>
            :
            <Tooltip 
              title="Editar teléfono"
              TransitionComponent={Zoom}
              arrow
              followCursor
            >
              <Typography sx={{ mb: 1, flexShrink: 0 }} id="editPhone" onClick={editInfo} >
                Teléfono: {regionalInfo && regionalInfo.telefono ? regionalInfo.telefono : "No registra"}
              </Typography>
            </Tooltip>
          }

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
                  {regionalInfo && regionalInfo.asesoresComerciales && regionalInfo.asesoresComerciales.length > 0 &&
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
                  {regionalInfo && regionalInfo.inspectores && regionalInfo.inspectores.length > 0 &&
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
      
      <CustomSnackbar 
        open={snackBarInfo.open} 
        message={snackBarInfo.message} 
        horizontal={'center'} vertical={'bottom'} 
        autoHideTime={5000} 
        alertType={snackBarInfo.alertType} 
        variant={snackBarInfo.variant}
        onClose={handleCloseSnackbar}
      />
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
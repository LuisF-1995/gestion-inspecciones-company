import React, { useState } from 'react';
import { Alert, Box, Button, CircularProgress, Container, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { IProject } from './Interfaces';
import { localUserIdKeyName, localUserTokenKeyName } from '../constants/globalConstants';
import { sendPost } from '../services/apiRequests';
import { API_GESTION_INSPECCIONES_URL, PROJECTS } from '../constants/apis';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { green, red } from '@mui/material/colors';
import AddchartRoundedIcon from '@mui/icons-material/AddchartRounded';
import CloseIcon from '@mui/icons-material/Close';
import CustomSnackbar from './CustomSnackbar';

const CreateProject = () => {
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState<IProject>({
    nombreProyecto:"",
    alcance:"",
    direccionProyecto: "",
    visitasCotizadas: 0,
    estadoProyecto: "APROBADO",
    asesorComercial: {id: parseInt(localStorage.getItem(localUserIdKeyName))},
    tipoProyecto: ""
  });
  const [savingDataInfo, setSavingDataInfo] = useState<{saving:boolean, success?:boolean, info?:string, openNotification:boolean}>({
    saving: false,
    success: false,
    info: "",
    openNotification: false
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;

    setProjectData({
      ...projectData,
      [name]: value
    });
  }

  const addProject = async (form:React.FormEvent<HTMLFormElement>) => {
    form.preventDefault();

    if(localStorage.length > 0){
      setSavingDataInfo({saving:true, openNotification:false});
      projectData.visitasCotizadas = parseInt(projectData.visitasCotizadas.toString());
      const jwtToken = localStorage.getItem(localUserTokenKeyName);

      try {
        const addProjectResponse = await sendPost(`${API_GESTION_INSPECCIONES_URL}/${PROJECTS}/new`, projectData, jwtToken);
        
        if(addProjectResponse){
          setSavingDataInfo({saving:false, openNotification:true, success:true, info:`Proyecto registrado!!`});
          setProjectData(
            {
              nombreProyecto:"",
              alcance:"",
              direccionProyecto: "",
              visitasCotizadas: 0,
              estadoProyecto: "APROBADO",
              asesorComercial: {id: parseInt(localStorage.getItem(localUserIdKeyName))},
              tipoProyecto: ""
            }
          );
        }
        else{
          setSavingDataInfo({saving:false, openNotification:true, success:false, info:"No se pudo guardar el proyecto"});
        }
      } 
      catch (error) {
        setSavingDataInfo({saving:false, openNotification:true, success: false, info:"Error de conexión con el servidor!!" });
        console.error(error);
      }
    }
    else{
      Swal.fire({
        title: 'Expiró la sesión',
        text: `La sesión expiró, debe volver a iniciar sesión`,
        icon: 'info',
        confirmButtonText: "Iniciar sesión"
      })
      .then(option => {
        if(option.isConfirmed){
          Swal.close();
          navigate(`../../`);
        }
        else
          setTimeout(() => {
            Swal.close();
            navigate(`../../`);
          }, 5000);
      })
    }
  }

  const handleCloseSnackbar = () => {
    setSavingDataInfo({
      ...savingDataInfo,
      openNotification: false
    });
  };

  return (
    <Container maxWidth="xl" sx={{ m:"10px 0px" }}>
      <form onSubmit={addProject} className='addUsersForm'>
        <Grid container spacing={2} sx={{display: 'flex', alignItems: 'center', m:0, p:0}}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{display:"flex", alignItems:"center", justifyContent:"center"}}>
            <h2>Registrar Proyecto</h2>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
            <TextField
              name='nombreProyecto'
              label="Nombre proyecto"
              variant="outlined"
              margin="normal"
              fullWidth
              type='text'
              value={projectData.nombreProyecto}
              onChange={handleChange}
              required
              disabled={savingDataInfo.saving}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
            <FormControl variant="outlined" margin="normal" fullWidth disabled={savingDataInfo.saving} required>
              <InputLabel>Tipo de proyecto</InputLabel>
              <Select
                name='tipoProyecto'
                value={projectData.tipoProyecto}
                onChange={handleChange}
                label="Tipo de proyecto"
                type='text'
                placeholder='Seleccionar'
                required
                disabled={savingDataInfo.saving}
              >
                <MenuItem key={"RETIE"} value={"RETIE"}>
                  RETIE
                </MenuItem>
                <MenuItem key={"RETILAP"} value={"RETILAP"}>
                  RETILAP
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
            <TextField
              name='direccionProyecto'
              label="Dirección"
              variant="outlined"
              margin="normal"
              fullWidth
              type='string'
              value={projectData.direccionProyecto}
              onChange={handleChange}
              required
              disabled={savingDataInfo.saving}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
            <TextField
              name='visitasCotizadas'
              label="Número de visitas"
              variant="outlined"
              margin="normal"
              fullWidth
              type="number"
              value={projectData.visitasCotizadas}
              onChange={handleChange}
              required
              disabled={savingDataInfo.saving}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
            <TextField
              name='alcance'
              multiline
              id="outlined-textarea"
              label="Alcance"
              variant="outlined"
              margin="normal"
              placeholder="Agregar el alcance del proyecto"
              fullWidth
              type='text'
              value={projectData.alcance}
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
                startIcon={<AddchartRoundedIcon/>}
              >
                Crear proyecto
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

export default CreateProject
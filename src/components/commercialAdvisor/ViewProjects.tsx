import React, { useEffect, useState } from 'react';
import { API_GESTION_INSPECCIONES_URL, PROJECTS } from '../../constants/apis';
import { useNavigate } from 'react-router-dom';
import { IProjectPreview } from '../Interfaces';
import { sendGet } from '../../services/apiRequests';
import { localUserTokenKeyName } from '../../constants/globalConstants';
import Swal from 'sweetalert2';
import { Box, Button, Container, FormControlLabel, Grid, Paper, Skeleton, ThemeProvider, Typography, createTheme, styled } from '@mui/material';
import { IOSSwitch } from '../customComponents/CustomSwitch';
import { commercialAdvisorRoutes } from '../../constants/routes';
import CircularProgressWithLabel from '../customComponents/CircularProgressWithLabel';

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

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  padding: theme.spacing(1),
  height: 155
}));

const ViewProjects = (props:{commercialProjects:IProjectPreview[], pageDarkTheme:boolean}) => {
  const navigate = useNavigate();
  const [viewAllProjects, setViewAllProjects] = useState(true);
  const [projectsArray, setProjectsArray] = useState<IProjectPreview[]>([]);
  const [projectsLoaded, setProjectsLoaded] = useState(false);

  useEffect(() => {
    setProjectsArray(props.commercialProjects);
    setProjectsLoaded(true);
  }, [])

  const getAllProjects =async () => {
    if(localStorage.length > 0){
      setProjectsLoaded(false);
      const jwtToken = localStorage.getItem(localUserTokenKeyName);
      try {
        const projectsResponse = await sendGet(`${API_GESTION_INSPECCIONES_URL}/${PROJECTS}/preview`, jwtToken);
        setProjectsLoaded(true);

        if(projectsResponse && projectsResponse.status === 200 && projectsResponse.data)
          setProjectsArray(projectsResponse.data);
        else{
          Swal.fire({
            title: 'Expiró la sesión',
            text: `La sesión expiró, debe volver a iniciar sesión`,
            icon: 'info',
            confirmButtonText: "Iniciar sesión"
          })
          .then(option => {
            localStorage.clear();
            if(option.isConfirmed){
              Swal.close();
              navigate(`../`);
            }
            else
              setTimeout(() => {
                Swal.close();
                navigate(`../`);
              }, 5000);
          })
        }
      } 
      catch (error) {
        setProjectsLoaded(true);
        localStorage.clear();
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
          navigate(`../`);
        }
        else
          setTimeout(() => {
            Swal.close();
            navigate(`../`);
          }, 5000);
      })
    }
  }

  const changeProjectsView = () => {
    setViewAllProjects(!viewAllProjects);
    setProjectsLoaded(false);

    if(viewAllProjects)
      getAllProjects();
    else{
      setProjectsArray(props.commercialProjects);
      setProjectsLoaded(true);
    }
  };
  
  return (
    <Container maxWidth="xl" sx={{ m:"10px 0px", bgcolor: 'background.default', }}>
      <ThemeProvider theme={props.pageDarkTheme ? darkTheme : lightTheme}>
        <Button variant="outlined" onClick={() => navigate(`${commercialAdvisorRoutes.createProject}`)}>Crear proyecto</Button>
        <FormControlLabel
          label="Ver todos los proyectos"
          labelPlacement='start'
          value={!viewAllProjects}
          checked={!viewAllProjects}
          control={<IOSSwitch />}
          onChange={changeProjectsView}
        />
        <Grid container wrap="wrap" sx={{marginTop:2, gap:2}}>
          {(projectsLoaded && projectsArray.length > 0 ? projectsArray : Array.from(new Array(props.commercialProjects ? props.commercialProjects.length : 20)))
            .map((project:IProjectPreview, index:number) => (
              <Grid item key={index} sx={{ width: {xs:"100vw", md:150, lg:200, xl:300} }}>
                {/* {project ? (
                  <img
                    style={{ width: 210, height: 118 }}
                    alt={project.title}
                    src={project.src}
                  />
                ) : (
                  <Skeleton variant="rectangular" width={210} height={118} />
                )} */}

                {project ? (
                  <Item elevation={4} square={false}>
                    <Box>
                      <CircularProgressWithLabel value={18}/>
                    </Box>
                    <Typography gutterBottom variant="body2">
                      {project.nombreProyecto ? project.nombreProyecto : ""}
                    </Typography>
                    <Typography gutterBottom variant="body2">
                      {project.cliente && project.cliente.nombre ? project.cliente.nombre : ""}
                    </Typography>
                    <Typography gutterBottom variant="body2">
                      {project.estadoProyecto ? project.estadoProyecto : ""}
                    </Typography>
                  </Item>
                ) : (
                  <Item elevation={4} square={false}>
                    <Skeleton />
                    <Skeleton />
                  </Item>
                )}
              </Grid>
            ))
          }
        </Grid>
      </ThemeProvider>
    </Container>
  )
}

export default ViewProjects;
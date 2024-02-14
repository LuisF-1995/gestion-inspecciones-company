import React, { useEffect, useState } from 'react';
import { API_GESTION_INSPECCIONES_URL, PROJECTS } from '../../constants/apis';
import { useNavigate } from 'react-router-dom';
import { IProject } from '../Interfaces';
import { sendGet } from '../../services/apiRequests';
import { localUserTokenKeyName } from '../../constants/globalConstants';
import Swal from 'sweetalert2';
import { Box, Button, Container, FormControlLabel, Grid, Skeleton, Typography } from '@mui/material';
import { IOSSwitch } from '../CustomSwitch';
import { commercialAdvisorRoutes } from '../../constants/routes';


const ViewProjects = (props:{commercialProjects:IProject[]}) => {
  const navigate = useNavigate();
  const [viewAllProjects, setViewAllProjects] = useState(false);
  const [projectsArray, setProjectsArray] = useState<IProject[]>(props.commercialProjects);
  const [loadingProjects, setLoadingProjects] = useState(false);

  const getAllProjects =async () => {
    if(localStorage.length > 0){
      setLoadingProjects(true);
      const jwtToken = localStorage.getItem(localUserTokenKeyName);
      try {
        const projectsResponse = await sendGet(`${API_GESTION_INSPECCIONES_URL}/${PROJECTS}/preview`, jwtToken);
        setLoadingProjects(false);

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
        setLoadingProjects(false);
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

    if(viewAllProjects)
      getAllProjects();
    else
      setProjectsArray(props.commercialProjects);
  };
  
  
  return (
    <Container sx={{ m:{md:"10px 0px", lg:"10px 0px", xl:"10px 0px"}, width: "100vw" }}>
      <Button variant="outlined" onClick={() => navigate(`${commercialAdvisorRoutes.createProject}`)}>Crear proyecto</Button>
      <FormControlLabel
        label="Ver todos los proyectos "
        labelPlacement='start'
        value={viewAllProjects}
        control={<IOSSwitch defaultChecked />}
        onChange={changeProjectsView}
      />
      <Grid container wrap="wrap">
        {loadingProjects && projectsArray.length > 0 &&
          projectsArray.map((item:IProject, index:number) => (
            <Box key={index} sx={{ width: 210, marginRight: 0.5, my: 5 }}>
              {/* {item ? (
                <img
                  style={{ width: 210, height: 118 }}
                  alt={item.title}
                  src={item.src}
                />
              ) : (
                <Skeleton variant="rectangular" width={210} height={118} />
              )} */}

              {item ? (
                <Box sx={{ pr: 2 }}>
                  <Typography gutterBottom variant="body2">
                    {item.nombreProyecto}
                  </Typography>
                  <Typography display="block" variant="caption" color="text.secondary">
                    {item.cliente.nombre}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.estadoProyecto}
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ pt: 0.5 }}>
                  <Skeleton />
                  <Skeleton width="60%" />
                </Box>
              )}
            </Box>
          ))
        }
      </Grid>
    </Container>
  )
}

export default ViewProjects;
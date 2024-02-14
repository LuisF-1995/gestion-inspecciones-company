import React, { useState } from 'react';
import { Button, Container, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { IProject } from './Interfaces';
import { localUserIdKeyName } from '../constants/globalConstants';

const CreateProject = () => {
  const [projectData, setProjectData] = useState<IProject>({
    nombreProyecto:"",
    alcance:"",
    direccionProyecto: "",
    visitasCotizadas: 0,
    estadoProyecto: "APROBADO",
    asesorComercial: {id: parseInt(localStorage.getItem(localUserIdKeyName))},
    tipoProyecto: ""
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
  }

  return (
    <Container maxWidth="xl" sx={{ m:{md:"10px 0px", lg:"10px 0px", xl:"10px 0px"} }}>
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
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
            <FormControl variant="outlined" margin="normal" fullWidth>
              <InputLabel>Tipo de proyecto</InputLabel>
              <Select
                name='tipoProyecto'
                value={projectData.tipoProyecto}
                onChange={handleChange}
                label="Tipo de proyecto"
                type='text'
                placeholder='Seleccionar'
                required
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
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
            <TextField
              name='visitasCotizadas'
              label="Número de visitas"
              variant="outlined"
              margin="normal"
              fullWidth
              type='number'
              value={projectData.visitasCotizadas}
              onChange={handleChange}
              required
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
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{display:"flex", alignItems:"center", justifyContent:"center"}}>
            <Button type="submit" variant="outlined" color="primary" sx={{ mt: 2 }} size='large'>
              Crear proyecto
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  )
}

export default CreateProject
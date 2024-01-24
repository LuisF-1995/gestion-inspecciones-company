import { Backdrop, Box, Button, CircularProgress, Container, TextField } from '@mui/material'
import React, { useState } from 'react'
import { localTokenKeyName } from '../../constants/globalConstants';
import { sendPost } from '../../services/apiRequests';
import { API_GESTION_INSPECCIONES_URL, COMPETENCES } from '../../constants/apis';
import { ICompetencia } from '../Interfaces';
import Swal from 'sweetalert2';

const AddCompetence = () => {
  const [competence, setCompetence] = useState<ICompetencia>({competencia:""});
  const [waiting, setWaiting] = useState(false);
  
  const handleChange = (event:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCompetence({
      competencia: event.target.value
    });
  }

  const submitForm = async (form: React.FormEvent<HTMLFormElement>) => {
    form.preventDefault();
    setWaiting(true);

    if(sessionStorage.length > 0){
      const jwtToken = sessionStorage.getItem(localTokenKeyName);
      if(jwtToken){
        try {
          const compentencesInfo:ICompetencia = await sendPost(`${API_GESTION_INSPECCIONES_URL}/${COMPETENCES}/add`, competence, jwtToken);
          setWaiting(false);
          
          if(compentencesInfo && compentencesInfo.competencia != undefined){
            setCompetence({competencia:""});
            Swal.fire({
              title: "Registro exitoso",
              text: `Competencia ${compentencesInfo.competencia} se registró exitosamente`,
              icon: 'success'
            })
          }
          else if(compentencesInfo.response.status != 200){
            Swal.fire({
              title: "Ha ocurrido un error",
              text: `No se pudo registrar la compentecia, favor validar que la competencia no exista`,
              icon: 'error'
            })
          }
        }
        catch (error) {
          setWaiting(false);
          sessionStorage.clear();
        }
      }
    }
  }
  
  return (
    <>
      <Container maxWidth="lg">
        <Box>
          <h3 style={{textAlign:"center"}}>Agregar competencias técnicas</h3>
          <form onSubmit={submitForm} style={{display:"flex", justifyContent:"center", gap:5}}>
            <TextField id="outlined-basic" label="Competencia" variant="outlined" onChange={handleChange} value={competence.competencia} required />
            <Button type='submit' variant="outlined">Agregar</Button>
          </form>
        </Box>
      </Container>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={waiting}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )
}

export default AddCompetence
import { Backdrop, Box, Button, CircularProgress, Container, TextField } from '@mui/material';
import React, { useState } from 'react';
import { sendPost } from '../../services/apiRequests';
import { API_GESTION_INSPECCIONES_URL } from '../../constants/apis';
import { localTokenKeyName, localUserIdKeyName } from '../../constants/globalConstants';

const AddRegional = (props:{getRegionals:any}) => {
  const [regional, setRegional] = useState({ciudad:""});
  const [waiting, setWaiting] = useState(false);
  
  const handleChange = (event:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRegional({
      ciudad: event.target.value
    });
  }

  const submitForm = async (form: React.FormEvent<HTMLFormElement>) => {
    form.preventDefault();
    setWaiting(true);

    if(sessionStorage.length > 0){
      const jwtToken = sessionStorage.getItem(localTokenKeyName);
      if(jwtToken){
        try {
          const regionalsInfo = await sendPost(`${API_GESTION_INSPECCIONES_URL}/regionales/create`, regional, jwtToken);
          setWaiting(false);
          if(regionalsInfo){
            window.location.reload();
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
          <h3 style={{textAlign:"center"}}>Agregar regional</h3>
          <form onSubmit={submitForm} style={{display:"flex", justifyContent:"center", gap:5}}>
            <TextField id="outlined-basic" label="Ciudad" variant="outlined" onChange={handleChange} value={regional.ciudad} required />
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

export default AddRegional
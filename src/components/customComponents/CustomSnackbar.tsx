import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';

const CustomSnackbar = (props:{open:boolean; message:string; vertical:"top" | "bottom"; horizontal:"center" | "left" | "right"; autoHideTime:number; alertType:"success"|"info"|"warning"|"error"; variant:"filled" | "standard" | "outlined"; onClose: () => void;}) => {

  const { vertical, horizontal, open, message, autoHideTime, alertType, variant, onClose } = props; 

  return (
    <Box sx={{ width: 500 }}>
      <Snackbar
        anchorOrigin={{ vertical , horizontal }}
        open={open}
        onClose={onClose}
        key={vertical + horizontal}
        autoHideDuration={autoHideTime}
      >
        <Alert
          onClose={onClose}
          severity={alertType}
          variant={variant}
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

CustomSnackbar.propTypes = {}

export default CustomSnackbar;
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { loginPath } from '../../constants/routes';

const Root = () => {
  return (
    <>
      <Navigate to={loginPath} replace={true}/>
      <Outlet/>
    </>
  )
}

export default Root
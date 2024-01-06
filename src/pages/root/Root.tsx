import React from 'react';
import { Outlet } from 'react-router-dom';
//import { loginPath } from '../../constants/routes';

const Root = () => {
  return (
    <>
      {/* <Navigate to={loginPath} replace={true}/> */}
      <Outlet/>
    </>
  )
}

export default Root
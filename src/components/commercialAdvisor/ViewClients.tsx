import React, { useEffect, useState } from 'react';
import { ICustomer } from '../Interfaces';
import { useNavigate } from 'react-router-dom';
import { localUserTokenKeyName } from '../../constants/globalConstants';
import { API_GESTION_INSPECCIONES_URL, CUSTOMERS } from '../../constants/apis';
import { sendGet } from '../../services/apiRequests';
import Swal from 'sweetalert2';

const ViewClients = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [customersLoaded, setCustomersLoaded] = useState(false);

  useEffect(() => {
    getAllClients();
  }, [])

  const getAllClients =async () => {
    if(localStorage.length > 0){
      setCustomersLoaded(false);
      const jwtToken = localStorage.getItem(localUserTokenKeyName);
      try {
        const customersResponse = await sendGet(`${API_GESTION_INSPECCIONES_URL}/${CUSTOMERS}/all`, jwtToken);
        setCustomersLoaded(true);

        console.log(customersResponse);
        

        if(customersResponse && customersResponse.status === 200 && customersResponse.data)
          setCustomers(customersResponse.data);
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
      catch (error) {
        setCustomersLoaded(true);
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
  

  return (
    <div>ViewClients</div>
  )
}

export default ViewClients
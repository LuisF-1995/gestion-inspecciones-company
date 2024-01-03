import React, { useEffect, useState } from 'react'
import { sendGet } from '../../services/apiRequests'
import { API_GESTION_INSPECCIONES_URL } from '../../constants/apis'
import { localTokenKeyName, localUserIdKeyName } from '../../constants/globalConstants'

const AdminDashboard = () => {
  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    if(sessionStorage.length > 0){
      getUserInfo();
    }
  }, [])
  
  const getUserInfo = async() => {
    const userId = sessionStorage.getItem(localUserIdKeyName);
    const jwtToken = sessionStorage.getItem(localTokenKeyName);

    if(userId && jwtToken){
      try {
        const userInfoApi = await sendGet(`${API_GESTION_INSPECCIONES_URL}/admin/id/${userId}`, jwtToken);
        setUserInfo(userInfoApi.data);
      } 
      catch (error) {
        sessionStorage.clear();
      }
    }
  }

  return (
    <div>AdminDashboard</div>
  )
}

export default AdminDashboard
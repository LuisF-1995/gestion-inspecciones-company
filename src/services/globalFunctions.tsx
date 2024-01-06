import Swal from "sweetalert2";
import { API_GESTION_INSPECCIONES_URL } from "../constants/apis";
import { sendGet } from "./apiRequests";

export const getUserRoles = async():Promise<any> => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const rolesFromApi:string[] | any = await sendGet(`${API_GESTION_INSPECCIONES_URL}/user-roles`);
      if(rolesFromApi.data && rolesFromApi.data.length > 0){
        const filterClients:string[] = rolesFromApi.data && rolesFromApi.data.length > 0 && rolesFromApi.data.filter((rol:string) => rol !== "CLIENTE");
        const filterConstructors:string[] = filterClients && filterClients.length > 0 && filterClients.filter((rol:string) => rol !== "CONSTRUCTOR");
        const filterAdmins:string[] = filterConstructors && filterConstructors.length > 0 && filterConstructors.filter((rol:string) => rol !== "ADMIN");
        resolve(filterAdmins);
      }
      else if (rolesFromApi && rolesFromApi.message) {
        Swal.fire({
          title: "Error de conexión",
          text: `${rolesFromApi.message}`,
          icon: 'error'
        })
        resolve([]);
      }
    } 
    catch (error) {
      Swal.fire({
        title: "Error de conexión",
        text: `No se pudo obtener información de los roles, verificar conexión a internet o comunicate con nosotros.`,
        icon: 'error'
      })
      resolve([]);
    }
  }) 
}

export const getComercialAdvisors = async() => {
  return new Promise<any>((resolve, reject) => {
    try {
      
    } 
    catch (error) {
      Swal.fire({
        title: "Error de conexión",
        text: `No se pudo obtener información de los roles, verificar conexión a internet o comunicate con nosotros.`,
        icon: 'error'
      })
      resolve([]);
    }
  })
}
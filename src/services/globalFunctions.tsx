import Swal from "sweetalert2";
import { API_GESTION_INSPECCIONES_URL, COMMERCIAL_ADVISORS, COMPETENCES, INSPECTORS, REGIONAL_DIRECTORS, SCHEDULE_PROGRAMMERS, TECHNICAL_DIRECTORS } from "../constants/apis";
import { sendGet } from "./apiRequests";
import { ICompetencia, IRegionalApiData, IUserApiData } from "../components/Interfaces";

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

export const getCompetencesFromApi = async(jwtToken:string): Promise<ICompetencia[]> => {
  return new Promise<ICompetencia[]>(async (resolve, reject) => {
    try {
      const competencesInfo = await sendGet(`${API_GESTION_INSPECCIONES_URL}/${COMPETENCES}`, jwtToken);

      if(competencesInfo.data){
        const regionalsData:IRegionalApiData[] = competencesInfo.data;
        resolve(regionalsData);
      }
      else if (competencesInfo && competencesInfo.message) {
        Swal.fire({
          title: "Error de conexión",
          text: `${competencesInfo.message}`,
          icon: 'error'
        })
        resolve([]);
      }
    }
    catch (error) {
      sessionStorage.clear();
      resolve([]);
    }
  })
}

export const getRegionalsInfo = async(jwtToken:string): Promise<IRegionalApiData[]> => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const regionalsInfo = await sendGet(`${API_GESTION_INSPECCIONES_URL}/regionales`, jwtToken);

      if(regionalsInfo.data){
        const regionalsData:IRegionalApiData[] = regionalsInfo.data;
        resolve(regionalsData);
      }
      else if (regionalsInfo && regionalsInfo.message) {
        Swal.fire({
          title: "Error de conexión",
          text: `${regionalsInfo.message}`,
          icon: 'error'
        })
        resolve([]);
      }
    }
    catch (error) {
      sessionStorage.clear();
      resolve([]);
    }
  })
}

export const getComercialAdvisors = (jwtToken:string): Promise<IUserApiData|any> => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const comercialAdvisors:any = await sendGet(`${API_GESTION_INSPECCIONES_URL}/${COMMERCIAL_ADVISORS}/all`, jwtToken);
      if(comercialAdvisors.data){
        const comercialAdvisorsData:IUserApiData[] = comercialAdvisors.data;
        resolve(comercialAdvisorsData);
      }
      else if (comercialAdvisors && comercialAdvisors.message) {
        Swal.fire({
          title: "Error de conexión",
          text: `${comercialAdvisors.message}`,
          icon: 'error'
        })
        resolve([]);
      }
    } 
    catch (error) {
      Swal.fire({
        title: "Error de conexión",
        text: `No se pudo obtener información de los asesores comerciales, verificar conexión a internet o comunicate con nosotros.`,
        icon: 'error'
      })
      resolve([]);
    }
  })
}

export const getRegionalDirectors = (jwtToken:string): Promise<IUserApiData|any> => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const regionalDirectors:any = await sendGet(`${API_GESTION_INSPECCIONES_URL}/${REGIONAL_DIRECTORS}/all`, jwtToken);
      if(regionalDirectors.data){
        const regionalDirectorsData:IUserApiData[] = regionalDirectors.data;
        resolve(regionalDirectorsData);
      }
      else if (regionalDirectors && regionalDirectors.message) {
        Swal.fire({
          title: "Error de conexión",
          text: `${regionalDirectors.message}`,
          icon: 'error'
        })
        resolve([]);
      }
    } 
    catch (error) {
      Swal.fire({
        title: "Error de conexión",
        text: `No se pudo obtener información de los directores de regional, verificar conexión a internet o comunicate con nosotros.`,
        icon: 'error'
      })
      resolve([]);
    }
  })
}

export const getTechnicalDirectors = (jwtToken:string): Promise<IUserApiData|any> => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const technicalDirectors:any = await sendGet(`${API_GESTION_INSPECCIONES_URL}/${TECHNICAL_DIRECTORS}/all`, jwtToken);
      if(technicalDirectors.data){
        const technicalDirectorsData:IUserApiData[] = technicalDirectors.data;
        resolve(technicalDirectorsData);
      }
      else if (technicalDirectors && technicalDirectors.message) {
        Swal.fire({
          title: "Error de conexión",
          text: `${technicalDirectors.message}`,
          icon: 'error'
        })
        resolve([]);
      }
    } 
    catch (error) {
      Swal.fire({
        title: "Error de conexión",
        text: `No se pudo obtener información de los directores técnicos, verificar conexión a internet o comunicate con nosotros.`,
        icon: 'error'
      })
      resolve([]);
    }
  })
}

export const getInspectors = (jwtToken:string): Promise<IUserApiData|any> => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const inspectors:any = await sendGet(`${API_GESTION_INSPECCIONES_URL}/${INSPECTORS}`, jwtToken);
      if(inspectors.data){
        const inspectorsData:IUserApiData[] = inspectors.data;
        resolve(inspectorsData);
      }
      else if (inspectors && inspectors.message) {
        Swal.fire({
          title: "Error de conexión",
          text: `${inspectors.message}`,
          icon: 'error'
        })
        resolve([]);
      }
    } 
    catch (error) {
      Swal.fire({
        title: "Error de conexión",
        text: `No se pudo obtener información de los inspectores, verificar conexión a internet o comunicate con nosotros.`,
        icon: 'error'
      })
      resolve([]);
    }
  })
}

export const getScheduleProgrammers = (jwtToken:string): Promise<IUserApiData|any> => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const scheduleProgrammers:any = await sendGet(`${API_GESTION_INSPECCIONES_URL}/${SCHEDULE_PROGRAMMERS}/all`, jwtToken);
      if(scheduleProgrammers.data){
        const programmersData:IUserApiData[] = scheduleProgrammers.data;
        resolve(programmersData);
      }
      else if (scheduleProgrammers && scheduleProgrammers.message) {
        Swal.fire({
          title: "Error de conexión",
          text: `${scheduleProgrammers.message}`,
          icon: 'error'
        })
        resolve([]);
      }
    } 
    catch (error) {
      Swal.fire({
        title: "Error de conexión",
        text: `No se pudo obtener información de los programadores de agenda, verificar conexión a internet o comunicate con nosotros.`,
        icon: 'error'
      })
      resolve([]);
    }
  })
}
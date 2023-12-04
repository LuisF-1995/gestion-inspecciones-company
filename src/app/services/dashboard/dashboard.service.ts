import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { login } from '../../../constants/Routes';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor( private apiService:ApiService, private router:Router ) {}

  validateToken(urlApi:string, endpoint:string, localToken:string|null):
    Promise<{
      validToken:boolean,
      data:{
        id: number;
        email: string;
        nombres: string;
        tipoDocumento:string;
        numeroDocumento:number;
        matriculaProfesional:string;
        direccionDomicilio:string;
        firmaConstructor:string;
        telefono: string;
        proyectosConstructor: any[];
        qrConstructor:string;
        rol: string;}|null}>
    {
    return new Promise((resolve, reject) => {
      if(localToken && localToken.length > 0){
        this.apiService.get(urlApi, endpoint, localToken).subscribe({
          next:(response => {
            if(response){
              resolve({
                validToken: true,
                data: response
              })
            }
          }),
          error: (error => {
            this.closeSession();
            resolve({
              validToken: false,
              data: null
            })
          })
        })
      }
      else{
        this.closeSession();
        resolve({
          validToken: false,
          data: null
        })
      }
    })
  }

  closeSession(){
    localStorage.clear();
    this.router.navigateByUrl(login.path)
  }

  redirect(){

  }
}

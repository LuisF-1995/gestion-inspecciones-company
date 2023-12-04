import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor( private apiService:ApiService) { }

  async register(apiUrl:string, endpoint:string, data:{nombres:string, telefono:String, email:string, password:string}, token?:string): Promise<{success:boolean, message:string}> {
    return new Promise((resolve, reject) => {
      this.apiService.post(apiUrl, endpoint, data).subscribe({
        next: (response) => {
          resolve({success:response.authenticationSuccess, message: response.authInfo});
        },
        error: (error) => {
          if(error.status != 200)
            resolve({success:false, message:"Error en la solicitud"});
        }
      });
    })
  }
}

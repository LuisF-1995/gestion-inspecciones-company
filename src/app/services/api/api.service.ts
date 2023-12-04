import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  get(apiUrl:string, endpoint: string, token?:string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if(token && token.length > 0){
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.get<any>(`${apiUrl}/${endpoint}`, { headers: headers });
  }

  post(apiUrl:string, endpoint: string, data: any, token?:string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if(token && token.length > 0){
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.post<any>(`${apiUrl}/${endpoint}`, data, { headers: headers });
  }

  put(apiUrl:string, endpoint: string, data: any, token?:string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if(token && token.length > 0){
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.put<any>(`${apiUrl}/${endpoint}`, data, { headers: headers });
  }

  delete(apiUrl:string, endpoint: string, token?:string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if(token && token.length > 0){
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.delete<any>(`${apiUrl}/${endpoint}`, { headers: headers });
  }
}

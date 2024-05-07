import { Injectable } from '@angular/core';
import axios, { AxiosRequestConfig } from 'axios';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/v1/auth/';

const httpOptions: AxiosRequestConfig = {
  headers: {
    'Content-Type': 'application/json'
  }
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  login(email: string, password: string): Observable<any> {
    return new Observable<any>((observer) => {
      axios.post(`${AUTH_API}login`, { email, password }, httpOptions)
        .then((response) => {
          console.log(response.data.token)
          observer.next(response.data.token);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  register(firstName: string, lastName: string, email: string, password: string): Observable<any> {
    return new Observable<any>((observer) => {
      axios.post(`${AUTH_API}signup`, { firstName, lastName, email, password }, httpOptions)
        .then((response) => {
          observer.next(response.data);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
}

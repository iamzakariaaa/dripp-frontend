import axios, { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';
import handleRequest from '../helpers/handleRequest';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/v1/users';

  constructor(private storageService: StorageService) {}

  getAllUsers(): Observable<User[]> {
    const token = this.storageService.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return handleRequest(axios.get<User[]>(`${this.baseUrl}`, {headers}));
  }

  getUserByEmail(email: string): Observable<User> {
    const token = this.storageService.getToken();
    return new Observable<User>((observer) => {
      axios
        .get<User>(`${this.baseUrl}/email/${email}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        .then((response: AxiosResponse<User>) => {
          observer.next(response.data);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
}

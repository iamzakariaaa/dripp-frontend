import { Injectable } from '@angular/core';
import { jwtDecode} from 'jwt-decode';
import { UserService } from './user.service';

const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  
  constructor() {}

  clean(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public decodeToken(): any {
    const token = this.getToken();
    if (token) {
      try {
        return jwtDecode(token);
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }

  saveUser(token: string): void {
    const decodedToken = jwtDecode(token);
    localStorage.setItem('user', JSON.stringify(decodedToken));
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  public isAdmin(): boolean {
    const decodedToken = this.decodeToken();
    return decodedToken && decodedToken.roles && decodedToken.roles.includes('ADMIN');
  }

  public isLoggedIn(): boolean {
    return !!this.getToken();
  }

  public logout(): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.location.reload();
  }
}

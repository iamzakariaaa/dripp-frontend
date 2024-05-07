import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule,LoginComponent,SignupComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  showLogin: boolean = true;

  toggleForm() {
    this.showLogin = !this.showLogin;
  }
}

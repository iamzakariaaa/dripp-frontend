import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StorageService } from '../../../services/storage.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = this.formBuilder.group({}); 

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  role: string = '';

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm(); 
  }

  initForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]], 
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).subscribe({
      next: (data: any) => {
        this.storageService.saveToken(data);
        this.storageService.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.role = this.storageService.getUser().roles[0];
        console.log(this.role);
        this.redirect(this.role);
      },
      error: (err: { status: number; }) => {
        if (err.status === 401) {
          this.errorMessage = 'Invalid email or password. Please try again.';
        } else {
          this.errorMessage = 'An error occurred while logging in. Please try again later.';
        }
        this.isLoginFailed = true;
      }
    });
  }

  reloadPage(): void {
    window.location.reload();
  }
  
  redirect(role: string): void {
    switch (role) {
      case 'CUSTOMER':
        this.router.navigate(['/home']);
        break;
      case 'ADMIN':
        this.router.navigate(['/admin']);
        break;
      default:
        this.router.navigate(['/']); 
    }

}
}

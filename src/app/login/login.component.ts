import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string | null = null;
  loginSuccess: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const userData = this.loginForm.value;
      this.http.post<{ message: string }>('http://localhost:3000/login', userData).subscribe({
        next: (response) => {
          this.loginSuccess = response.message;
          this.loginError = null;
          this.router.navigate(['/welcome']);
        },
        error: (error) => {
          this.loginError = error.error.message || 'Login failed.';
          this.loginSuccess = null;
        }
      });
    }
  }
}

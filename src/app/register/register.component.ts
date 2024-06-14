import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  registrationError: string | null = null;
  registrationSuccess: string | null = null;
  bloodGroups: string[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const userData = this.registerForm.value;
      this.http.post<{ message: string }>('http://localhost:3000/register', userData).subscribe({
        next: (response) => {
          this.registrationSuccess = response.message;
          this.registrationError = null;
        },
        error: (error) => {
          this.registrationError = error.error.message || 'Registration failed.';
          this.registrationSuccess = null;
        }
      });
    }
  }
}

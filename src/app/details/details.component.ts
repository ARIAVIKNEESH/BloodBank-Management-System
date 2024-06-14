import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  detailsForm: FormGroup;
  registrationError: string | null = null;
  registrationSuccess: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.detailsForm = this.fb.group({
      name: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      bloodgroup: ['', Validators.required],
      address: ['', Validators.required],
      placeOfDonation: ['', Validators.required],
      hospitalName: ['', Validators.required],
      donationDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.detailsForm.valid) {
      const formData = this.detailsForm.value;
      this.http.post<{ message: string }>('http://localhost:3000/blood-details', formData).subscribe({
        next: (response) => {
          this.registrationSuccess = response.message;
          this.registrationError = null;
          this.detailsForm.reset(); // Optionally reset the form after successful submission
        },
        error: (error) => {
          this.registrationError = error.error.message || 'Failed to register blood details.';
          this.registrationSuccess = null;
        }
      });
    }
  }
}

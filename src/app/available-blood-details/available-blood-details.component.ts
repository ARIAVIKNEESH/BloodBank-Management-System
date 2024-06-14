import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-available-blood-details',
  templateUrl: './available-blood-details.component.html',
  styleUrls: ['./available-blood-details.component.css']
})
export class AvailableBloodDetailsComponent implements OnInit {
  bloodDetails: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchBloodDetails();
  }

  fetchBloodDetails() {
    this.http.get<any[]>('http://localhost:3000/blood-details').subscribe({
      next: (data) => {
        this.bloodDetails = data;
      },
      error: (error) => {
        console.error('Error fetching blood details:', error);
      }
    });
  }
}

import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router'; // Import Router for navigation
import { HttpResponse } from '@angular/common/http'; // Import HttpResponse for typing

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
})
export class ProfilePage {
  userData: any; // Variable to hold user data

  constructor(private authService: AuthService, private http: HttpClient, private router: Router) {
    this.loadUserData(); // Load user data on component initialization
  }

  loadUserData() {
    const data = localStorage.getItem('user'); // Retrieve user data from localStorage
    this.userData = data ? JSON.parse(data) : null; // Parse JSON if data exists, otherwise set to null
  }

  logout() {
    const token = localStorage.getItem('token'); // Get the token from AuthService
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Set the Authorization header
    });

    this.http.post<HttpResponse<any>>('http://localhost:8000/api/logout', {}, { headers }) // Replace with your actual logout URL
      .subscribe(
        (response: HttpResponse<any>) => { // Explicitly define the type of response
          console.log('Logout successful', response);
          localStorage.removeItem('user'); // Clear user data from localStorage
          this.router.navigate(['/login']); // Redirect to login page
        },
        (error: any) => { // Explicitly define the type of error
          console.error('Logout error', error);
          // Optionally show an error message to the user
        }
      );
  }
}
import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
})
export class ProfilePage {
  userData: any; // Variable to hold user data

  constructor() {
    this.loadUserData(); // Load user data on component initialization
  }

  loadUserData() {
    const data = localStorage.getItem('user'); // Retrieve user data from localStorage
    this.userData = data ? JSON.parse(data) : null; // Parse JSON if data exists, otherwise set to null
  }
}
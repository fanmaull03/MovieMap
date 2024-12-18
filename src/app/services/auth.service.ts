import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _storage: Storage | null = null;

  constructor(private http: HttpClient, private storage: Storage) {
    // Initialize the storage when the service is created
    this.init();
  }

  // Initialize the storage
  private async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  authURL() {
    return 'http://localhost:8000/api';
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.authURL()}/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.authURL()}/login`, data);
  }

  // Fetch user profile
  getUserProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.authURL()}/user-profile`, { headers });
  }

  // Update user profile
// Dalam auth.service.ts, sesuaikan URL
updateUserProfile(profileData: any): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.put(`${this.authURL()}/user-profile`, profileData, { headers });
}

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  // Logout
  async logout() {
    await this._storage?.remove('token');
  }
}

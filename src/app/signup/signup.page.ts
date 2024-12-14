import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
  formData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  apiUrl = 'https://rifqifauu.github.io/apimoviemap/register'; // URL API untuk registrasi

  constructor(private router: Router, private http: HttpClient) {}

  register() {
    // Validasi apakah password dan confirmPassword cocok
    if (this.formData.password !== this.formData.confirmPassword) {
      alert('Password and Confirm Password do not match!');
      return;
    }

    // Panggil API untuk menyimpan data
    this.authService.register(this.formData).subscribe(
      (response: any) => {
        alert('Registration successful!');
        this.router.navigate(['/login']); // Pindah ke halaman login
      },
      (error: any) => {
        console.error('Registration failed:', error);
        alert('Registration failed!');
      }
    );
  }
}

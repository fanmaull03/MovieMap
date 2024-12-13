import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

    // Data yang akan dikirim ke API
    const payload = {
      name: this.formData.name,
      email: this.formData.email,
      password: this.formData.password
    };

    // Panggil API untuk registrasi
    this.http.post(this.apiUrl, payload).subscribe(
      (response: any) => {
        if (response && response.token) {
          // Simpan token ke localStorage
          localStorage.setItem('authToken', response.token);
          alert('Registration successful!');
          this.router.navigate(['/login']); // Pindah ke halaman login
        } else {
          alert('Registration failed: No token received!');
        }
      },
      (error: any) => {
        console.error('Registration failed:', error);
        alert('Registration failed! Please try again.');
      }
    );
  }
}

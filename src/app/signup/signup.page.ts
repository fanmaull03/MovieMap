import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
  // Data yang diisi dari form
  formData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  // Properti untuk kontrol visibilitas password
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off-outline';

  confirmPasswordType: string = 'password';
  confirmPasswordIcon: string = 'eye-off-outline';

  constructor(private router: Router, private authService: AuthService) {}

  // Fungsi untuk toggle visibilitas password
  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.passwordIcon = this.passwordIcon === 'eye-outline' ? 'eye-off-outline' : 'eye-outline';
  }

  // Fungsi untuk toggle visibilitas confirm password
  toggleConfirmPasswordVisibility() {
    this.confirmPasswordType = this.confirmPasswordType === 'password' ? 'text' : 'password';
    this.confirmPasswordIcon =
      this.confirmPasswordIcon === 'eye-outline' ? 'eye-off-outline' : 'eye-outline';
  }

  // Fungsi register untuk validasi dan panggilan API
  register() {
    // Validasi apakah password dan confirmPassword cocok
    if (this.formData.password !== this.formData.confirmPassword) {
      alert('Password and Confirm Password do not match!');
      return;
    }

    // Panggilan API ke AuthService
    this.authService.register(this.formData).subscribe(
      (response: any) => {
        alert('Registration successful!');
        this.router.navigate(['/login']); // Pindah ke halaman login
      },
      (error: any) => {
        console.error('Registration failed:', error);
        alert('Registration failed! Please try again.');
      }
    );
  }
}

import { Component } from '@angular/core';
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
    password: ''
  };

  constructor(private router: Router, private authService: AuthService) {}

  register() {
    this.authService.register(this.formData).subscribe(
      (response: any) => {
        alert('Registration successful!');
        this.router.navigate(['/login']);   
      },
      (error: any) => {
        console.error('Registration failed:', error);
        alert('Registration failed!');
      }
    );
  }
}

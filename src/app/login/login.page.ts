import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string | undefined;
  password: string | undefined;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {}

  async onSubmit() {
    if (this.email && this.password) {
      try {
        // Handle HTTP request using firstValueFrom for promise-like behavior
        const response: { token: string; user: { id: number; name: string; email: string } } =
          await firstValueFrom(
            this.authService.login({ email: this.email, password: this.password })
          );
        // Store token and user data locally
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.router.navigate(['/tabs/profile']);     
       } catch (error: any) {
        // Show error toast
        const toast = await this.toastController.create({
          message: 'Login failed! Please check your credentials.',
          duration: 2000,
          color: 'danger',
        });
        toast.present();
      }
    } else {
      // Show warning toast for missing input
      const toast = await this.toastController.create({
        message: 'Email and password are required!',
        duration: 2000,
        color: 'warning',
      });
      toast.present();
    }
  }
}

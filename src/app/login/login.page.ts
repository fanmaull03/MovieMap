import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
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
    private alertController: AlertController
  ) {}

  // Fungsi untuk menampilkan alert
  async showAlert(header: string, message: string, success: boolean) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      cssClass: success ? 'alert-success' : 'alert-failure', // CSS khusus
      buttons: [
        {
          text: success ? 'Continue' : 'Retry',
          handler: () => {
            if (success) {
              this.router.navigate(['/tabs/profile']); // Redirect saat sukses
            }
          },
        },
      ],
      backdropDismiss: false, // Alert tidak dapat ditutup dengan klik di luar
    });

    await alert.present();
  }

  async onSubmit() {
    if (this.email && this.password) {
      try {
        // Handle HTTP request menggunakan firstValueFrom
        const response: { token: string; user: { id: number; name: string; email: string } } =
          await firstValueFrom(
            this.authService.login({ email: this.email, password: this.password })
          );

        // Simpan token dan data pengguna di local storage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        // Tampilkan alert sukses
        await this.showAlert('Success', 'Login successful! Welcome back.', true);
      } catch (error: any) {
        // Tampilkan alert error
        await this.showAlert('Error', 'Login failed! Please check your credentials.', false);
      }
    } else {
      // Tampilkan alert untuk input yang kosong
      await this.showAlert('Warning', 'Email and password are required!', false);
    }
  }
}

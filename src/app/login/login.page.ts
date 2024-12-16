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

  // Fungsi untuk menampilkan toast alert
  async showToast(message: string, color: string, duration: number = 2000) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      color: color,
      position: 'top', // Posisi di atas layar
      cssClass: 'custom-toast', // Tambahkan kelas CSS khusus untuk gaya
    });
    await toast.present();
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

        // Tampilkan toast sukses
        await this.showToast('Login successful!', 'success');

        // Redirect ke halaman profile setelah toast tampil
        setTimeout(() => {
          this.router.navigate(['/tabs/profile']);
        }, 2000); // Tunggu sampai toast selesai sebelum redirect
      } catch (error: any) {
        // Tampilkan toast error
        await this.showToast('Login failed! Please check your credentials.', 'danger');
      }
    } else {
      // Tampilkan toast untuk input yang kosong
      await this.showToast('Email and password are required!', 'warning');
    }
  }
}

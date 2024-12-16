import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

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

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController // Inject AlertController
  ) {}

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

  // Fungsi untuk menampilkan alert
  async presentAlert(header: string, message: string, success: boolean) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: success ? 'Go to Login' : 'Try Again',
          handler: () => {
            if (success) {
              this.router.navigate(['/login']);
            }
          },
        },
      ],
      cssClass: success ? 'alert-success' : 'alert-failure', // Tambahkan kelas CSS khusus untuk gaya
    });

    await alert.present();
  }

  // Fungsi register untuk validasi dan panggilan API
  register() {
    // Validasi apakah password dan confirmPassword cocok
    if (this.formData.password !== this.formData.confirmPassword) {
      this.presentAlert('Error', 'Password and Confirm Password do not match!', false);
      return;
    }

    // Panggilan API ke AuthService
    this.authService.register(this.formData).subscribe(
      (response: any) => {
        this.presentAlert('Success', 'Registration successful! Welcome to Movie Map.', true);
      },
      (error: any) => {
        console.error('Registration failed:', error);
        this.presentAlert('Error', 'Registration failed! Please try again.', false);
      }
    );
  }
}

import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Adjust the import path as needed

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  userData: any = {
    name: '',
    email: '',
    location: '',
    bio: '',
  };

  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.authService.getUserProfile().subscribe(
      (data: any) => {
        this.userData = {
          name: data.name,
          email: data.email,
          location: data.location || '',
          bio: data.bio || ''
        };
      },
      (error) => {
        this.presentErrorToast('Failed to load user profile');
        console.error('Error loading user data', error);
      }
    );
  }

  finishEditing() {
    const profileData = {
      location: this.userData.location,
      bio: this.userData.bio
    };

    this.authService.updateUserProfile(profileData).subscribe(
      async (response: any) => {
        const toast = await this.toastController.create({
          message: 'Profile updated successfully',
          duration: 2000,
          color: 'success'
        });
        toast.present();
        this.router.navigate(['/profile']); // Navigate back to profile page after successful update
      },
      async (error) => {
        const toast = await this.toastController.create({
          message: 'Failed to update profile',
          duration: 2000,
          color: 'danger'
        });
        toast.present();
        console.error('Error updating profile', error);
      }
    );
  }

  async presentErrorToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'danger'
    });
    toast.present();
  }
}
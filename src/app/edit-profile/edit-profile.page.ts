import { Component, OnInit } from '@angular/core';
import { FavoriteService } from '../services/favorite.service';
import { TmdbService } from '../services/tmdb.service';
import { AuthService } from '../services/auth.service';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';

interface FavoriteResponse {
  message: string;
  data: string[];
}

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  userData: any;
  favorite: any[] = [];
  isLoading: boolean = false;

  constructor(
    private favoriteService: FavoriteService,
    private tmdbService: TmdbService,
    private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadUserData();
    this.getFavorites();
  }

  loadUserData() {
    const data = localStorage.getItem('user');
    this.userData = data ? JSON.parse(data) : null;
  }

  async getFavorites() {
    this.isLoading = true;
    if (!this.userData || !this.userData.id) {
      console.warn('User ID not found');
      this.isLoading = false;
      return;
    }

    const userId = this.userData.id;
    try {
      const response = await firstValueFrom(
        this.favoriteService.getFavorites(userId)
      ) as FavoriteResponse;

      if (response && Array.isArray(response.data)) {
        const filmIds: string[] = response.data;
        await this.loadFilmDetails(filmIds);
      } else {
        console.error('Invalid favorites response:', response);
        this.favorite = [];
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      this.favorite = [];
    } finally {
      this.isLoading = false;
    }
  }

  async loadFilmDetails(filmIds: string[]) {
    if (filmIds.length > 0) {
      try {
        const filmDetailsPromises = filmIds.map((id) => 
          firstValueFrom(this.tmdbService.getMovieDetails(id))
        );
        const filmsData = await Promise.all(filmDetailsPromises);
        this.favorite = filmsData;
      } catch (error) {
        console.error('Error fetching film details:', error);
      }
    } else {
      console.warn('No film IDs found');
    }
  }

  async removeFavorite(movieId: string) {
    if (!this.userData || !this.userData.id) return;
    
    const loading = await this.loadingController.create({
      message: 'Removing from favorites...'
    });
    await loading.present();

    const userId = this.userData.id;
    try {
      await firstValueFrom(this.favoriteService.deleteFavorite(userId, movieId));
      this.favorite = this.favorite.filter((film) => film.id !== movieId);
      await this.presentToast('Movie removed from favorites', 'success');
    } catch (error) {
      console.error('Error removing favorite:', error);
      await this.presentToast('Failed to remove movie', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  async saveProfile() {
    if (!this.userData) return;
  
    const loading = await this.loadingController.create({
      message: 'Saving profile...'
    });
    await loading.present();
  
    const updatedUserData = {
      name: this.userData.name,
      email: this.userData.email,
      location: this.userData.location,
      bio: this.userData.bio
    };
  
    try {
      const response: any = await this.authService.updateUserProfile(updatedUserData).toPromise();
  
      // Log respons backend
      console.log('Response from backend:', response);
  
      // Update localStorage dengan data terbaru dari backend
      if (response && response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
        console.log('Updated user data in localStorage:', response.user);
        this.userData = response.user; // Perbarui userData lokal
      }
  
      await this.presentToast('Profile updated successfully', 'success');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      const errorMessage = error.error?.message || error.message || 'Failed to update profile';
      await this.presentToast(errorMessage, 'danger');
    } finally {
      await loading.dismiss();
    }
  }
  
  

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color
    });
    await toast.present();
  }
}
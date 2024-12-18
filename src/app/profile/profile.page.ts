import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { WatchlistService } from '../services/watchlist.service';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import { TmdbService } from '../services/tmdb.service';
import { ReviewService } from '../services/review.service';
import { AuthService } from '../services/auth.service';
import { FavoriteService } from '../services/favorite.service';
import { firstValueFrom } from 'rxjs';

interface FavoriteResponse {
  message: string;
  data: string[];
}

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
})


export class ProfilePage {
  userData: any; // Variable to hold user data
  watchlist: any[] = []; // Store watchlist films
  userReviews: any[] = [];
  isLoading: boolean = false;
  favorite: any[] =[];

  constructor(
    private loadingController: LoadingController,
    private watchlistService: WatchlistService,
    private tmdbService: TmdbService,
    private reviewService: ReviewService,
    private authService: AuthService,
    private http: HttpClient, 
    private router: Router,
    private favoriteService: FavoriteService,
    private alertController: AlertController, // Tambahkan alert controller
  ) {
    this.loadUserData();
    this.getFavorites();
    this.getUserReviews();
    this.getWatchlist(); // Load user data on component initialization
  }

  async loadUserData() {
    try {
      const response = await this.authService.getUserProfile().toPromise(); // Ambil data dari API
      if (response) {
        this.userData = response; // Simpan data ke userData
        console.log('User Data berhasil dimuat:', this.userData); // Debug log
      } else {
        console.warn('Data pengguna tidak ditemukan dalam respons.');
        this.userData = null;
      }
    } catch (error) {
      console.error('Gagal memuat data pengguna:', error);
      this.userData = null;
    }
  }
  
  
  async getUserReviews() {
    this.isLoading = true;
  
    try {
      // Ambil reviews
      const reviewsData = await this.reviewService.getUserReviews(this.userData.id).toPromise();
  
      // Ambil detail film untuk setiap review
      const reviewsWithMovieDetails = await Promise.all(
        reviewsData.map(async (review: { film_id: string; }) => {
          try {
            // Ambil detail film berdasarkan movie_id
            const movieDetails = await this.tmdbService.getMovieDetails(review.film_id).toPromise();
            
            // Tambahkan nama film ke review
            return {
              ...review,
              movieName: movieDetails.title || 'Unknown Movie'
            };
          } catch (error) {
            console.error(`Error fetching movie details for ID ${review.film_id}:`, error);
            return {
              ...review,
              movieName: 'Unknown Movie'
            };
          }
        })
      );
      // Update daftar review
      this.userReviews = reviewsWithMovieDetails;
    } catch (error) {
      console.error('Error in getUserReviews:', error);
      this.userReviews = [];
    } finally {
      this.isLoading = false;
    }
  }
  
  async getFavorites() {
    this.isLoading = true;
    console.log(this.userData);
    
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
  
      console.log('Raw Favorites Response:', response); // Tambahkan logging
  
      if (response && Array.isArray(response.data)) {
        const filmIds: string[] = response.data;
        console.log('Favorite Film IDs:', filmIds); // Logging film IDs
  
        // Ambil detail film untuk setiap ID favorit
        const favoriteFilmsPromises = filmIds.map(id => 
          this.tmdbService.getMovieDetails(id).toPromise()
        );
  
        this.favorite = await Promise.all(favoriteFilmsPromises);
        console.log('Favorite Films Details:', this.favorite);
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
  getStarArray(rating: number): number[] {
    return Array(rating).fill(0);
  }
  

  async presentAlert(header: string, message: string, response: any) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async removeWatchlist(filmId: string) {
    // Show the loading spinner
    const loading = await this.loadingController.create({
      message: 'Removing film from watchlist...',
    });
    await loading.present();
  
    // Check if user data is available
    if (!this.userData || !this.userData.id) {
      console.warn('User data or User ID not found');
      await loading.dismiss(); // Dismiss loading if no user data
      return;
    }
  
    const userId = this.userData.id;
  
    try {
      // Remove the film from the watchlist via the service
      const response = await this.watchlistService.deleteWatchlist(userId, filmId).toPromise();
      this.presentAlert('Success', 'Film removed from watchlist:', response);
  
      // Update the local watchlist by filtering out the removed film
      this.watchlist = this.watchlist.filter(film => film.id !== filmId);
      console.log('Updated Watchlist:', this.watchlist);
    } catch (error) {
      console.error('Error removing film from watchlist:', error);
      alert('Failed to remove the film from your watchlist.');
    } finally {
      await loading.dismiss(); // Dismiss the loading spinner after the operation completes
    }
  }
  
  async getWatchlist() {
    this.isLoading = true; // Start loading state
    console.log('Fetching watchlist...');

    if (!this.userData || !this.userData.id) {
      console.warn('User data or User ID not found');
      this.isLoading = false;
      return;
    }

    const userId = this.userData.id; // Retrieve the user ID from userData
    console.log('User ID:', userId); // Debug log to check if userId is retrieved

    try {
      // Fetch the list of film IDs (id_film)
      const watchlistData = await this.watchlistService.getWatchlist(userId).toPromise();
      console.log('Watchlist data fetched:', watchlistData); // Debug log to check the watchlist data

      // Check the format of the response
      if (watchlistData && watchlistData.data && Array.isArray(watchlistData.data)) {
        const filmIds = watchlistData.data;
        console.log('Extracted Film IDs:', filmIds); // Debug log to check the extracted film IDs
        await this.loadFilmDetails(filmIds); // Fetch detailed film data after watchlist is loaded
      } else {
        console.error('Watchlist data is not in the expected format:', watchlistData);
        this.watchlist = []; // Ensure the watchlist is an empty array if the format is incorrect
      }
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      this.watchlist = []; // Ensure watchlist is empty on error
    } finally {
      this.isLoading = false; // End loading state
    }
  }

  async ngOnInit() {
    await this.loadUserData(); // Wait for user data to load
    if (this.userData && this.userData.id) {
      this.getWatchlist(); // Fetch the watchlist after userData is available
      this.getUserReviews(); // Fetch user reviews after userData is available
      this.getFavorites(); // Now we can safely call getFavorites
    } else {
      console.warn('User data not available after initialization.');
    }
  }

  // Load detailed film data based on the watchlist's id_film
  async loadFilmDetails(filmIds: string[]) {
    console.log('Film IDs to load details:', filmIds); // Debug log to check the film IDs

    if (filmIds.length > 0) {
      try {
        const filmDetailsPromises = filmIds.map((id_film: string) =>
          this.tmdbService.getMovieDetails(id_film).toPromise()
        );
        console.log('Fetching film details...'); // Debug log before fetching film details

        // Wait for all the film details to be fetched
        const filmsData = await Promise.all(filmDetailsPromises);
        console.log('Films data fetched:', filmsData); // Debug log after fetching film details

        // Assign the detailed film data to the watchlist
        this.watchlist = filmsData;
      } catch (error) {
        console.error('Error fetching film details:', error);
      }
    } else {
      console.warn('No film IDs found in the watchlist');
    }
  }

  // Logout with confirmation
  async logout() {
    // Membuat alert konfirmasi
    const alert = await this.alertController.create({
      header: 'Exit',
      message: 'Are you sure you want to exit?',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Logout dibatalkan');
          }
        },
        {
          text: 'Exit',
          handler: () => {
            // Jika user memilih "Keluar", lanjutkan dengan logout
            const token = localStorage.getItem('token');
            const headers = new HttpHeaders({
              'Authorization': `Bearer ${token}` // Setel header Authorization
            });

            console.log('Logging out with token:', token); // Debug log untuk logout
            this.http.post<HttpResponse<any>>('http://localhost:8000/api/logout', {}, { headers })
              .subscribe(
                (response: HttpResponse<any>) => {
                  console.log('Logout berhasil', response);
                  localStorage.removeItem('user'); // Hapus data user dari localStorage
                  localStorage.removeItem('token'); // Hapus token dari localStorage
                  this.router.navigate(['/login']); // Arahkan ke halaman login
                },
                (error: any) => {
                  console.error('Logout error', error);
                }
              );
          }
        }
      ]
    });

    await alert.present(); // Tampilkan alert konfirmasi
  }
  async removeFavorite(movieId: string) {
    // Show the loading spinner
    const loading = await this.loadingController.create({
      message: 'Removing from favorites...',
    });
    await loading.present();
  
    // Check if user data is available
    if (!this.userData || !this.userData.id) {
      console.warn('User data or User ID not found');
      await loading.dismiss(); // Dismiss loading if no user data
      return;
    }
  
    const userId = this.userData.id;
  
    try {
      // Remove the film from the favorites via the service
      const response = await this.favoriteService.deleteFavorite(userId, movieId).toPromise();
      await this.presentAlert('Success', 'Movie removed from favorites:', response);
  
      // Update the local favorite list by filtering out the removed film
      this.favorite = this.favorite.filter(film => film.id !== movieId);
      console.log('Updated Favorites:', this.favorite);
    } catch (error) {
      console.error('Error removing movie from favorites:', error);
    } finally {
      await loading.dismiss(); // Dismiss the loading spinner after the operation completes
    }
  }
  
}

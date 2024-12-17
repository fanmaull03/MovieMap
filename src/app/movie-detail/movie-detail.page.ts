import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WatchlistService } from '../services/watchlist.service';
import { TmdbService } from '../services/tmdb.service';
import {
  NavController,
  AlertController,
  LoadingController,
} from '@ionic/angular';
import { ReviewService } from '../services/review.service';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.page.html',
  styleUrls: ['./movie-detail.page.scss'],
})
export class MovieDetailPage implements OnInit {
  movieDetails: any = {};
  reviews: any[] = [];
  error: string = '';
  isLoading: boolean = false; // Untuk loading indicator
  user: any = JSON.parse(localStorage.getItem('user') || '{}'); // Ensure user data is parsed
  newReview = {
    film_id: this.route.snapshot.paramMap.get('id'),
    user_id: this.user?.id || null, // Safely access user.id or set to null
    rating: 0, // Ubah tipe rating menjadi angka untuk bintang
    comment: '',
  };
  stars = [1, 2, 3, 4, 5]; // Untuk sistem bintang

  constructor(
    private route: ActivatedRoute,
    private tmdbService: TmdbService,
    private reviewService: ReviewService,
    private watchlistService: WatchlistService,
    private navCtrl: NavController,
    private alertController: AlertController, // Tambahkan alert controller
    private loadingController: LoadingController // Tambahkan loading controller
  ) {}

  ngOnInit() {
    const imdbID = this.route.snapshot.paramMap.get('id');
    if (imdbID) {
      this.fetchMovieDetails(imdbID);
      this.getReviews(imdbID);
    }
  }

  async fetchMovieDetails(imdbID: string) {
    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Loading movie details...',
    });
    await loading.present();

    this.tmdbService.getMovieDetails(imdbID).subscribe(
      (response) => {
        this.movieDetails = response;
        this.error = '';
        this.getReviews(imdbID);
        this.isLoading = false;
        loading.dismiss();
      },
      (err: any) => {
        this.error = 'Failed to fetch movie details';
        this.isLoading = false;
        loading.dismiss();
      }
    );
  }

  getReviews(imdbID: string) {
    this.reviewService.getReview(imdbID).subscribe(
      (data) => {
        this.reviews = data;
      },
      (error: any) => {
        console.error('Error fetching reviews:', error);
      }
    );
  }

  getGenres(): string {
    return (
      this.movieDetails.genres?.map((genre: any) => genre.name).join(', ') ||
      'N/A'
    );
  }

  getProductionCompanies(): string {
    return (
      this.movieDetails.production_companies
        ?.map((company: any) => company.name)
        .join(', ') || 'N/A'
    );
  }

  getRuntime(): string {
    const hours = Math.floor(this.movieDetails.runtime / 60);
    const minutes = this.movieDetails.runtime % 60;
    return `${hours}h ${minutes}m`;
  }

  goBack() {
    this.navCtrl.back();
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  setRating(rating: number) {
    this.newReview.rating = rating;
  }

  getStarArray(rating: number): number[] {
    return Array(rating).fill(0); // Membuat array sebanyak jumlah rating
  }
  async addWatchlist() {
    // Validasi film_id
    if (this.movieDetails && this.movieDetails.id) {
        try {
            this.isLoading = true; // Set loading state
            // Data payload yang akan dikirim ke server
            const payload = {
                film_id: this.movieDetails.id,
                user_id: this.user.id
            };
            // Kirim request ke server menggunakan HTTP Client
            const response = await this.watchlistService.addWatchlist(payload).toPromise();
            // Log response
            console.log('Success:', response);
            // Feedback ke pengguna
            this.presentAlert('Success', 'Film added to watchlist successfully!');
        } catch (error) {
            console.error('Error adding to watchlist:', error);
            this.presentAlert('Sorry', 'This Film has Already added in Your Watchlists');
        } finally {
            this.isLoading = false; // Reset loading state
        }
    } else {
        // Jika film_id tidak valid
        this.presentAlert('Error', 'Film ID is required to add to watchlist.');
    }
}

  async submitReview() {
    if (!this.newReview.rating || !this.newReview.comment.trim()) {
      this.presentAlert('Error', 'Please provide a rating and a comment.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Submitting your review...',
    });
    await loading.present();

    if (this.newReview.film_id) {
      this.reviewService.submitReview(this.newReview).subscribe(
        (response: any) => {
          this.presentAlert(
            'Success',
            'Your review has been submitted successfully.'
          );
          this.getReviews(this.newReview.film_id!); // Refresh reviews
          this.newReview.rating = 0; // Reset rating to 0
          this.newReview.comment = ''; // Reset comment
          loading.dismiss();
        },
        (error: any) => {
          console.error('Error submitting review:', error);
          this.presentAlert('Sorry', 'You have already submitted a review.');
          loading.dismiss();
        }
      );
    } else {
      console.error('Film ID is missing or invalid');
      this.presentAlert('Error', 'Film ID is missing or invalid.');
      loading.dismiss();
    }
  }
}

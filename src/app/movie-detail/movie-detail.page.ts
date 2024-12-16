import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TmdbService } from '../services/tmdb.service';
import { NavController } from '@ionic/angular';
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
  user: any = JSON.parse(localStorage.getItem('user') || '{}');  // Ensure user data is parsed
  newReview = {
    film_id: this.route.snapshot.paramMap.get('id'),
    user_id: this.user?.id || null,  // Safely access user.id or set to null
    rating: '',
    comment: '',
  };

  constructor(
    private route: ActivatedRoute,
    private tmdbService: TmdbService,
    private reviewService: ReviewService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    const imdbID = this.route.snapshot.paramMap.get('id');
    if (imdbID) {
      this.tmdbService.getMovieDetails(imdbID).subscribe(
        (response) => {
          this.movieDetails = response;
          this.error = '';
          console.log(this.movieDetails);
          this.getReviews(imdbID);
        },
        (err: any) => {  // Add explicit 'any' type for error
          this.error = 'Failed to fetch movie details';
        }
      );
    }
  }

  getReviews(imdbID: string) {
    this.reviewService.getReview(imdbID).subscribe(
      (data) => {
        this.reviews = data;
        console.log(this.reviews);
      },
      (error: any) => {  // Add explicit 'any' type for error
        console.error('Error fetching reviews:', error);
      }
    );
  }

  getGenres(): string {
    return this.movieDetails.genres?.map((genre: any) => genre.name).join(', ') || 'N/A';
  }

  getProductionCompanies(): string {
    return this.movieDetails.production_companies?.map((company: any) => company.name).join(', ') || 'N/A';
  }

  getRuntime(): string {
    const hours = Math.floor(this.movieDetails.runtime / 60);
    const minutes = this.movieDetails.runtime % 60;
    return `${hours}h ${minutes}m`;
  }

  goBack() {
    this.navCtrl.back();
  }

  submitReview() {
    // Ensure film_id is a string and handle the submit review logic
    if (this.newReview.film_id) {
      this.reviewService['submitReview'](this.newReview).subscribe(
        (response: any) => {  // Add explicit 'any' type for response
          console.log('Review submitted successfully:', response);
          
        },
        (error: any) => {  // Add explicit 'any' type for error
          console.error('Error submitting review:', error);
        }
      );
    } else {
      console.error('Film ID is missing or invalid');
    }
  }
}

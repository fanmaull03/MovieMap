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
        (err) => {
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
      (error) => {
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
}

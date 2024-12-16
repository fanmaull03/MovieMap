import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OmdbService } from '../services/omdb.service';
import { NavController } from '@ionic/angular';
import { ReviewService } from '../services/review.service';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.page.html',
  styleUrls: ['./movie-detail.page.scss'],
})
export class MovieDetailPage implements OnInit {
  movieDetails: any = {};
  reviews: any[] = []; // Array untuk menyimpan review
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private omdbService: OmdbService,
    private reviewService: ReviewService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    const imdbID = this.route.snapshot.paramMap.get('id');
    if (imdbID) {
      this.omdbService.getMovieDetails(imdbID).subscribe(
        (response) => {
          this.movieDetails = response;
          this.error = '';
          console.log(this.movieDetails);
          this.getReviews(imdbID); // Panggil method untuk mendapatkan review
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
        this.reviews = data; // Simpan data review ke dalam variabel
        console.log(this.reviews);
      },
      (error) => {
        console.error('Error fetching reviews:', error);
      }
    );
  }

  goBack() {
    this.navCtrl.back();  // Navigasi kembali ke halaman sebelumnya
  }
}
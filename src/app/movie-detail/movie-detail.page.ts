import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OmdbService } from '../services/omdb.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.page.html',
  styleUrls: ['./movie-detail.page.scss'],
})
export class MovieDetailPage implements OnInit {
  movieDetails: any = {};
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private omdbService: OmdbService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    const imdbID = this.route.snapshot.paramMap.get('id');
    if (imdbID) {
      this.omdbService.getMovieDetails(imdbID).subscribe(
        (response) => {
          this.movieDetails = response;
          this.error = '';
        },
        (err) => {
          this.error = 'Failed to fetch movie details';
        }
      );
    }
  }

  goBack() {
    this.navCtrl.back();  // Navigasi kembali ke halaman sebelumnya
  }
}

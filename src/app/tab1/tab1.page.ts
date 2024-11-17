import { Component } from '@angular/core';
import { OmdbService } from '../services/omdb.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page {
  query: string = '';
  movies: any[] = [];
  error: string = '';

  constructor(private omdbService: OmdbService, private router: Router) {}

  searchMovies() {
    if (!this.query.trim()) {
      this.error = 'Please enter a movie title.';
      this.movies = [];
      return;
    }

    this.omdbService.searchMovies(this.query).subscribe(
      (response) => {
        if (response.Response === 'True') {
          this.movies = response.Search;
          this.error = '';
        } else {
          this.error = response.Error;
          this.movies = [];
        }
      },
      (err) => {
        this.error = 'Failed to fetch movies. Please try again later.';
        console.error(err);
      }
    );
  }

  goToMovieDetail(movieId: string) {
    console.log('Navigating to movie detail:', movieId); // Debug log
    this.router.navigate(['/movie-detail', movieId]);
  }
}

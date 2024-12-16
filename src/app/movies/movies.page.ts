import { Component } from '@angular/core';
import { TmdbService } from '../services/tmdb.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
})
export class MoviesPage {
  query: string = '';
  movies: any[] = [];
  error: string = '';

  constructor(private tmdbService: TmdbService, private router: Router) {}

  ngOnInit() {
    // Corrected: Calling the method with parentheses to execute it
    this.getPopularMovies();
    console.log('Loaded');
  }

  searchMovies() {
    if (!this.query.trim()) {
      this.error = 'Please enter a movie title.';
      this.movies = [];
      return;
    }

    this.tmdbService.searchMovies(this.query).subscribe(
      (response) => {
        // Memeriksa apakah respons berisi data film
        if (response.results && response.results.length > 0) {
          this.movies = response.results;
          this.error = '';
        } else {
          this.error = 'No movies found.';
          this.movies = [];
        }
      },
      (err) => {
        this.error = 'Failed to fetch movies. Please try again later.';
        console.error(err);
      }
    );
  }

  getPopularMovies() {
    console.log('Fetching popular movies...');
    this.tmdbService.getPopularMovies().subscribe(
      (response) => {
        console.log('Response received:', response); // Debug log
        if (response.results && response.results.length > 0) {
          this.movies = response.results;
          this.error = ''; // Clear error message if data is available
        } else {
          this.error = 'No movies found.';
          this.movies = [];
        }
      },
      (err) => {
        console.error('Error fetching movies:', err);
        this.error = 'Failed to fetch movies. Please try again later.';
      }
    );
  }

  goToMovieDetail(movieId: string) {
    console.log('Navigating to movie detail:', movieId); // Debug log
    this.router.navigate(['/movie-detail', movieId]);
  }
}

import { Component, OnInit } from '@angular/core';
import { TmdbService } from '../services/tmdb.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
})
export class MoviesPage implements OnInit {
  query: string = '';
  movies: any[] = [];
  error: string = '';

  constructor(private tmdbService: TmdbService, private router: Router) {}

  ngOnInit() {
    this.getPopularMovies(); // Fetch popular movies when component loads
    console.log('Movies page loaded');
  }

  // Method to search movies by query
  searchMovies() {
    if (!this.query.trim()) {
      this.error = 'Please enter a movie title.';
      this.movies = [];
      return;
    }

    this.tmdbService.searchMovies(this.query).subscribe(
      (response) => {
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

  // Method to fetch popular movies from TMDB
  getPopularMovies() {
    console.log('Fetching popular movies...');
    this.tmdbService.getPopularMovies().subscribe(
      (response) => {
        console.log('Response received:', response);
        if (response.results && response.results.length > 0) {
          this.movies = response.results;
          this.error = '';
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

  // Helper method to get full image URL from TMDB
  getImageUrl(posterPath: string): string {
    const baseUrl = 'https://image.tmdb.org/t/p/w500'; // 500px width
    return posterPath ? baseUrl + posterPath : 'assets/img/no-image.jpg'; // Fallback if no poster available
  }

  // Navigate to movie detail page
  goToMovieDetail(movieId: number) {
    console.log('Navigating to movie detail:', movieId);
    this.router.navigate(['/movie-detail', movieId]);
  }
}

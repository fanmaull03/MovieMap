import { Component, OnInit } from '@angular/core';
import { TmdbService } from '../services/tmdb.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

interface TmdbMovie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  overview: string;
  vote_average: number;
  posterUrl?: string; // Ditambahkan properti opsional
  year?: string; // Ditambahkan properti opsional
}

@Component({
  selector: 'app-lists',
  templateUrl: 'lists.page.html',
  styleUrls: ['lists.page.scss']
})
export class ListsPage implements OnInit {
  selectedSegment = 'REVIEWS';
  nowPlayingMovies: TmdbMovie[] = [];
  filteredMovies: TmdbMovie[] = [];
  searchQuery: string = '';
  error: string = '';

  constructor(
    private tmdbService: TmdbService,
    private router: Router,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.loadNowPlayingMovies();
  }

  async loadNowPlayingMovies() {
    const loading = await this.loadingController.create({
      message: 'Loading Now Playing Movies...',
      spinner: 'circles'
    });
    await loading.present();

    this.tmdbService.getNowPlayingMovies().subscribe(
      (response) => {
        this.nowPlayingMovies = response.results.map((movie: TmdbMovie) => ({
          ...movie,
          posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          year: movie.release_date
            ? new Date(movie.release_date).getFullYear().toString()
            : 'Unknown'
        }));
        this.filteredMovies = [...this.nowPlayingMovies];
        loading.dismiss();
      },
      (error) => {
        this.error = 'Failed to load now playing movies. Please try again later.';
        loading.dismiss();
        console.error('Error fetching now playing movies:', error);
      }
    );
  }

  // Search functionality for now playing movies
  filterMovies() {
    if (!this.searchQuery.trim()) {
      this.filteredMovies = [...this.nowPlayingMovies];
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredMovies = this.nowPlayingMovies.filter((movie) =>
        movie.title.toLowerCase().includes(query)
      );
    }
  }

  // Navigate to movie detail page
  goToMovieDetail(movieId: number) {
    this.router.navigate(['/movie-detail', movieId]);
  }

  // Refresh now playing movies
  async refreshNowPlayingMovies(event?: any) {
    await this.loadNowPlayingMovies();
    if (event) {
      event.target.complete();
    }
  }
}

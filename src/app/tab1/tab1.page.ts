import { Component } from '@angular/core';
import { OmdbService } from '../services/omdb.service';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page {
  query: string = '';
  movies: any[] = [];
  error: string = '';

  constructor(private omdbService: OmdbService) {}

  searchMovies() {
    if (this.query.trim() === '') {
      this.error = 'Please enter a search term!';
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
      (error) => {
        this.error = 'An error occurred while fetching movies.';
        console.error(error);
      }
    );
  }
}

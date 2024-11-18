// tab2.page.ts
import { Component, OnInit } from '@angular/core';
import { OmdbService } from '../services/omdb.service';
import { Router } from '@angular/router';

interface Review {
  imdbID: string;
  movieTitle: string;
  year: string;
  posterUrl: string;
  rating: number;
  reviewText: string;
  reviewer: string;
  reviewerAvatar: string;
}

@Component({
  selector: 'app-lists',
  templateUrl: 'lists.page.html',
  styleUrls: ['lists.page.scss']
})
export class ListsPage implements OnInit {
  selectedSegment = 'REVIEWS';
  reviews: Review[] = [];
  error: string = '';
  
  // cara cari ID = cari filmnya > https://www.imdb.com/title/[ID Filmnya]/
  mockReviews = [
    {
      imdbID: 'tt21064584', // ID untuk "The Iron Claw"
      reviewText: 'Mikey Madison is superb in this very unique effort. The comparisons don\'t hold up beyond some basic plot set-up, and after the stage is set, the film is utterly unpredictable, quite funny, and hides surprising depth.',
      rating: 4,
      reviewer: 'Mike',
      reviewerAvatar: 'assets/avatar1.jpg'
    },
    {
      imdbID: 'tt14230458', // ID untuk "Poor Things"
      reviewText: 'We were gonna make so many things together. We were going to put out art that would matter to people and affect their lives. We were going to do it together.',
      rating: 4.5,
      reviewer: 'James',
      reviewerAvatar: 'assets/avatar2.jpg'
    },
    {
      imdbID: 'tt28015403', // ID untuk "heretic"
      reviewText: 'Jigsaw if he was an insufferable reddit atheist',
      rating: 2.5,
      reviewer: 'Stacey',
      reviewerAvatar: 'assets/avatar3.jpg'
    }
  ];

  constructor(
    private omdbService: OmdbService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadReviews();
  }

  loadReviews() {
    // Mengambil detail film untuk setiap review
    this.mockReviews.forEach(review => {
      this.omdbService.getMovieDetails(review.imdbID).subscribe(
        (movieData) => {
          if (movieData.Response === 'True') {
            this.reviews.push({
              ...review,
              movieTitle: movieData.Title,
              year: movieData.Year,
              posterUrl: movieData.Poster !== 'N/A' ? movieData.Poster : 'assets/placeholder-poster.jpg',
              imdbID: review.imdbID
            });
          }
        },
        (error) => {
          this.error = 'Failed to fetch movie details';
          console.error(error);
        }
      );
    });
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }

  goToMovieDetail(movieId: string) {
    this.router.navigate(['/movie-detail', movieId]);
  }
}
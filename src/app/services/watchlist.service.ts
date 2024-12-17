import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WatchlistService {
  private apiUrl = 'http://localhost:8000/api/watchlists/';

  constructor(private http: HttpClient) {}

  // Construct and return the base URL
  private watchlistURL(): string {
    return this.apiUrl;
  }

  // Add a new review to the watchlist
  addWatchlist(reviewData: any): Observable<any> {
    return this.http.post(this.watchlistURL(), reviewData);
  }

  // Get review by ID from the watchlist
  getWatchlist(id: any): Observable<any> {
    return this.http.get(`${this.watchlistURL()}${id}`);
  }
  deleteWatchlist(user_id: any, film_id: any): Observable<any> {
  return this.http.delete(`${this.watchlistURL()}${user_id}/${film_id}`);
}
}

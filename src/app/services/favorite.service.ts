import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private apiUrl = 'http://localhost:8000/api/favorites/';

  constructor(private http: HttpClient) {}

  // Construct and return the base URL
  private favoriteURL(): string {
    return this.apiUrl;
  }

  // Add a new review to the favorite
  addFavorite(reviewData: any): Observable<any> {
    return this.http.post(this.favoriteURL(), reviewData);
  }

  // Get review by ID from the favorite
  getFavorite(id: any): Observable<any> {
    return this.http.get(`${this.favoriteURL()}${id}`);
  }
  deleteFavorite(user_id: any, film_id: any): Observable<any> {
  return this.http.delete(`${this.favoriteURL()}${user_id}/${film_id}`);
}

getFavorites(userId: any): Observable<any> {
  return this.http.get(`${this.favoriteURL()}${userId}`);
}

}

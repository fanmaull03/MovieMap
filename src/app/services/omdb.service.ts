import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OmdbService {
  private apiUrl = `https://www.omdbapi.com/?apikey=${environment.omdbApiKey}`;

  constructor(private http: HttpClient) {}

  searchMovies(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}&s=${query}`);
  }
}

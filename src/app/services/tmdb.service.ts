import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment'; // Pastikan environment.js sudah disiapkan

@Injectable({
  providedIn: 'root'
})
export class TmdbService {
  private apiUrl = 'https://api.themoviedb.org/3';  // Base URL TMDB
  private apiKey = environment.tmdbApiKey; // Ambil API key dari environment

  constructor(private http: HttpClient) { }

  // Fungsi untuk pencarian film berdasarkan query
  searchMovies(query: string): Observable<any> {
    const url = `${this.apiUrl}/search/movie?api_key=${this.apiKey}&query=${query}`;
    return this.http.get<any>(url);
  }

  // Fungsi untuk mendapatkan detail film berdasarkan ID
  getMovieDetails(id: string): Observable<any> {
    const url = `${this.apiUrl}/movie/${id}?api_key=${this.apiKey}`;
    return this.http.get<any>(url);
  }

  // Fungsi untuk mendapatkan daftar film populer
  getPopularMovies(): Observable<any> {
    const url = `${this.apiUrl}/movie/popular?api_key=${this.apiKey}`;
    return this.http.get<any>(url);
  }

  // Fungsi untuk mendapatkan film yang sedang tayang (now playing)
  getNowPlayingMovies(): Observable<any> {
    const url = `${this.apiUrl}/movie/now_playing?api_key=${this.apiKey}&page=1`;
    return this.http.get<any>(url);
  }
}

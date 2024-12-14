import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  constructor(private http: HttpClient) {
  }
  reviewURL() {
    return 'http://localhost:8000/api/reviews';
  }
  postReview(data: any): Observable<any> {
    return this.http.post(`${this.reviewURL()}/`, data);
  }
  getReview($id: any): Observable<any> {
    return this.http.get(`${this.reviewURL()}/` + $id);
  }
}

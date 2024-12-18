import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  [x: string]: any;
  constructor(private http: HttpClient) {
  }
  reviewURL() {
    return 'http://localhost:8000/api/reviews';
  }
  submitReview(reviewData: any): Observable<any> {
    return this.http.post(`${this.reviewURL()}/`, reviewData);
  }
  getReview($id: any): Observable<any> {
    return this.http.get(`${this.reviewURL()}/` + $id);
  }

  getUserReviews(userId: any): Observable<any> {
    return this.http.get(`${this.reviewURL()}/user/` + userId);
  }
  
}

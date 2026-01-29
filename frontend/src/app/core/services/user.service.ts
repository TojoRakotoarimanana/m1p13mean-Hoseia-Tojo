import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  list(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  listPendingBoutiques(): Observable<any> {
    return this.http.get(`${this.apiUrl}/boutiques/pending`);
  }

  approveBoutique(userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/boutiques/${userId}/approve`, {});
  }

  rejectBoutique(userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/boutiques/${userId}/reject`, {});
  }
}

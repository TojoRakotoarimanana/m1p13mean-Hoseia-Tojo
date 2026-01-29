import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:3000/api/categories';

  constructor(private http: HttpClient) {}

  list(type?: string): Observable<any> {
    let params = new HttpParams();
    if (type) {
      params = params.set('type', type);
    }
    return this.http.get(this.apiUrl, { params });
  }

  getById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  update(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  remove(id: string, deletedByUserId?: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { body: { deletedByUserId } });
  }
}

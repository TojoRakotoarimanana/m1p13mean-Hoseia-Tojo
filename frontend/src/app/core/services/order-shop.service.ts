import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrderShopService {
  private apiUrl = 'http://localhost:3000/api/shop/orders';

  constructor(private http: HttpClient) {}

  list(params: any): Observable<any> {
    let httpParams = new HttpParams();
    Object.keys(params || {}).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        httpParams = httpParams.set(key, params[key]);
      }
    });
    return this.http.get(this.apiUrl, { params: httpParams });
  }

  getById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updateStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, { status });
  }

  stats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }
}

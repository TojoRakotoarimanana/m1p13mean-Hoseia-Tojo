import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private apiUrl = 'http://localhost:3000/api/shops';

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

  create(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  update(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  suspend(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/suspend`, {});
  }

  remove(id: string, deletedByUserId?: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { body: { deletedByUserId } });
  }
}

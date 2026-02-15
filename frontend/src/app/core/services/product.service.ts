import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) {}

  listMy(params: any): Observable<any> {
    let httpParams = new HttpParams();
    Object.keys(params || {}).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        httpParams = httpParams.set(key, params[key]);
      }
    });
    return this.http.get(`${this.apiUrl}/my-products`, { params: httpParams });
  }

  getById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  create(data: FormData): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  update(id: string, data: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  remove(id: string, deletedByUserId?: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { body: { deletedByUserId } });
  }

  updateStock(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/stock`, data);
  }

  updatePromotion(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/promotion`, data);
  }

  stats(shopId: string): Observable<any> {
    const params = new HttpParams().set('shopId', shopId);
    return this.http.get(`${this.apiUrl}/stats`, { params });
  }
}

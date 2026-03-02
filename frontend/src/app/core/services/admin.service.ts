import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface GlobalStats {
  shops: {
    total: number;
    active: number;
    pending: number;
    suspended: number;
    rejected: number;
    activePercentage: string;
  };
  users: {
    total: number;
    weeklyGrowth: number;
  };
  products: {
    total: number;
    weeklyGrowth: number;
  };
  orders: {
    total: number;
    today: number;
    weeklyGrowth: number;
  };
  revenue: {
    total: number;
    today: number;
    weeklyGrowth: number;
  };
  categories: {
    total: number;
  };
}

export interface Activity {
  id: string;
  type: 'shop' | 'user' | 'order' | 'product';
  action: string;
  title: string;
  description: string;
  status: string;
  timestamp: string;
  relatedData?: any;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = `${environment.apiUrl}/api/admin`;

  constructor(private http: HttpClient) {}

  getGlobalStats(): Observable<{ success: boolean; data: GlobalStats }> {
    return this.http.get<{ success: boolean; data: GlobalStats }>(`${this.baseUrl}/stats`);
  }

  getRecentActivities(limit: number = 20): Observable<{ 
    success: boolean; 
    data: { 
      activities: Activity[];
      total: number;
      limit: number;
    }
  }> {
    return this.http.get<{ 
      success: boolean; 
      data: { 
        activities: Activity[];
        total: number;
        limit: number;
      }
    }>(`${this.baseUrl}/activities?limit=${limit}`);
  }

  getShopStatsByCategory(): Observable<any> {
    return this.http.get(`${this.baseUrl}/stats/categories`);
  }

  getOrdersByDay(days: number = 7): Observable<any> {
    return this.http.get(`${this.baseUrl}/stats/orders-by-day?days=${days}`);
  }

  getRevenueByMonth(months: number = 6): Observable<any> {
    return this.http.get(`${this.baseUrl}/stats/revenue-by-month?months=${months}`);
  }

  getOrdersByMonth(months: number = 6): Observable<any> {
    return this.http.get(`${this.baseUrl}/stats/orders-by-month?months=${months}`);
  }

  getPendingShops(): Observable<any> {
    return this.http.get(`${this.baseUrl}/shops/pending`);
  }

  getAdminOrders(params: Record<string, any> = {}): Observable<any> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        httpParams = httpParams.set(key, params[key]);
      }
    });
    return this.http.get(`${this.baseUrl}/orders`, { params: httpParams });
  }

  updateOrderStatus(orderId: string, status: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/orders/${orderId}/status`, { status });
  }
}

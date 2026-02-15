import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private baseUrl = 'http://localhost:3000/api/admin';

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
}

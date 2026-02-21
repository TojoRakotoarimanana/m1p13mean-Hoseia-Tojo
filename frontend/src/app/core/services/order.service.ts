import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface OrderItem {
    product: any;
    quantity: number;
    price: number;
}

export interface SubOrder {
    shopId: any;
    items: any[];
    subtotal: number;
    status: string;
}

export interface Order {
    _id: string;
    orderNumber: string;
    customer: any;
    items?: any[];
    shopOrders?: SubOrder[];
    totalAmount: number;
    status: string;
    deliveryInfo?: {
        method: string;
        address: {
            street: string;
            city: string;
            zipCode?: string;
            country?: string;
        };
        phone: string;
    };
    paymentMethod: string;
    paymentInfo?: any;
    createdAt: Date;
    updatedAt: Date;
}

export interface OrdersResponse {
    orders: Order[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalOrders: number;
    };
}

interface BackendOrdersResponse {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    items: Order[];
}

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = 'http://localhost:3000/api/orders';

    constructor(private http: HttpClient) { }

    // Créer une commande
    createOrder(orderData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}`, orderData);
    }

    // Obtenir les commandes de l'utilisateur (client)
    getMyOrders(filters: any = {}): Observable<OrdersResponse> {
        let params = new HttpParams();
        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                params = params.set(key, filters[key]);
            }
        });

        params = params.set('_ts', Date.now().toString());

        return this.http.get<BackendOrdersResponse>(`${this.apiUrl}`, { params }).pipe(
            map((res) => ({
                orders: res.items || [],
                pagination: {
                    currentPage: res.page || 1,
                    totalPages: res.totalPages || 1,
                    totalOrders: res.total || 0
                }
            }))
        );
    }

    // Obtenir les détails d'une commande
    getOrderById(id: string): Observable<Order> {
        return this.http.get<Order>(`${this.apiUrl}/${id}`);
    }

    // Annuler une commande
    cancelOrder(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    // Obtenir l'historique (les anciennes commandes)
    getOrderHistory(): Observable<Order[]> {
        return this.http.get<BackendOrdersResponse>(`${this.apiUrl}`, {
            params: new HttpParams().set('page', 1).set('limit', 100).set('_ts', Date.now().toString())
        }).pipe(
            map((res) => res.items || [])
        );
    }
}

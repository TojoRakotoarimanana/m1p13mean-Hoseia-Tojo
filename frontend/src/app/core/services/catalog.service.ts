import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  discount: number;
  isPromotion: boolean;
  promoStartDate?: Date;
  promoEndDate?: Date;
  images: string[];
  stock: {
    quantity: number;
    lowStockAlert: number;
  };
  category: {
    _id: string;
    name: string;
    type: string;
  };
  shopId: {
    _id: string;
    name: string;
    logo?: string;
    status: string;
  };
  statistics: {
    views: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Shop {
  _id: string;
  name: string;
  description?: string;
  logo?: string;
  category: {
    _id: string;
    name: string;
    type: string;
  };
  location: {
    floor?: string;
    zone?: string;
    shopNumber?: string;
  };
  contact: {
    phone?: string;
    email?: string;
  };
  hours: {
    [key: string]: { open?: string; close?: string };
  };
  status: string;
  statistics: {
    totalOrders: number;
    totalProducts: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CatalogResponse<T> {
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts?: number;
    totalShops?: number;
    totalPromotions?: number;
    totalResults?: number;
    limit: number;
  };
}

export interface ProductsResponse extends CatalogResponse<Product> {
  products: Product[];
}

export interface ShopsResponse extends CatalogResponse<Shop> {
  shops: Shop[];
}

export interface PromotionsResponse extends CatalogResponse<Product> {
  promotions: Product[];
}

export interface ShopDetailsResponse {
  shop: Shop;
  products: Product[];
  totalProducts: number;
}

export interface SearchResponse {
  products?: Product[];
  shops?: Shop[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalResults: number;
    limit: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private apiUrl = `${environment.apiUrl}/api/catalog`;

  constructor(private http: HttpClient) { }

  // Récupérer tous les produits publics
  getProducts(filters: {
    page?: number;
    limit?: number;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    shopId?: string;
  } = {}): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(`${this.apiUrl}/products`, { params: filters as any });
  }

  // Récupérer un produit par ID
  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  // Récupérer toutes les boutiques actives
  getShops(filters: {
    page?: number;
    limit?: number;
    category?: string;
  } = {}): Observable<ShopsResponse> {
    return this.http.get<ShopsResponse>(`${this.apiUrl}/shops`, { params: filters as any });
  }

  // Récupérer une boutique par ID avec ses produits
  getShopById(id: string): Observable<ShopDetailsResponse> {
    return this.http.get<ShopDetailsResponse>(`${this.apiUrl}/shops/${id}`);
  }

  // Récupérer les produits en promotion
  getPromotions(filters: {
    page?: number;
    limit?: number;
    category?: string;
    shopId?: string;
  } = {}): Observable<PromotionsResponse> {
    return this.http.get<PromotionsResponse>(`${this.apiUrl}/promotions`, { params: filters as any });
  }

  // Recherche globale
  search(searchTerm: string, filters: {
    page?: number;
    limit?: number;
    type?: 'all' | 'products' | 'shops';
  } = {}): Observable<SearchResponse> {
    const params = { q: searchTerm, ...filters };
    return this.http.get<SearchResponse>(`${this.apiUrl}/search`, { params: params as any });
  }

  // Incrémenter les vues d'un produit
  incrementProductViews(id: string): Observable<{ success: boolean; views: number }> {
    return this.http.post<{ success: boolean; views: number }>(`${this.apiUrl}/products/${id}/view`, {});
  }
}
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';

import { OrderShopService } from '../../core/services/order-shop.service';
import { AuthService } from '../../core/services/auth.service';
import { ProductService } from '../../core/services/product.service';
import { ShopService } from '../../core/services/shop.service';

@Component({
  selector: 'app-boutique-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    SkeletonModule,
    TagModule,
    BadgeModule,
  ],
  templateUrl: './boutique-dashboard.component.html',
  styleUrl: './boutique-dashboard.component.css',
})
export class BoutiqueDashboardComponent implements OnInit {
  private orderShopService = inject(OrderShopService);
  private authService = inject(AuthService);
  private productService = inject(ProductService);
  private shopService = inject(ShopService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  user = this.authService.getUser();
  stats: any = null;
  loading = true;
  currentDate = new Date();

  // Product stats
  productStats: any = null;
  topSold: any[] = [];
  topViewed: any[] = [];
  statsLoading = true;

  readonly quickActions = [
    { label: 'Ma Boutique', icon: 'pi pi-building', route: '/my-shop', color: 'indigo' },
    { label: 'Mes Produits', icon: 'pi pi-box', route: '/my-products', color: 'emerald' },
    { label: 'Commandes', icon: 'pi pi-receipt', route: '/my-orders', color: 'amber' },
    { label: 'Gestion Stock', icon: 'pi pi-list', route: '/my-products/stock', color: 'rose' },
  ];

  ngOnInit(): void {
    this.orderShopService.stats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });

    const user = this.authService.getUser();
    if (user?.id) {
      this.shopService.getByUser(user.id).subscribe({
        next: (response: any) => {
          const shops: any[] = Array.isArray(response) ? response : [response];
          if (shops[0]?._id) this.loadProductStats(shops[0]._id);
          else this.statsLoading = false;
        },
        error: () => { this.statsLoading = false; }
      });
    }
  }

  loadProductStats(shopId: string): void {
    this.productService.stats(shopId).subscribe({
      next: (stats) => {
        this.productStats = stats;
        this.statsLoading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.statsLoading = false; }
    });

    this.productService.listMy({ shopId, page: 1, limit: 5, sortBy: 'statistics.sold', sortOrder: 'desc' }).subscribe({
      next: (response: any) => {
        this.topSold = response.items || [];
        this.cdr.detectChanges();
      }
    });

    this.productService.listMy({ shopId, page: 1, limit: 5, sortBy: 'statistics.views', sortOrder: 'desc' }).subscribe({
      next: (response: any) => {
        this.topViewed = response.items || [];
        this.cdr.detectChanges();
      }
    });
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-MG').format(amount) + ' Ar';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      preparing: 'En préparation',
      ready: 'Prête',
      completed: 'Complétée',
      cancelled: 'Annulée',
    };
    return labels[status] || status;
  }

  getStatusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    const map: Record<string, 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast'> = {
      pending: 'warn',
      confirmed: 'info',
      preparing: 'info',
      ready: 'success',
      completed: 'success',
      cancelled: 'danger',
    };
    return map[status] ?? 'secondary';
  }
}

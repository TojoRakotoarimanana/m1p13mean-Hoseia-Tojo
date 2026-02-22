import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';

import { OrderShopService } from '../../core/services/order-shop.service';
import { AuthService } from '../../core/services/auth.service';

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
  private router = inject(Router);

  user = this.authService.getUser();
  stats: any = null;
  loading = true;
  currentDate = new Date();

  readonly quickActions = [
    { label: 'Ma Boutique', icon: 'pi pi-building', route: '/my-shop', color: 'indigo' },
    { label: 'Mes Produits', icon: 'pi pi-box', route: '/my-products', color: 'emerald' },
    { label: 'Commandes', icon: 'pi pi-receipt', route: '/my-orders', color: 'amber' },
    { label: 'Gestion Stock', icon: 'pi pi-list', route: '/my-products/stock', color: 'rose' },
    { label: 'Statistiques', icon: 'pi pi-chart-line', route: '/my-products/stats', color: 'violet' },
  ];

  ngOnInit(): void {
    this.orderShopService.stats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: () => { this.loading = false; }
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

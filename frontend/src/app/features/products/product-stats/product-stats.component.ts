import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

import { ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import { ShopService } from '../../../core/services/shop.service';

@Component({
  selector: 'app-product-stats',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, TagModule],
  templateUrl: './product-stats.component.html',
  styleUrl: './product-stats.component.css'
})
export class ProductStatsComponent implements OnInit {
  stats: any = null;
  topSold: any[] = [];
  topViewed: any[] = [];
  promoProducts: any[] = [];

  loading = false;
  shopId: string | null = null;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private shopService: ShopService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const user = this.authService.getUser();
    if (!user?.id) return;

    this.shopService.getByUser(user.id).subscribe({
      next: (shop) => {
        this.shopId = shop._id;
        this.loadStats();
        this.loadTopLists();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadStats() {
    if (!this.shopId) return;

    this.productService.stats(this.shopId).subscribe({
      next: (stats) => {
        this.stats = stats;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cdr.detectChanges();
      }
    });
  }

  loadTopLists() {
    if (!this.shopId) return;

    this.productService.listMy({ shopId: this.shopId, page: 1, limit: 5, sortBy: 'statistics.sold', sortOrder: 'desc' }).subscribe({
      next: (response: any) => {
        this.topSold = response.items || [];
        this.cdr.detectChanges();
      }
    });

    this.productService.listMy({ shopId: this.shopId, page: 1, limit: 5, sortBy: 'statistics.views', sortOrder: 'desc' }).subscribe({
      next: (response: any) => {
        this.topViewed = response.items || [];
        this.cdr.detectChanges();
      }
    });

    this.productService.listMy({ shopId: this.shopId, page: 1, limit: 5, isPromotion: true }).subscribe({
      next: (response: any) => {
        this.promoProducts = response.items || [];
        this.cdr.detectChanges();
      }
    });
  }
}

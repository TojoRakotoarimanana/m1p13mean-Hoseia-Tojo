import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { CatalogService, Shop, Product, ShopDetailsResponse } from '../../../core/services/catalog.service';
import { NotificationService } from '../../../core/services/notification.service';
import { NavbarComponent } from '../../../core/components/navbar/navbar.component';

@Component({
  selector: 'app-shop-details',
  standalone: true,
  imports: [
    CommonModule,
    SkeletonModule,
    NavbarComponent
  ],
  templateUrl: './shop-details.component.html',
  styleUrl: './shop-details.component.css'
})
export class ShopDetailsComponent implements OnInit {
  shop: Shop | null = null;
  products: Product[] = [];
  loading = true;
  shopId: string = '';

  readonly daysOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  readonly dayLabels: { [key: string]: string } = {
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
    sunday: 'Dimanche'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private catalogService: CatalogService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.shopId = this.route.snapshot.paramMap.get('id') || '';
    if (this.shopId) {
      this.loadShopDetails();
    } else {
      this.notificationService.error('ID de la boutique manquant');
      this.router.navigate(['/home']);
    }
  }

  loadShopDetails(): void {
    this.loading = true;
    this.catalogService.getShopById(this.shopId).subscribe({
      next: (response: ShopDetailsResponse) => {
        this.shop = response.shop;
        this.products = response.products || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.notificationService.error(error.error?.message || 'Erreur lors du chargement de la boutique');
        this.loading = false;
        this.router.navigate(['/home']);
      }
    });
  }

  getLocationString(): string {
    if (!this.shop?.location) return '';
    const { floor, zone, shopNumber } = this.shop.location;
    const parts: string[] = [];
    if (floor) parts.push(`Étage ${floor}`);
    if (zone) parts.push(`Zone ${zone}`);
    if (shopNumber) parts.push(`N° ${shopNumber}`);
    return parts.join(' · ');
  }

  isDayOpen(day: string): boolean {
    return !!(this.shop?.hours?.[day]?.open && this.shop?.hours?.[day]?.close);
  }

  getProductImage(product: Product): string {
    if (product.images?.length) {
      const img = product.images[0];
      if (img.startsWith('http://') || img.startsWith('https://')) return img;
      return `http://localhost:3000/${img}`;
    }
    return 'https://placehold.co/400x300/f1f5f9/94a3b8?text=Image';
  }

  getShopLogoUrl(): string {
    if (!this.shop?.logo) return '';
    if (this.shop.logo.startsWith('http://') || this.shop.logo.startsWith('https://')) return this.shop.logo;
    return `http://localhost:3000/${this.shop.logo}`;
  }

  getDiscountedPrice(product: Product): number {
    if (product.isPromotion && product.discount > 0) {
      return product.price * (1 - product.discount / 100);
    }
    return product.price;
  }

  isLowStock(product: Product): boolean {
    return product.stock.quantity > 0 && product.stock.quantity <= product.stock.lowStockAlert;
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  viewProduct(productId: string): void {
    this.router.navigate(['/product', productId]);
  }
}

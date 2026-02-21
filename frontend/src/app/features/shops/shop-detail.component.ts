import { Component, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { TabsModule } from 'primeng/tabs';
import { DividerModule } from 'primeng/divider';
import { DataViewModule } from 'primeng/dataview';
import { CatalogService, Shop, Product } from '../../core/services/catalog.service';
import { NavbarComponent } from '../../core/components/navbar/navbar.component';

@Component({
  selector: 'app-shop-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    TagModule,
    SkeletonModule,
    TabsModule,
    DividerModule,
    DataViewModule,
    NavbarComponent
  ],
  templateUrl: './shop-detail.component.html',
  styleUrl: './shop-detail.component.css'
})
export class ShopDetailComponent implements OnInit {
  shop: Shop | null = null;
  shopProducts: Product[] = [];
  loading = true;
  loadingProducts = true;
  shopId: string;

  // Pagination des produits
  first = 0;
  rows = 12;
  totalRecords = 0;

  // État des onglets
  activeTab = signal(0);
  
  constructor(
    private catalogService: CatalogService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.shopId = '';
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.shopId = params['id'];
      if (this.shopId) {
        this.loadShopDetails();
      }
    });
  }

  loadShopDetails() {
    this.loading = true;
    this.catalogService.getShopById(this.shopId).subscribe({
      next: (response: any) => {
        this.shop = response.shop || response;
        this.shopProducts = response.products || [];
        this.totalRecords = this.shopProducts.length;
        this.loading = false;
        this.loadingProducts = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors du chargement de la boutique:', error);
        this.loading = false;
        this.loadingProducts = false;
        this.cdr.detectChanges();
      }
    });
  }

  onProductClick(product: Product) {
    // Incrémenter les vues du produit
    this.catalogService.incrementProductViews(product._id).subscribe({
      next: () => console.log('Vues incrémentées'),
      error: (error) => console.error('Erreur incrémentation vues:', error)
    });
    
    // TODO: Navigation vers détails du produit
    console.log('Voir produit:', product._id);
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  goBack() {
    this.router.navigate(['/shops']);
  }

  getShopLogoUrl(): string {
    if (this.shop?.logo) {
      if (this.shop.logo.startsWith('http')) {
        return this.shop.logo;
      }
      return `http://localhost:3000/uploads/shops/${this.shop.logo}`;
    }
    return '';
  }

  getProductImageUrl(product: Product): string {
    if (product.images && product.images.length > 0) {
      return `http://localhost:3000/uploads/products/${product.images[0]}`;
    }
    return 'assets/images/no-image.png';
  }

  getDiscountedPrice(product: Product): number {
    if (product.isPromotion && product.discount > 0) {
      return Number((product.originalPrice || product.price) * (1 - product.discount / 100)).toFixed(2) as any;
    }
    return product.price;
  }

  formatHours(hours: any): string {
    if (!hours) return 'Non spécifié';
    return `${hours.open} - ${hours.close}`;
  }

  getCurrentDay(): string {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[new Date().getDay()];
  }

  isOpenNow(): boolean {
    if (!this.shop?.hours) return false;
    
    const currentDay = this.getCurrentDay();
    const todaySchedule = this.shop.hours[currentDay];
    
    if (!todaySchedule || !todaySchedule.open || !todaySchedule.close) return false;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [openHour, openMin] = todaySchedule.open.split(':').map(Number);
    const [closeHour, closeMin] = todaySchedule.close.split(':').map(Number);
    
    const openTime = openHour * 60 + openMin;
    const closeTime = closeHour * 60 + closeMin;
    
    return currentTime >= openTime && currentTime <= closeTime;
  }
}
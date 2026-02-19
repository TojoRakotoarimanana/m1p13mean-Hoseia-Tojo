import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { DividerModule } from 'primeng/divider';
import { CatalogService, Shop, Product, ShopDetailsResponse } from '../../../core/services/catalog.service';
import { NotificationService } from '../../../core/services/notification.service';
import { NavbarComponent } from '../../../core/components/navbar/navbar.component';

@Component({
  selector: 'app-shop-details',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TagModule,
    SkeletonModule,
    DividerModule,
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

  daysOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  dayLabels: { [key: string]: string } = {
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
    console.log('Shop ID:', this.shopId);
    if (this.shopId) {
      this.loadShopDetails();
    } else {
      console.error('Pas de shop ID');
      this.notificationService.error('ID de la boutique manquant');
      this.router.navigate(['/home']);
    }
  }

  loadShopDetails(): void {
    this.loading = true;
    console.log('Chargement des détails pour shop:', this.shopId);
    this.catalogService.getShopById(this.shopId).subscribe({
      next: (response: ShopDetailsResponse) => {
        console.log('Réponse reçue:', response);
        console.log('Shop data:', response.shop);
        console.log('Products:', response.products);
        
        this.shop = response.shop;
        this.products = response.products || [];
        this.loading = false;
        
        console.log('Après assignation - shop:', this.shop);
        console.log('Après assignation - loading:', this.loading);
        
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors du chargement:', error);
        this.notificationService.error(error.error?.message || 'Erreur lors du chargement de la boutique');
        this.loading = false;
        this.router.navigate(['/home']);
      }
    });
  }

  getLocationString(): string {
    if (!this.shop?.location) return 'Non spécifié';
    const { floor, zone, shopNumber } = this.shop.location;
    const parts = [];
    if (floor) parts.push(`Étage ${floor}`);
    if (zone) parts.push(`Zone ${zone}`);
    if (shopNumber) parts.push(`Boutique ${shopNumber}`);
    return parts.length > 0 ? parts.join(' - ') : 'Non spécifié';
  }

  getProductImage(product: Product): string {
    if (product.images && product.images.length > 0) {
      return `http://localhost:3000/${product.images[0]}`;
    }
    return 'https://via.placeholder.com/400x300/667eea/ffffff?text=Pas+d\'image';
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  getDiscountedPrice(product: Product): number {
    if (product.isPromotion && product.discount > 0) {
      return product.price * (1 - product.discount / 100);
    }
    return product.price;
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  viewProduct(productId: string): void {
    this.catalogService.incrementProductViews(productId).subscribe();
  }
}

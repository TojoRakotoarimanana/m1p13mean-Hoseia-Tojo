import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { DividerModule } from 'primeng/divider';
import { GalleriaModule } from 'primeng/galleria';
import { CatalogService, Product } from '../../../core/services/catalog.service';
import { NotificationService } from '../../../core/services/notification.service';
import { NavbarComponent } from '../../../core/components/navbar/navbar.component';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TagModule,
    SkeletonModule,
    DividerModule,
    GalleriaModule,
    NavbarComponent
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  productId: string = '';
  currentImageIndex = 0;
  images: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private catalogService: CatalogService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    if (this.productId) {
      this.loadProductDetails();
    } else {
      this.notificationService.error('ID du produit manquant');
      this.router.navigate(['/home']);
    }
  }

  loadProductDetails(): void {
    this.loading = true;
    this.catalogService.getProductById(this.productId).subscribe({
      next: (product: Product) => {
        this.product = product;
        this.prepareImages();
        this.incrementViews();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.notificationService.error(error.error?.message || 'Erreur lors du chargement du produit');
        this.loading = false;
        this.router.navigate(['/home']);
      }
    });
  }

  prepareImages(): void {
    if (this.product && this.product.images && this.product.images.length > 0) {
      this.images = this.product.images.map((img: string) => {
        // Vérifier si l'URL est absolue (commence par http:// ou https://)
        const imageUrl = img.startsWith('http://') || img.startsWith('https://') 
          ? img 
          : `http://localhost:3000/${img}`;
        
        return {
          itemImageSrc: imageUrl,
          thumbnailImageSrc: imageUrl,
          alt: this.product!.name
        };
      });
      console.log('Images préparées pour le carousel:', this.images);
    } else {
      this.images = [{
        itemImageSrc: 'https://via.placeholder.com/800x600/e0e0e0/666?text=Pas+d\'image',
        thumbnailImageSrc: 'https://via.placeholder.com/200x150/e0e0e0/666?text=Pas+d\'image',
        alt: 'Pas d\'image'
      }];
      console.log('Aucune image, utilisation du placeholder');
    }
  }

  incrementViews(): void {
    if (this.productId) {
      this.catalogService.incrementProductViews(this.productId).subscribe({
        next: () => {},
        error: () => {}
      });
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  getDiscountedPrice(): number {
    if (!this.product) return 0;
    if (this.product.isPromotion && this.product.discount > 0) {
      return this.product.price * (1 - this.product.discount / 100);
    }
    return this.product.price;
  }

  getTotalSavings(): number {
    if (!this.product || !this.product.isPromotion || this.product.discount === 0) return 0;
    return this.product.price - this.getDiscountedPrice();
  }

  isLowStock(): boolean {
    return this.product ? this.product.stock.quantity <= this.product.stock.lowStockAlert : false;
  }

  getStockStatus(): string {
    if (!this.product) return 'Indisponible';
    if (this.product.stock.quantity === 0) return 'Rupture de stock';
    if (this.isLowStock()) return 'Stock limité';
    return 'En stock';
  }

  getStockSeverity(): 'success' | 'warn' | 'danger' {
    if (!this.product || this.product.stock.quantity === 0) return 'danger';
    if (this.isLowStock()) return 'warn';
    return 'success';
  }

  getPromotionEndDate(): string | null {
    if (!this.product || !this.product.isPromotion || !this.product.promoEndDate) return null;
    const endDate = new Date(this.product.promoEndDate);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return null;
    if (diffDays === 0) return "Se termine aujourd'hui";
    if (diffDays === 1) return "Se termine demain";
    return `Se termine dans ${diffDays} jours`;
  }

  getStockWidth(): number {
    if (!this.product) return 0;
    return Math.min((this.product.stock.quantity / 100) * 100, 100);
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  viewShop(): void {
    if (this.product && this.product.shopId) {
      this.router.navigate(['/shop', this.product.shopId._id]);
    }
  }
}

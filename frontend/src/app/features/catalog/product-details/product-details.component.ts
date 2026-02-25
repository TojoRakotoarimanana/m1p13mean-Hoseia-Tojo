import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CatalogService, Product } from '../../../core/services/catalog.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CartService } from '../../../core/services/cart.service';
@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    SkeletonModule,
    ButtonModule,
    InputNumberModule,
    FormsModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  productId: string = '';
  images: string[] = [];
  selectedImageIndex = 0;
  quantity = 1;
  isAddingToCart = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private catalogService: CatalogService,
    private notificationService: NotificationService,
    private cartService: CartService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) { }

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
    this.selectedImageIndex = 0;
    if (this.product?.images?.length) {
      this.images = this.product.images.map((img: string) =>
        img.startsWith('http://') || img.startsWith('https://')
          ? img
          : `http://localhost:3000/${img}`
      );
    } else {
      this.images = ['https://placehold.co/600x600/f1f5f9/94a3b8?text=Pas+d\'image'];
    }
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  prevImage(): void {
    this.selectedImageIndex =
      this.selectedImageIndex > 0 ? this.selectedImageIndex - 1 : this.images.length - 1;
  }

  nextImage(): void {
    this.selectedImageIndex =
      this.selectedImageIndex < this.images.length - 1 ? this.selectedImageIndex + 1 : 0;
  }

  incrementViews(): void {
    if (this.productId) {
      this.catalogService.incrementProductViews(this.productId).subscribe({
        next: () => { },
        error: () => { }
      });
    }
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
    const diffDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
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
    if (this.product?.shopId) {
      this.router.navigate(['/shop', this.product.shopId._id]);
    }
  }

  addToCart(): void {
    if (!this.product) return;

    this.isAddingToCart = true;
    this.cartService.addToCart(this.product, this.quantity).subscribe({
      next: () => {
        this.isAddingToCart = false;
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: `${this.quantity} article(s) ajouté(s) au panier` });
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isAddingToCart = false;
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible d\'ajouter au panier' });
        console.error(err);
        this.cdr.detectChanges();
      }
    });
  }
}

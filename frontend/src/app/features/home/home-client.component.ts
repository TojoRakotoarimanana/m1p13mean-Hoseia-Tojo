import { Component, OnInit, ChangeDetectorRef, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr);
import { RouterModule, Router } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { CatalogService, Product, Shop } from '../../core/services/catalog.service';
import { CategoryService } from '../../core/services/category.service';
import { AuthService } from '../../core/services/auth.service';
import { NavbarComponent } from '../../core/components/navbar/navbar.component';

@Component({
  selector: 'app-home-client',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SkeletonModule,
    InputTextModule,
    SelectModule,
    NavbarComponent
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr-FR' }
  ],
  templateUrl: './home-client.component.html',
  styleUrl: './home-client.component.css'
})
export class HomeClientComponent implements OnInit {
  featuredProducts: Product[] = [];
  promotions: Product[] = [];
  featuredShops: Shop[] = [];
  categories: any[] = [];

  stats = {
    totalProducts: 0,
    totalShops: 0,
    totalPromotions: 0,
    totalCategories: 0,
  };

  loadingProducts = true;
  loadingPromotions = true;
  loadingShops = true;
  loadingCategories = true;

  searchTerm = '';
  selectedCategory: any = null;
  currentPage = 1;
  totalPages = 1;
  paginationPages: number[] = [];
  readonly pageSize = 12;

  currentUser: any;
  currentDate = new Date();

  constructor(
    private catalogService: CatalogService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.currentUser = this.authService.getUserFromStorage();
  }

  ngOnInit(): void {
    this.loadProducts(1);
    this.loadPromotions();
    this.loadShops();
    this.loadCategories();
  }

  private loadProducts(page: number, categoryId?: string): void {
    this.loadingProducts = true;
    this.cdr.detectChanges();
    const params: any = { page, limit: this.pageSize };
    if (categoryId) params.category = categoryId;

    this.catalogService.getProducts(params).subscribe({
      next: (response) => {
        this.featuredProducts = response.products;
        this.stats.totalProducts = response.pagination?.totalProducts || response.products.length;
        this.totalPages = response.pagination?.totalPages || 1;
        this.currentPage = page;
        this.buildPaginationPages();
        this.loadingProducts = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingProducts = false;
        this.cdr.detectChanges();
      }
    });
  }

  private loadPromotions(): void {
    this.catalogService.getPromotions({ page: 1, limit: 8 }).subscribe({
      next: (response) => {
        this.promotions = response.promotions;
        this.stats.totalPromotions = response.pagination?.totalPromotions || response.promotions.length;
        this.loadingPromotions = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingPromotions = false;
        this.cdr.detectChanges();
      }
    });
  }

  private loadShops(): void {
    this.catalogService.getShops({ page: 1, limit: 6 }).subscribe({
      next: (response) => {
        this.featuredShops = response.shops;
        this.stats.totalShops = response.pagination?.totalShops || response.shops.length;
        this.loadingShops = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingShops = false;
        this.cdr.detectChanges();
      }
    });
  }

  private loadCategories(): void {
    this.categoryService.list().subscribe({
      next: (response: any) => {
        const all: any[] = response.categories || response;
        this.stats.totalCategories = all.length;
        // Seules les catégories de type 'produit' servent à filtrer les produits
        this.categories = all.filter((c: any) => c.type === 'produit');
        this.loadingCategories = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingCategories = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) return;
    this.catalogService.search(this.searchTerm.trim()).subscribe({
      next: (results) => {
        this.featuredProducts = results?.products || [];
        this.featuredShops = results?.shops || [];
        this.totalPages = 1;
        this.currentPage = 1;
        this.buildPaginationPages();
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  onViewProduct(product: Product): void {
    this.router.navigate(['/product', product._id]);
  }

  onViewShop(shop: Shop): void {
    this.router.navigate(['/shop', shop._id]);
  }

  onNavigateToShops(): void {
    this.router.navigate(['/shops']);
  }

  onCategoryFilter(category: any): void {
    this.selectedCategory = category;
    this.loadProducts(1, category?._id);
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.loadProducts(page, this.selectedCategory?._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getProductImageUrl(product: Product): string {
    if (product.images && product.images.length > 0) {
      const img = product.images[0];
      if (img.startsWith('http://') || img.startsWith('https://')) return img;
      return `http://localhost:3000/uploads/products/${img}`;
    }
    return 'https://placehold.co/400x300/f1f5f9/94a3b8?text=Image';
  }

  getShopLogoUrl(shop: Shop): string {
    if (shop.logo) {
      if (shop.logo.startsWith('http://') || shop.logo.startsWith('https://')) return shop.logo;
      return `http://localhost:3000/uploads/shops/${shop.logo}`;
    }
    return '';
  }

  getDiscountedPrice(product: Product): number {
    if (product.isPromotion && product.discount > 0) {
      return product.price * (1 - product.discount / 100);
    }
    return product.price;
  }

  getPromoDateRange(product: Product): string | null {
    if (!product.isPromotion) return null;
    const fmt = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const parts: string[] = [];
    if (product.promoStartDate) parts.push(`Du ${fmt.format(new Date(product.promoStartDate))}`);
    if (product.promoEndDate) parts.push(`au ${fmt.format(new Date(product.promoEndDate))}`);
    return parts.length > 0 ? parts.join(' ') : null;
  }

  getUserGreeting(): string {
    if (this.currentUser?.firstName) return `Bonjour, ${this.currentUser.firstName}`;
    return 'Bienvenue';
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('fr-FR').format(num || 0);
  }

  private buildPaginationPages(): void {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    this.paginationPages = pages;
  }

  skeletonRange(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }
}

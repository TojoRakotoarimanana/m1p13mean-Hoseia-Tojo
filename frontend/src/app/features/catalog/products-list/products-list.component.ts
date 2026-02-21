import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';

import { SkeletonModule } from 'primeng/skeleton';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';

import { CatalogService, Product } from '../../../core/services/catalog.service';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SkeletonModule,
    InputTextModule,
    PaginatorModule,
  ],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css',
})
export class ProductsListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  categories: any[] = [];

  loading = true;
  loadingCategories = true;
  totalProducts = 0;

  searchTerm = '';
  selectedCategory: any = null;

  first = 0;
  rows = 9;

  private search$ = new Subject<void>();
  private destroy$ = new Subject<void>();

  constructor(
    private catalogService: CatalogService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadCategoriesFromProducts();

    this.search$.pipe(debounceTime(350), takeUntil(this.destroy$)).subscribe(() => {
      this.first = 0;
      this.loadProducts();
    });

    this.loadProducts();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** Charge tous les produits (haut limit) pour extraire les catégories réellement utilisées */
  loadCategoriesFromProducts() {
    this.loadingCategories = true;
    this.catalogService.getProducts({ limit: 500 } as any).subscribe({
      next: (res) => {
        const catMap = new Map<string, any>();
        (res.products || []).forEach(p => {
          if (p.category?._id) catMap.set(p.category._id, p.category);
        });
        const cats = Array.from(catMap.values()).sort((a, b) => a.name.localeCompare(b.name));
        this.categories = [{ _id: null, name: 'Tous' }, ...cats];
        this.loadingCategories = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.categories = [{ _id: null, name: 'Tous' }];
        this.loadingCategories = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadProducts() {
    this.loading = true;
    const page = Math.floor(this.first / this.rows) + 1;
    const filters: any = { page, limit: this.rows };

    if (this.selectedCategory?._id) filters.category = this.selectedCategory._id;

    this.catalogService.getProducts(filters).subscribe({
      next: (res) => {
        let products = res.products || [];

        if (this.searchTerm.trim()) {
          const q = this.searchTerm.toLowerCase();
          products = products.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.shopId?.name?.toLowerCase().includes(q)
          );
        }

        this.products = products;
        this.totalProducts = res.pagination.totalProducts ?? products.length;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; this.cdr.detectChanges(); }
    });
  }

  onSearch() { this.search$.next(); }

  onCategoryFilter(cat: any) {
    this.selectedCategory = cat;
    this.first = 0;
    this.loadProducts();
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.loadProducts();
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedCategory = null;
    this.first = 0;
    this.loadProducts();
  }

  viewProduct(product: Product) {
    this.router.navigate(['/product', product._id]);
  }

  getImageUrl(product: Product): string {
    if (product.images?.length) {
      const img = product.images[0];
      if (img.startsWith('http')) return img;
      return `http://localhost:3000/uploads/products/${img}`;
    }
    return '';
  }

  getPrice(product: Product): number {
    if (product.isPromotion && product.discount > 0)
      return product.price * (1 - product.discount / 100);
    return product.price;
  }

  formatPrice(amount: number): string {
    return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount) + ' Ar';
  }

  skeletonRange(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }
}

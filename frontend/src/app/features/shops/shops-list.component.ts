import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SkeletonModule } from 'primeng/skeleton';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { CatalogService, Shop } from '../../core/services/catalog.service';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-shops-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SkeletonModule,
    InputTextModule,
    PaginatorModule,
  ],
  templateUrl: './shops-list.component.html',
  styleUrl: './shops-list.component.css'
})
export class ShopsListComponent implements OnInit {
  shops: Shop[] = [];
  filteredShops: Shop[] = [];
  categories: any[] = [];

  loading = true;
  loadingCategories = true;

  searchTerm = '';
  selectedCategory: any = null;

  first = 0;
  rows = 12;

  constructor(
    private catalogService: CatalogService,
    private categoryService: CategoryService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadShops();
    this.loadCategories();
  }

  loadShops() {
    this.loading = true;
    this.catalogService.getShops().subscribe({
      next: (response: any) => {
        this.shops = response?.shops || response || [];
        this.filteredShops = [...this.shops];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.shops = [];
        this.filteredShops = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadCategories() {
    this.loadingCategories = true;
    this.categoryService.list().subscribe({
      next: (response: any) => {
        const cats = response.categories || response || [];
        this.categories = [{ _id: null, name: 'Toutes' }, ...cats];
        this.loadingCategories = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.categories = [{ _id: null, name: 'Toutes' }];
        this.loadingCategories = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSearch() {
    this.applyFilters();
  }

  onCategoryFilter(category: any) {
    this.selectedCategory = category;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.shops];
    const term = this.searchTerm.toLowerCase().trim();
    if (term) {
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(term) ||
        s.description?.toLowerCase().includes(term) ||
        s.category?.name?.toLowerCase().includes(term)
      );
    }
    if (this.selectedCategory?._id) {
      filtered = filtered.filter(s => s.category._id === this.selectedCategory._id);
    }
    this.filteredShops = filtered;
    this.first = 0;
    this.cdr.detectChanges();
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  getPaginatedShops(): Shop[] {
    return this.filteredShops.slice(this.first, this.first + this.rows);
  }

  onViewShop(shop: Shop) {
    this.router.navigate(['/shop', shop._id]);
  }

  getShopLogoUrl(shop: Shop): string {
    if (!shop.logo) return '';
    if (shop.logo.startsWith('http')) return shop.logo;
    return `http://localhost:3000/uploads/shops/${shop.logo}`;
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedCategory = null;
    this.applyFilters();
  }
}

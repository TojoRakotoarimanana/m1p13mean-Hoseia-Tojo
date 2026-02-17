import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DataViewModule } from 'primeng/dataview';
import { FormsModule } from '@angular/forms';
import { CatalogService, Shop } from '../../core/services/catalog.service';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-shops-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CardModule,
    ButtonModule,
    TagModule,
    SkeletonModule,
    InputTextModule,
    SelectModule,
    DataViewModule
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
  
  // Filtres et recherche
  searchTerm = '';
  selectedCategory: any = null;
  
  // Pagination et vue
  first = 0;
  rows = 12;
  totalRecords = 0;
  
  constructor(
    private catalogService: CatalogService,
    private categoryService: CategoryService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadInitialData();
  }

  loadInitialData() {
    try {
      this.loadShops();
      this.loadCategories();
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  }

  loadShops() {
    this.loading = true;
    this.catalogService.getShops().subscribe({
      next: (response: any) => {
        this.shops = response?.shops || response || [];
        this.filteredShops = [...this.shops];
        this.totalRecords = this.shops.length;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des boutiques:', error);
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
        const categories = response.categories || response || [];
        // Ajouter option "Toutes" 
        this.categories = [
          { _id: null, name: 'Toutes les catégories' },
          ...categories
        ];
        this.loadingCategories = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories:', error);
        this.categories = [{ _id: null, name: 'Toutes les catégories' }];
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

    // Filtrage par terme de recherche
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(shop =>
        shop.name.toLowerCase().includes(term) ||
        shop.description?.toLowerCase().includes(term) ||
        shop.category?.name?.toLowerCase().includes(term)
      );
    }

    // Filtrage par catégorie
    if (this.selectedCategory && this.selectedCategory._id) {
      filtered = filtered.filter(shop =>
        shop.category._id === this.selectedCategory._id
      );
    }

    this.filteredShops = filtered;
    this.totalRecords = filtered.length;
    this.first = 0; // Reset pagination
    this.cdr.detectChanges();
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  onViewShop(shop: Shop) {
    // Navigation vers la page détail de la boutique
    this.router.navigate(['/shops', shop._id]);
  }

  getShopLogoUrl(shop: Shop): string {
    if (shop.logo && shop.logo.startsWith('http')) {
      return shop.logo;
    }
    return shop.logo ? `http://localhost:3000/uploads/shops/${shop.logo}` : '';
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedCategory = { _id: null, name: 'Toutes les catégories' };
    this.applyFilters();
  }

  getCurrentPage(): number {
    return Math.floor(this.first / this.rows) + 1;
  }
}
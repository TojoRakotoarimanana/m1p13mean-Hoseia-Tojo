import { Component, OnInit, ChangeDetectorRef, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr);
import { RouterModule, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CarouselModule } from 'primeng/carousel';
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
    CardModule,
    ButtonModule,
    TagModule,
    SkeletonModule,
    InputTextModule,
    SelectModule,
    CarouselModule,
    NavbarComponent
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr-FR' }
  ],
  templateUrl: './home-client.component.html',
  styleUrl: './home-client.component.css'
})
export class HomeClientComponent implements OnInit {
  // Données
  featuredProducts: Product[] = [];
  promotions: Product[] = [];
  featuredShops: Shop[] = [];
  categories: any[] = [];
  newProducts: Product[] = [];
  trendingProducts: Product[] = [];
  
  // Statistiques
  stats = {
    totalProducts: 0,
    totalShops: 0,
    totalPromotions: 0,
    totalCategories: 0,
    newThisWeek: 0,
    trending: 0
  };
  
  // états de chargement
  loadingProducts = true;
  loadingPromotions = true;
  loadingShops = true;
  loadingCategories = true;
  loadingStats = true;
  loadingNewProducts = true;
  
  // Recherche
  searchTerm = '';
  selectedCategory: any = null;
  
  currentUser: any;
  currentDate = new Date();

  // Carousel options
  carouselResponsiveOptions = [
    {
      breakpoint: '1199px',
      numVisible: 3,
      numScroll: 1
    },
    {
      breakpoint: '991px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '767px',
      numVisible: 1,
      numScroll: 1
    }
  ];

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
    this.loadInitialData();
  }

  private loadInitialData(): void {
    // Charger les produits vedettes (les plus vus)
    this.catalogService.getProducts({ page: 1, limit: 8 }).subscribe({
      next: (response) => {
        this.featuredProducts = response.products;
        this.stats.totalProducts = response.products.length;
        this.loadingProducts = false;
        this.loadingStats = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des produits:', error);
        this.loadingProducts = false;
        this.loadingStats = false;
        this.cdr.detectChanges();
      }
    });

    // Charger les promotions
    this.catalogService.getPromotions({ page: 1, limit: 8 }).subscribe({
      next: (response) => {
        this.promotions = response.promotions;
        this.stats.totalPromotions = response.promotions.length;
        this.loadingPromotions = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des promotions:', error);
        this.loadingPromotions = false;
        this.cdr.detectChanges();
      }
    });

    // Charger les boutiques vedettes
    this.catalogService.getShops({ page: 1, limit: 6 }).subscribe({
      next: (response) => {
        this.featuredShops = response.shops;
        this.stats.totalShops = response.shops.length;
        this.loadingShops = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des boutiques:', error);
        this.loadingShops = false;
        this.cdr.detectChanges();
      }
    });

    // Charger les catégories
    this.categoryService.list().subscribe({
      next: (response: any) => {
        this.categories = response.categories || response;
        this.stats.totalCategories = this.categories.length;
        this.loadingCategories = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories:', error);
        this.loadingCategories = false;
        this.cdr.detectChanges();
      }
    });

    // Charger les nouveaux produits (limité à 4 pour la section)
    this.catalogService.getProducts({ page: 1, limit: 4 }).subscribe({
      next: (response) => {
        // Simuler les nouveaux produits en prenant les 4 premiers
        this.newProducts = response.products.slice(0, 4);
        this.stats.newThisWeek = this.newProducts.length;
        this.loadingNewProducts = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des nouveaux produits:', error);
        this.loadingNewProducts = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.performGlobalSearch();
    }
  }

  async performGlobalSearch() {
    if (!this.searchTerm.trim()) return;
    
    try {
      // Recherche dans le catalogue
      const searchResults = await this.catalogService.search(this.searchTerm.trim()).toPromise();
      
      // Mettre à jour les résultats avec la recherche
      this.featuredProducts = searchResults?.products || [];
      this.featuredShops = searchResults?.shops || [];
      
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Erreur lors de la recherche globale:', error);
    }
  }

  onViewProduct(product: Product): void {
    // Incrémenter les vues et naviguer vers les détails
    this.catalogService.incrementProductViews(product._id).subscribe({
      next: (response) => {
        console.log(`Vues incrémentées: ${response.views}`);
      },
      error: (error) => {
        console.error('Erreur lors de l\'incrémentation des vues:', error);
      }
    });
    
    // TODO: Naviguer vers la page détails du produit
    console.log('Voir produit:', product._id);
  }

  onViewShop(shop: Shop): void {
    this.router.navigate(['/shop', shop._id]);
  }

  onNavigateToShops(): void {
    this.router.navigate(['/shops']);
  }

  onCategoryFilter(category: any): void {
    this.selectedCategory = category;
    // Recharger les produits avec le filtre catégorie
    if (category) {
      this.loadingProducts = true;
      this.cdr.detectChanges();
      this.catalogService.getProducts({ page: 1, limit: 8, category: category._id }).subscribe({
        next: (response) => {
          this.featuredProducts = response.products;
          this.loadingProducts = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Erreur lors du filtrage par catégorie:', error);
          this.loadingProducts = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      // Recharger tous les produits
      this.loadInitialData();
    }
  }

  getProductImageUrl(product: Product): string {
    if (product.images && product.images.length > 0) {
      return `http://localhost:3000/uploads/products/${product.images[0]}`;
    }
    return 'assets/images/no-image.png'; // Image par défaut
  }

  getShopLogoUrl(shop: Shop): string {
    if (shop.logo) {
      return `http://localhost:3000/uploads/shops/${shop.logo}`;
    }
    return 'assets/images/shop-default.png'; // Logo par défaut
  }

  getDiscountedPrice(product: Product): number {
    if (product.isPromotion && product.discount > 0) {
      return Number((product.originalPrice || product.price) * (1 - product.discount / 100)).toFixed(2) as any;
    }
    return product.price;
  }

  getUserGreeting(): string {
    if (this.currentUser && this.currentUser.firstName) {
      return `Bonjour ${this.currentUser.firstName} !`;
    }
    return 'Bienvenue dans notre catalogue !';
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('fr-FR').format(num);
  }

  getStatIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      'products': 'pi-box',
      'promotions': 'pi-tag',
      'shops': 'pi-building',
      'categories': 'pi-th-large',
      'new': 'pi-sparkles',
      'trending': 'pi-chart-line'
    };
    return 'pi ' + (iconMap[type] || 'pi-info-circle');
  }
}

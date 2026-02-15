import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { PaginatorModule } from 'primeng/paginator';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';

import { NotificationService } from '../../../core/services/notification.service';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { AuthService } from '../../../core/services/auth.service';
import { ShopService } from '../../../core/services/shop.service';

@Component({
  selector: 'app-my-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CardModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    TagModule,
    PaginatorModule,
    ToastModule,
    DialogModule,
    InputNumberModule
  ],
  templateUrl: './my-products.component.html',
  styleUrl: './my-products.component.css'
})
export class MyProductsComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];

  readonly imageBaseUrl = 'http://localhost:3000';

  loading = false;
  page = 1;
  limit = 10;
  total = 0;

  shopId: string | null = null;

  filters = {
    category: '',
    promotion: '',
    stockStatus: '',
    search: ''
  };

  promoDialog = false;
  promoTarget: any = null;
  promoValue = 0;
  promoEndDate: string | null = null;

  historyDialog = false;
  historyTarget: any = null;
  historyLoading = false;

  promotionOptions = [
    { label: 'Tous', value: '' },
    { label: 'En promotion', value: true },
    { label: 'Sans promotion', value: false }
  ];

  stockOptions = [
    { label: 'Tous', value: '' },
    { label: 'Stock bas (<=5)', value: 'low' },
    { label: 'Stock OK', value: 'ok' }
  ];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private shopService: ShopService,
    private notificationService: NotificationService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadShop();
  }

  openHistory(product: any) {
    this.historyDialog = true;
    this.historyLoading = true;
    this.productService.getById(product._id).subscribe({
      next: (data) => {
        this.historyTarget = data;
        this.historyLoading = false;
      },
      error: (error) => {
        this.historyLoading = false;
        this.notificationService.error(error.error?.message || 'Erreur chargement historique', 'Erreur');
      }
    });
  }

  closeHistory() {
    this.historyDialog = false;
    this.historyTarget = null;
  }

  private formatDateInput(value: string | Date) {
    const date = new Date(value);
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  openPromotion(product: any) {
    this.promoTarget = product;
    this.promoValue = product?.discount || 0;
    this.promoEndDate = product?.promoEndDate ? this.formatDateInput(product.promoEndDate) : null;
    this.promoDialog = true;
  }

  stopPromotion(product: any) {
    const payload = {
      isPromotion: false,
      discount: 0,
      promoEndDate: null,
      originalPrice: product.originalPrice || product.price
    };

    this.productService.updatePromotion(product._id, payload).subscribe({
      next: () => {
        this.notificationService.success('Promotion arrêtée.', 'Succès');
        this.loadProducts();
      },
      error: (error) => {
        this.notificationService.error(error.error?.message || 'Erreur promo', 'Erreur');
      }
    });
  }

  applyPromotion(enable: boolean) {
    if (!this.promoTarget) return;

    if (enable && (!this.promoValue || this.promoValue <= 0)) {
      this.notificationService.warn('Veuillez saisir un pourcentage valide.', 'Remise');
      return;
    }

    const payload: any = {
      isPromotion: enable,
      discount: enable ? Number(this.promoValue) : 0,
      promoEndDate: enable ? this.promoEndDate : null
    };

    if (enable) {
      payload.originalPrice = this.promoTarget.originalPrice || this.promoTarget.price;
    }

    this.productService.updatePromotion(this.promoTarget._id, payload).subscribe({
      next: () => {
        this.notificationService.success(enable ? 'Promotion activée.' : 'Promotion arrêtée.', 'Succès');
        this.promoDialog = false;
        this.promoTarget = null;
        this.loadProducts();
      },
      error: (error) => {
        this.notificationService.error(error.error?.message || 'Erreur promo', 'Erreur');
      }
    });
  }

  loadShop() {
    const user = this.authService.getUser();
    if (!user?.id) return;

    this.shopService.getByUser(user.id).subscribe({
      next: (shop) => {
        this.shopId = shop._id;
        this.loadProducts();
      },
      error: () => {
        this.notificationService.warn('Aucune boutique active trouvée.', 'Info');
      }
    });
  }

  loadCategories() {
    this.categoryService.list('produit').subscribe({
      next: (categories: any[]) => {
        this.categories = (categories || []).map((category) => ({
          ...category,
          displayName: category.name
        }));
        this.cdr.detectChanges();
      },
      error: () => {
        this.notificationService.error('Impossible de charger les catégories.', 'Erreur');
      }
    });
  }

  loadProducts() {
    if (!this.shopId) return;

    this.loading = true;
    const params: any = {
      shopId: this.shopId,
      page: this.page,
      limit: this.limit,
      search: this.filters.search,
      category: this.filters.category,
      isPromotion: this.filters.promotion
    };

    if (this.filters.stockStatus === 'low') {
      params.maxStock = 5;
    } else if (this.filters.stockStatus === 'ok') {
      params.minStock = 6;
    }

    this.productService.listMy(params).subscribe({
      next: (response: any) => {
        this.products = response.items || [];
        this.total = response.total || 0;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.loading = false;
        this.cdr.detectChanges();
        this.notificationService.error(error.error?.message || 'Erreur de chargement', 'Erreur');
      }
    });
  }

  onFilter() {
    this.page = 1;
    this.loadProducts();
  }

  onPageChange(event: any) {
    this.page = event.page + 1;
    this.limit = event.rows;
    this.loadProducts();
  }

  openNew() {
    this.router.navigate(['/my-products/new']);
  }

  editProduct(product: any) {
    this.router.navigate(['/my-products', product._id, 'edit']);
  }

  manageStock() {
    this.router.navigate(['/my-products/stock']);
  }

  viewStats() {
    this.router.navigate(['/my-products/stats']);
  }

  deleteProduct(product: any) {
    if (!confirm('Supprimer ce produit ?')) return;

    this.productService.remove(product._id).subscribe({
      next: () => {
        this.notificationService.success('Produit supprimé.', 'Succès');
        this.loadProducts();
      },
      error: (error) => {
        this.notificationService.error(error.error?.message || 'Erreur lors de la suppression', 'Erreur');
      }
    });
  }

  updateStock(product: any) {
    this.productService.updateStock(product._id, { quantity: product.stock?.quantity }).subscribe({
      next: () => {
        this.notificationService.success('Stock mis à jour.', 'Succès');
      },
      error: (error) => {
        this.notificationService.error(error.error?.message || 'Erreur stock', 'Erreur');
      }
    });
  }

  getStockSeverity(product: any) {
    const quantity = product?.stock?.quantity ?? 0;
    const lowAlert = product?.stock?.lowStockAlert ?? 5;
    if (quantity <= lowAlert) return 'danger';
    if (quantity <= lowAlert + 5) return 'warn';
    return 'success';
  }
}

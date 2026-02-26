import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { PaginatorModule } from 'primeng/paginator';
import { MessageService } from 'primeng/api';

import { NotificationService } from '../../../core/services/notification.service';
import { ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';
import { ShopService } from '../../../core/services/shop.service';

@Component({
  selector: 'app-stock-management',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, ToastModule, InputTextModule, InputNumberModule, PaginatorModule],
  providers: [MessageService],
  templateUrl: './stock-management.component.html',
  styleUrl: './stock-management.component.css'
})
export class StockManagementComponent implements OnInit {
  products: any[] = [];
  loading = false;
  page = 1;
  limit = 10;
  total = 0;
  search = '';
  shopId: string | null = null;

  readonly imageBaseUrl = environment.apiUrl;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private shopService: ShopService,
    private messageService: MessageService,
    private notificationService: NotificationService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const user = this.authService.getUser();
    if (!user?.id) return;

    this.shopService.getByUser(user.id).subscribe({
      next: (response: any) => {
        const shops: any[] = Array.isArray(response) ? response : [response];
        this.shopId = shops[0]?._id ?? null;
        if (this.shopId) this.loadProducts();
        else this.notificationService.warn('Aucune boutique active trouvée.', 'Info');
      },
      error: () => {
        this.notificationService.warn('Aucune boutique active.', 'Info');
      }
    });
  }

  loadProducts() {
    if (!this.shopId) return;

    this.loading = true;
    this.productService.listMy({
      shopId: this.shopId,
      page: this.page,
      limit: this.limit,
      search: this.search
    }).subscribe({
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

  onSearch() {
    this.page = 1;
    this.loadProducts();
  }

  onPageChange(event: any) {
    this.page = event.page + 1;
    this.limit = event.rows;
    this.loadProducts();
  }

  get lowStockCount(): number {
    return this.products.filter(p => this.isLowStock(p)).length;
  }

  saveStock(product: any) {
    this.productService.updateStock(product._id, {
      quantity: product.stock?.quantity,
      lowStockAlert: product.stock?.lowStockAlert
    }).subscribe({
      next: () => {
        this.notificationService.success('Stock mis à jour.', 'Succès');
      },
      error: (error) => {
        this.notificationService.error(error.error?.message || 'Erreur stock', 'Erreur');
      }
    });
  }

  isLowStock(product: any): boolean {
    return (product.stock?.quantity ?? 0) <= (product.stock?.lowStockAlert ?? 5);
  }

  getProductImageUrl(product: any): string {
    const img = product?.images?.[0];
    if (!img) return 'https://placehold.co/44x44/f1f5f9/94a3b8?text=?';
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    return `${this.imageBaseUrl}/${img}`.replace(/([^:])\/\//g, '$1/');
  }

  goBack() {
    this.router.navigate(['/my-products']);
  }
}

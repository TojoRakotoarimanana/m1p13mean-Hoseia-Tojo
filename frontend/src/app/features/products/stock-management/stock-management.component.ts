import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { NotificationService } from '../../../core/services/notification.service';
import { ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import { ShopService } from '../../../core/services/shop.service';

@Component({
  selector: 'app-stock-management',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, TableModule, ButtonModule, InputTextModule, ToastModule],
  providers: [MessageService],
  templateUrl: './stock-management.component.html',
  styleUrl: './stock-management.component.css'
})
export class StockManagementComponent implements OnInit {
  products: any[] = [];
  loading = false;
  shopId: string | null = null;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private shopService: ShopService,
    private messageService: MessageService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const user = this.authService.getUser();
    if (!user?.id) return;

    this.shopService.getByUser(user.id).subscribe({
      next: (shop) => {
        this.shopId = shop._id;
        this.loadProducts();
      },
      error: () => {
        this.notificationService.warn('Aucune boutique active.', 'Info');
      }
    });
  }

  loadProducts() {
    if (!this.shopId) return;

    this.loading = true;
    this.productService.listMy({ shopId: this.shopId, page: 1, limit: 50 }).subscribe({
      next: (response: any) => {
        this.products = response.items || [];
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

  isLowStock(product: any) {
    return (product.stock?.quantity ?? 0) <= (product.stock?.lowStockAlert ?? 5);
  }
}

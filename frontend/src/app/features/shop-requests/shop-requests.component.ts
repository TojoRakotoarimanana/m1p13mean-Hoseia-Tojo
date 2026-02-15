import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';

import { NotificationService } from '../../core/services/notification.service';
import { ShopService } from '../../core/services/shop.service';

@Component({
  selector: 'app-shop-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, TableModule, ButtonModule, DialogModule, InputTextModule, ToastModule],
  templateUrl: './shop-requests.component.html',
  styleUrl: './shop-requests.component.css'
})
export class ShopRequestsComponent implements OnInit {
  pendingShops: any[] = [];
  loading = false;

  approveDialog = false;
  selectedShop: any = null;
  locationForm = { floor: '', zone: '', shopNumber: '' };

  constructor(
    private shopService: ShopService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadPending();
  }

  loadPending() {
    this.loading = true;
    this.shopService.listPending().subscribe({
      next: (shops: any[]) => {
        this.pendingShops = shops || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.loading = false;
        this.cdr.detectChanges();
        this.notificationService.error(error.error?.message || 'Erreur lors du chargement', 'Erreur');
      }
    });
  }

  openApprove(shop: any) {
    this.selectedShop = shop;
    this.locationForm = { floor: '', zone: '', shopNumber: '' };
    this.approveDialog = true;
  }

  approve() {
    if (!this.selectedShop) return;

    this.shopService.approve(this.selectedShop._id, this.locationForm).subscribe({
      next: () => {
        this.notificationService.success('Boutique validée.', 'Succès');
        this.approveDialog = false;
        this.loadPending();
      },
      error: (error) => {
        this.notificationService.error(error.error?.message || 'Erreur lors de la validation', 'Erreur');
      }
    });
  }

  reject(shop: any) {
    if (!confirm('Refuser cette boutique ?')) return;

    this.shopService.reject(shop._id).subscribe({
      next: () => {
        this.notificationService.success('Boutique refusée.', 'Succès');
        this.loadPending();
      },
      error: (error) => {
        this.notificationService.error(error.error?.message || 'Erreur lors du refus', 'Erreur');
      }
    });
  }
}

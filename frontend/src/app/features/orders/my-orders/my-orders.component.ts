import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { PaginatorModule } from 'primeng/paginator';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { BadgeModule } from 'primeng/badge';
import { MessageService } from 'primeng/api';

import { OrderShopService } from '../../../core/services/order-shop.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-my-orders',
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
    BadgeModule,
  ],
  providers: [MessageService],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.css',
})
export class MyOrdersComponent implements OnInit {
  orders: any[] = [];
  loading = false;
  page = 1;
  limit = 10;
  total = 0;
  pendingCount = 0;

  filters = { status: '', startDate: '', endDate: '', client: '' };

  detailDialog = false;
  selectedOrder: any = null;

  statusDialog = false;
  statusTarget: any = null;
  newStatus = '';
  statusLoading = false;

  readonly statusOptions = [
    { label: 'Tous les statuts', value: '' },
    { label: 'En attente', value: 'pending' },
    { label: 'Confirmé', value: 'confirmed' },
    { label: 'En préparation', value: 'preparing' },
    { label: 'Prêt', value: 'ready' },
    { label: 'Terminé', value: 'completed' },
    { label: 'Annulé', value: 'cancelled' },
  ];

  readonly changeStatusOptions = [
    { label: 'Confirmé', value: 'confirmed' },
    { label: 'En préparation', value: 'preparing' },
    { label: 'Prêt', value: 'ready' },
    { label: 'Terminé', value: 'completed' },
    { label: 'Annulé', value: 'cancelled' },
  ];

  constructor(
    private orderShopService: OrderShopService,
    private notificationService: NotificationService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadOrders();
    this.loadPendingCount();
  }

  loadOrders() {
    this.loading = true;
    const params: any = { page: this.page, limit: this.limit };
    if (this.filters.status) params['status'] = this.filters.status;
    if (this.filters.startDate) params['startDate'] = this.filters.startDate;
    if (this.filters.endDate) params['endDate'] = this.filters.endDate;

    this.orderShopService.list(params).subscribe({
      next: (response) => {
        let items = response.items || [];
        // Filtre client côté frontend
        if (this.filters.client.trim()) {
          const search = this.filters.client.toLowerCase();
          items = items.filter((o: any) => {
            const name = this.getClientName(o).toLowerCase();
            return name.includes(search);
          });
        }
        this.orders = items;
        this.total = response.total || 0;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.notificationService.error(
          error.error?.message || 'Erreur lors du chargement des commandes.'
        );
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  loadPendingCount() {
    this.orderShopService.stats().subscribe({
      next: (stats) => {
        this.pendingCount = stats.pending || 0;
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  onFilter() {
    this.page = 1;
    this.loadOrders();
  }

  resetFilters() {
    this.filters = { status: '', startDate: '', endDate: '', client: '' };
    this.page = 1;
    this.loadOrders();
  }

  onPageChange(event: any) {
    this.page = event.page + 1;
    this.limit = event.rows;
    this.loadOrders();
  }

  openDetail(order: any) {
    this.router.navigate(['/my-orders', order._id]);
  }

  openStatusChange(order: any) {
    this.statusTarget = order;
    this.newStatus = order.shopStatus || order.status;
    this.statusDialog = true;
  }

  applyStatusChange() {
    if (!this.newStatus || !this.statusTarget) return;
    this.statusLoading = true;

    this.orderShopService.updateStatus(this.statusTarget._id, this.newStatus).subscribe({
      next: () => {
        this.statusDialog = false;
        this.statusLoading = false;
        this.notificationService.success('Statut de la commande mis à jour.');
        this.loadOrders();
        this.loadPendingCount();
      },
      error: (error) => {
        this.statusLoading = false;
        this.notificationService.error(
          error.error?.message || 'Erreur lors de la mise à jour du statut.'
        );
        this.cdr.detectChanges();
      },
    });
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'En attente',
      confirmed: 'Confirmé',
      preparing: 'En préparation',
      ready: 'Prêt',
      completed: 'Terminé',
      cancelled: 'Annulé',
    };
    return labels[status] || status;
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    const map: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'> = {
      pending: 'warn',
      confirmed: 'info',
      preparing: 'warn',
      ready: 'success',
      completed: 'success',
      cancelled: 'danger',
    };
    return map[status] ?? 'secondary';
  }

  getClientName(order: any): string {
    const c = order.customerId;
    if (!c) return '-';
    return `${c.firstName || ''} ${c.lastName || ''}`.trim() || c.email || '-';
  }

  getOrderSubtotal(order: any): number {
    return (
      order.items?.reduce((sum: number, item: any) => sum + (item.subtotal || 0), 0) || 0
    );
  }

  canChangeStatus(status: string): boolean {
    return status !== 'completed' && status !== 'cancelled';
  }
}

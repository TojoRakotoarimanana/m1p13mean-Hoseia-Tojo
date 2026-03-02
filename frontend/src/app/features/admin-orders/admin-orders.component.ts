import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';

import { AdminService } from '../../core/services/admin.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    TableModule,
    ButtonModule,
    TagModule,
    ToastModule,
    SelectModule,
    InputTextModule,
    SkeletonModule,
    DialogModule,
    TooltipModule,
  ],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css',
})
export class AdminOrdersComponent implements OnInit {
  orders: any[] = [];
  loading = false;

  // Pagination
  totalRecords = 0;
  currentPage = 1;
  readonly pageSize = 10;

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get pageStartIndex(): number {
    return this.totalRecords === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get pageEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadOrders();
    }
  }

  // Filtres
  selectedStatus = '';
  searchQuery = '';

  // Dialog détail
  detailDialog = false;
  selectedOrder: any = null;

  // Dialog changement statut
  statusDialog = false;
  orderToUpdate: any = null;
  newStatus = '';

  statusOptions = [
    { label: 'Tous les statuts', value: '' },
    { label: 'En attente', value: 'pending' },
    { label: 'Confirmée', value: 'confirmed' },
    { label: 'En préparation', value: 'preparing' },
    { label: 'Prête', value: 'ready' },
    { label: 'Complétée', value: 'completed' },
    { label: 'Annulée', value: 'cancelled' },
  ];

  changeableStatuses = [
    { label: 'En attente', value: 'pending' },
    { label: 'Confirmée', value: 'confirmed' },
    { label: 'En préparation', value: 'preparing' },
    { label: 'Prête', value: 'ready' },
    { label: 'Complétée', value: 'completed' },
    { label: 'Annulée', value: 'cancelled' },
  ];

  constructor(
    private adminService: AdminService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    const params: Record<string, any> = {
      page: this.currentPage,
      limit: this.pageSize,
    };
    if (this.selectedStatus) params['status'] = this.selectedStatus;
    if (this.searchQuery.trim()) params['search'] = this.searchQuery.trim();

    this.adminService.getAdminOrders(params).subscribe({
      next: (res) => {
        if (res.success) {
          this.orders = res.data.orders;
          this.totalRecords = res.data.total;
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.notificationService.error('Erreur lors du chargement des commandes.', 'Erreur');
        this.cdr.detectChanges();
      },
    });
  }

  onFilterChange() {
    this.currentPage = 1;
    this.loadOrders();
  }

  onSearchChange() {
    this.currentPage = 1;
    this.loadOrders();
  }

  clearFilters() {
    this.selectedStatus = '';
    this.searchQuery = '';
    this.currentPage = 1;
    this.loadOrders();
  }

  viewDetail(order: any) {
    this.selectedOrder = order;
    this.detailDialog = true;
  }

  openStatusDialog(order: any) {
    this.orderToUpdate = order;
    this.newStatus = order.status;
    this.statusDialog = true;
  }

  saveStatus() {
    if (!this.orderToUpdate || !this.newStatus) return;
    this.adminService.updateOrderStatus(this.orderToUpdate._id, this.newStatus).subscribe({
      next: () => {
        this.notificationService.success('Statut mis à jour avec succès.', 'Succès');
        this.statusDialog = false;
        this.loadOrders();
      },
      error: () => {
        this.notificationService.error('Erreur lors de la mise à jour.', 'Erreur');
      },
    });
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    const map: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'> = {
      pending: 'warn',
      confirmed: 'info',
      preparing: 'info',
      ready: 'success',
      completed: 'success',
      cancelled: 'danger',
    };
    return map[status] ?? 'secondary';
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      preparing: 'En préparation',
      ready: 'Prête',
      completed: 'Complétée',
      cancelled: 'Annulée',
    };
    return map[status] ?? status;
  }

  getPaymentSeverity(status: string): 'success' | 'warn' | 'danger' | 'secondary' {
    const map: Record<string, 'success' | 'warn' | 'danger' | 'secondary'> = {
      paid: 'success',
      pending: 'warn',
      failed: 'danger',
    };
    return map[status] ?? 'secondary';
  }

  getPaymentLabel(status: string): string {
    const map: Record<string, string> = {
      paid: 'Payée',
      pending: 'En attente',
      failed: 'Échouée',
    };
    return map[status] ?? status;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0 }).format(amount) + ' Ar';
  }

  getCustomerName(order: any): string {
    const c = order.customerId;
    if (!c) return '—';
    return `${c.firstName ?? ''} ${c.lastName ?? ''}`.trim() || c.email || '—';
  }

  get hasActiveFilter(): boolean {
    return !!this.selectedStatus || !!this.searchQuery.trim();
  }
}

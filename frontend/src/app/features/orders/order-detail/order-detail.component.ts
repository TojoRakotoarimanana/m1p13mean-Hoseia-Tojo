import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';
import { TimelineModule } from 'primeng/timeline';
import { MessageService } from 'primeng/api';

import { OrderShopService } from '../../../core/services/order-shop.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    TableModule,
    ButtonModule,
    TagModule,
    ToastModule,
    DividerModule,
    TimelineModule,
  ],
  providers: [MessageService],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css',
})
export class OrderDetailComponent implements OnInit {
  order: any = null;
  loading = false;
  actionLoading = false;

  readonly statusFlow = [
    { key: 'pending',   label: 'En attente' },
    { key: 'confirmed', label: 'Confirmé' },
    { key: 'preparing', label: 'En préparation' },
    { key: 'ready',     label: 'Prêt' },
    { key: 'completed', label: 'Terminé' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderShopService: OrderShopService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadOrder(id);
  }

  loadOrder(id: string) {
    this.loading = true;
    this.orderShopService.getById(id).subscribe({
      next: (order) => {
        this.order = order;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.notificationService.error(error.error?.message || 'Commande introuvable.');
        this.loading = false;
        this.router.navigate(['/my-orders']);
      },
    });
  }

  changeStatus(status: string) {
    if (!this.order?._id) return;
    this.actionLoading = true;

    this.orderShopService.updateStatus(this.order._id, status).subscribe({
      next: () => {
        this.actionLoading = false;
        this.notificationService.success('Statut mis à jour avec succès.');
        this.loadOrder(this.order._id);
      },
      error: (error) => {
        this.actionLoading = false;
        this.notificationService.error(error.error?.message || 'Erreur lors de la mise à jour.');
        this.cdr.detectChanges();
      },
    });
  }

  goBack() {
    this.router.navigate(['/my-orders']);
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

  getStepSeverity(stepKey: string): 'success' | 'secondary' {
    const currentStatus = this.order?.shopStatus || this.order?.status;
    if (currentStatus === 'cancelled') return 'secondary';
    const currentIndex = this.statusFlow.findIndex(s => s.key === currentStatus);
    const stepIndex = this.statusFlow.findIndex(s => s.key === stepKey);
    return stepIndex <= currentIndex ? 'success' : 'secondary';
  }

  getClientName(): string {
    const c = this.order?.customerId;
    if (!c) return '-';
    return `${c.firstName || ''} ${c.lastName || ''}`.trim() || c.email || '-';
  }

  getSubtotal(): number {
    return (
      this.order?.items?.reduce((sum: number, item: any) => sum + (item.subtotal || 0), 0) || 0
    );
  }

  isCancelled(): boolean {
    return (this.order?.shopStatus || this.order?.status) === 'cancelled';
  }

  isCompleted(): boolean {
    return (this.order?.shopStatus || this.order?.status) === 'completed';
  }

  currentStatus(): string {
    return this.order?.shopStatus || this.order?.status || '';
  }
}

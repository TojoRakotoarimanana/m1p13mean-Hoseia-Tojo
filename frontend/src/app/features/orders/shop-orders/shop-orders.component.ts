import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderShopService } from '../../../core/services/order-shop.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { finalize, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-shop-orders',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        SelectModule,
        TableModule
    ],
    templateUrl: './shop-orders.component.html',
    styleUrl: './shop-orders.component.css'
})
export class ShopOrdersComponent implements OnInit, OnDestroy {
    orders: any[] = [];
    loading: boolean = true;
    totalRecords: number = 0;

    // Filters
    searchQuery: string = '';
    selectedStatus: string | null = null;

    statusOptions = [
        { label: 'Tous les statuts', value: null },
        { label: 'En attente', value: 'pending' },
        { label: 'Confirmé', value: 'confirmed' },
        { label: 'En préparation', value: 'preparing' },
        { label: 'Prêt', value: 'ready' },
        { label: 'Terminé', value: 'completed' },
        { label: 'Annulé', value: 'cancelled' }
    ];

    currentPage = 1;
    private destroy$ = new Subject<void>();

    constructor(
        private orderShopService: OrderShopService,
        private cdr: ChangeDetectorRef,
        private router: Router
    ) {}

    ngOnInit() {
        this.loadOrders();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadOrders() {
        this.loading = true;

        const params: any = {
            page: this.currentPage,
            limit: 10
        };

        if (this.selectedStatus) params.status = this.selectedStatus;
        if (this.searchQuery?.trim()) params.search = this.searchQuery.trim();

        this.orderShopService.list(params).pipe(
            takeUntil(this.destroy$),
            finalize(() => {
                this.loading = false;
                this.cdr.detectChanges();
            })
        ).subscribe({
            next: (response) => {
                this.orders = response.items || [];
                this.totalRecords = response.total || 0;
            },
            error: (error) => {
                console.error('Erreur lors du chargement des commandes:', error);
                this.orders = [];
                this.totalRecords = 0;
            }
        });
    }

    onSearch() {
        this.currentPage = 1;
        this.loadOrders();
    }

    onPageChange(event: any) {
        // onLazyLoad envoie { first, rows } — pas event.page
        this.currentPage = Math.floor((event.first ?? 0) / (event.rows ?? 10)) + 1;
        this.loadOrders();
    }

    viewOrder(orderId: string) {
        this.router.navigate(['/my-orders', orderId]);
    }

    getStatusSeverity(status: string): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | null {
        switch (status) {
            case 'completed':
                return 'success';
            case 'cancelled':
                return 'danger';
            case 'preparing':
            case 'ready':
                return 'info';
            case 'confirmed':
                return 'warn';
            default:
                return 'secondary';
        }
    }

    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'MGA',
            minimumFractionDigits: 0
        }).format(amount).replace('MGA', 'Ar');
    }

    getStatusLabel(status: string): string {
        const labels: Record<string, string> = {
            pending: 'En attente',
            confirmed: 'Confirmé',
            preparing: 'En préparation',
            ready: 'Prêt',
            completed: 'Terminé',
            cancelled: 'Annulé'
        };
        return labels[status] ?? status;
    }

    formatDate(date: string): string {
        return new Date(date).toLocaleDateString('fr-FR');
    }
}
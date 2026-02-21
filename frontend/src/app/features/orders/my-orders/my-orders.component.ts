import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService, Order, OrdersResponse } from '../../../core/services/order.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { debounceTime, finalize, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-my-orders',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        SelectModule,
        TableModule,
        TagModule,
        CardModule
    ],
    templateUrl: './my-orders.component.html',
    styleUrl: './my-orders.component.css'
})
export class MyOrdersComponent implements OnInit, OnDestroy {
    orders: Order[] = [];
    loading: boolean = true;
    totalRecords: number = 0;

    // Filters
    searchQuery: string = '';
    selectedStatus: string | null = null;

    statusOptions = [
        { label: 'Tous les statuts', value: null },
        { label: 'En attente', value: 'pending' },
        { label: 'En traitement', value: 'processing' },
        { label: 'Expédié', value: 'shipped' },
        { label: 'Terminé', value: 'completed' },
        { label: 'Annulé', value: 'cancelled' }
    ];

    currentPage = 1;
    private destroy$ = new Subject<void>();
    private filterChange$ = new Subject<void>();
    private lastRequestId = 0;

    constructor(
        private orderService: OrderService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.filterChange$
            .pipe(debounceTime(300), takeUntil(this.destroy$))
            .subscribe(() => {
                this.currentPage = 1;
                this.loadOrders();
            });
    }

    ngAfterViewInit(): void {
        Promise.resolve().then(() => this.loadOrders());
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadOrders() {
        const requestId = ++this.lastRequestId;
        this.loading = true;
        const filters: any = {
            page: this.currentPage,
            limit: 10
        };

        if (this.searchQuery) filters.search = this.searchQuery;
        if (this.selectedStatus) filters.status = this.selectedStatus;

        this.orderService.getMyOrders(filters)
            .pipe(
                finalize(() => {
                    if (requestId === this.lastRequestId) {
                        this.loading = false;
                    }
                })
            )
            .subscribe({
                next: (response: OrdersResponse) => {
                    if (requestId !== this.lastRequestId) return;
                    Promise.resolve().then(() => {
                        if (requestId !== this.lastRequestId) return;
                        this.orders = response.orders;
                        this.totalRecords = response.pagination.totalOrders;
                        this.cdr.detectChanges();
                    });
                },
                error: (err) => {
                    if (requestId !== this.lastRequestId) return;
                    console.error('Erreur lors du chargement des commandes', err);
                }
            });
    }

    onFilterChange() {
        this.filterChange$.next();
    }

    onPageChange(event: any) {
        const first = typeof event?.first === 'number' ? event.first : 0;
        const rows = typeof event?.rows === 'number' ? event.rows : 10;
        this.currentPage = Math.floor(first / rows) + 1;
        this.loadOrders();
    }

    viewDetails(orderId: string) {
        this.router.navigate(['/orders', orderId]);
    }

    getShortId(order: any): string {
        const id = order.orderNumber || order._id;
        return typeof id === 'string' ? id.substring(0, 8).toUpperCase() : '';
    }

    getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
        switch (status) {
            case 'completed': return 'success';
            case 'shipped': return 'info';
            case 'pending': return 'warn';
            case 'processing': return 'info';
            case 'cancelled': return 'danger';
            default: return 'secondary';
        }
    }

    getStatusLabel(status: string): string {
        const statusMap: { [key: string]: string } = {
            'completed': 'Terminé',
            'shipped': 'Expédié',
            'pending': 'En attente',
            'processing': 'En traitement',
            'cancelled': 'Annulé'
        };
        return statusMap[status] || status;
    }

    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'MGA',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount).replace('MGA', 'Ar');
    }

    formatDate(dateStr: Date | string): string {
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
}

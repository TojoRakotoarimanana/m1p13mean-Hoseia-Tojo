import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OrderService, Order } from '../../../core/services/order.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { DividerModule } from 'primeng/divider';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';


@Component({
    selector: 'app-order-details',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ButtonModule,
        CardModule,
        TagModule,
        SkeletonModule,
        DividerModule,
        ConfirmDialogModule,
    ],
    providers: [ConfirmationService, MessageService],
    templateUrl: './order-details.component.html',
    styleUrl: './order-details.component.css'
})
export class OrderDetailsComponent implements OnInit {
    orderId: string = '';
    order: Order | null = null;
    loading: boolean = true;

    readonly shopStatusFlow = [
        { key: 'pending',   label: 'En attente' },
        { key: 'confirmed', label: 'Confirmé' },
        { key: 'preparing', label: 'En préparation' },
        { key: 'ready',     label: 'Prêt' },
        { key: 'completed', label: 'Terminé' },
    ];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private orderService: OrderService,
        private cdr: ChangeDetectorRef,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.orderId = this.route.snapshot.paramMap.get('id') || '';
        if (this.orderId) {
            this.loadOrderDetails();
        }
    }

    loadOrderDetails() {
        this.loading = true;
        this.orderService.getOrderById(this.orderId).subscribe({
            next: (order) => {
                Promise.resolve().then(() => {
                    this.order = order;
                    this.loading = false;
                    this.cdr.detectChanges();
                });
            },
            error: (err) => {
                console.error('Erreur', err);
                this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de charger la commande' });
                this.router.navigate(['/orders/my-orders']);
            }
        });
    }

    cancelOrder(event: Event) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Voulez-vous vraiment annuler cette commande ?',
            header: 'Confirmation d\'annulation',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Oui, annuler',
            rejectLabel: 'Non',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.orderService.cancelOrder(this.orderId).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Commande annulée' });
                        this.loadOrderDetails();
                    },
                    error: (err) => {
                        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.error?.message || 'Erreur lors de l\'annulation' });
                    }
                });
            }
        });
    }

    canCancel(): boolean {
        return this.order?.status === 'pending';
    }

    // ── Status global ──────────────────────────────────────────────────────────

    getStatusLabel(status: string): string {
        const labels: Record<string, string> = {
            pending:   'En attente de confirmation',
            confirmed: 'Commande confirmée',
            preparing: 'En cours de préparation',
            ready:     'Prête — en attente de livraison',
            completed: 'Commande livrée',
            cancelled: 'Commande annulée',
        };
        return labels[status] ?? status;
    }

    getStatusIcon(status: string): string {
        const icons: Record<string, string> = {
            pending:   'pi-clock',
            confirmed: 'pi-check-circle',
            preparing: 'pi-cog',
            ready:     'pi-truck',
            completed: 'pi-flag',
            cancelled: 'pi-times-circle',
        };
        return icons[status] ?? 'pi-info-circle';
    }

    // ── Status boutique ────────────────────────────────────────────────────────

    getShopStatusLabel(status: string): string {
        const labels: Record<string, string> = {
            pending:   'En attente',
            confirmed: 'Confirmé',
            preparing: 'En préparation',
            ready:     'Prêt',
            completed: 'Terminé',
            cancelled: 'Annulé',
        };
        return labels[status] ?? status;
    }

    getShopStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        const map: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary'> = {
            pending:   'warn',
            confirmed: 'info',
            preparing: 'warn',
            ready:     'success',
            completed: 'success',
            cancelled: 'danger',
        };
        return map[status] ?? 'secondary';
    }

    // ── Steps par boutique ─────────────────────────────────────────────────────

    private getStepIndex(status: string): number {
        return this.shopStatusFlow.findIndex(s => s.key === status);
    }

    isStepDone(shopStatus: string, stepKey: string): boolean {
        const currentIdx = this.getStepIndex(shopStatus);
        const stepIdx = this.getStepIndex(stepKey);
        return stepIdx <= currentIdx;
    }

    isCurrentStep(shopStatus: string, stepKey: string): boolean {
        return shopStatus === stepKey;
    }

    getStepClass(shopStatus: string, stepKey: string): string {
        if (this.isStepDone(shopStatus, stepKey)) return 'dot-done';
        if (this.isCurrentStep(shopStatus, stepKey)) return 'dot-current';
        return 'dot-pending';
    }

    // ── Utilitaires ────────────────────────────────────────────────────────────

    getItemCount(shopOrder: any): number {
        if (!this.order?.items || !shopOrder) return 0;
        return this.order.items.filter((item: any) => this.isItemFromShop(item, shopOrder)).length;
    }

    isItemFromShop(item: any, shopOrder: any): boolean {
        if (!item || !shopOrder?.shopId) return false;
        const itemShopId = item.shopId?._id || item.shopId;
        const shopOrderId = shopOrder.shopId?._id || shopOrder.shopId;
        return itemShopId === shopOrderId;
    }

    getProductId(item: any): string {
        const id = item?.productId;
        return id?._id ?? id ?? '';
    }

    getProductImage(item: any): string {
        // Les items de commande stockent une seule image dans `image` (string)
        const img = item?.image ?? item?.images?.[0];
        if (!img) return 'https://placehold.co/100x100/f1f5f9/94a3b8?text=Image';
        if (img.startsWith('http://') || img.startsWith('https://')) return img;
        return `http://localhost:3000/uploads/products/${img}`;
    }

    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'MGA',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount).replace('MGA', 'Ar');
    }
}

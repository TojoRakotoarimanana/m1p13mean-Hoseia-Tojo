import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OrderService, Order } from '../../../core/services/order.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { DividerModule } from 'primeng/divider';
import { TimelineModule } from 'primeng/timeline';
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
        TimelineModule,
        ConfirmDialogModule
    ],
    providers: [ConfirmationService, MessageService],
    templateUrl: './order-details.component.html',
    styleUrl: './order-details.component.css'
})
export class OrderDetailsComponent implements OnInit {
    orderId: string = '';
    order: Order | null = null;
    loading: boolean = true;

    timelineEvents: any[] = [];

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
                    this.setupTimeline();
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

    setupTimeline() {
        if (!this.order) return;

        // Basé sur le statut global de la commande
        this.timelineEvents = [
            { status: 'Commande passée', date: this.order.createdAt, icon: 'pi pi-shopping-cart', color: '#9C27B0', done: true }
        ];

        const currentStatus = this.order.status;

        if (currentStatus === 'cancelled') {
            this.timelineEvents.push({ status: 'Commande annulée', icon: 'pi pi-times', color: '#F44336', done: true });
            return;
        }

        const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed'];
        const currentIndex = statuses.indexOf(currentStatus);

        this.timelineEvents.push({ status: 'Confirmée', icon: 'pi pi-check-circle', color: '#673AB7', done: currentIndex >= 1 });
        this.timelineEvents.push({ status: 'En préparation', icon: 'pi pi-cog', color: '#607D8B', done: currentIndex >= 2 });
        this.timelineEvents.push({ status: 'Prête / Expédiée', icon: 'pi pi-truck', color: '#FF9800', done: currentIndex >= 3 });
        this.timelineEvents.push({ status: 'Livrée', icon: 'pi pi-flag', color: '#4CAF50', done: currentIndex >= 4 });
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
                // Optionnel : demander un motif avec un modal
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

    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'MGA',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount).replace('MGA', 'Ar');
    }

    getDiscountedPrice(product: any): number {
        if (!product) return 0;
        return product.price;
    }

    isItemFromShop(item: any, shopOrder: any): boolean {
        if (!item || !shopOrder || !shopOrder.shopId) return false;

        const itemShopId = item.shopId?._id || item.shopId;
        const shopOrderId = shopOrder.shopId?._id || shopOrder.shopId;

        return itemShopId === shopOrderId;
    }

    getProductImage(product: any): string {
        if (product?.images?.length) {
            const img = product.images[0];
            if (img.startsWith('http://') || img.startsWith('https://')) return img;
            return `http://localhost:3000/${img}`;
        }
        return 'https://placehold.co/100x100/f1f5f9/94a3b8?text=Image';
    }
}

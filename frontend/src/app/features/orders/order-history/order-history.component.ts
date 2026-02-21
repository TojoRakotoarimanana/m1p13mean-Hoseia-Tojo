import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { OrderService, Order } from '../../../core/services/order.service';
import { CartService, CartItem } from '../../../core/services/cart.service';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PaginatorModule } from 'primeng/paginator';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
    selector: 'app-order-history',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ButtonModule,
        TableModule,
        TagModule,
        SkeletonModule,
        ConfirmDialogModule,
        PaginatorModule
    ],
    providers: [ConfirmationService, MessageService],
    templateUrl: './order-history.component.html',
    styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent implements OnInit {
    orders: Order[] = [];
    loading = true;

    first = 0;
    rows = 10;

    constructor(
        private orderService: OrderService,
        private cartService: CartService,
        private router: Router,
        private cdr: ChangeDetectorRef,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.loading = true;
        this.orderService.getOrderHistory().subscribe({
            next: (orders) => {
                Promise.resolve().then(() => {
                    // Trier par date décroissante
                    this.orders = orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                    this.loading = false;
                    this.cdr.detectChanges();
                });
            },
            error: (err) => {
                console.error('Erreur', err);
                this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de charger l\'historique' });
                this.loading = false;
            }
        });
    }

    reorder(order: Order, event: Event) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Voulez-vous ajouter tous les articles de cette commande à votre panier actuel ?',
            header: 'Recommander',
            icon: 'pi pi-shopping-cart',
            acceptLabel: 'Oui',
            rejectLabel: 'Non',
            accept: () => {
                // Logique pour recommander
                let addedCount = 0;

                if (order.items && order.items.length > 0) {
                    order.items.forEach((item: any) => {
                        // On simule un objet Product minimal pour le CartService
                        const productStub: any = {
                            _id: item.productId,
                            name: item.name,
                            price: item.price,
                            shopId: item.shopId,
                            images: item.image ? [item.image] : []
                        };
                        this.cartService.addToCart(productStub, item.quantity).subscribe();
                        addedCount++;
                    });
                }

                if (addedCount > 0) {
                    this.messageService.add({ severity: 'success', summary: 'Succès', detail: `Articles ajoutés au panier` });
                    setTimeout(() => {
                        this.router.navigate(['/cart']);
                    }, 1000);
                } else {
                    this.messageService.add({ severity: 'warn', summary: 'Attention', detail: `Aucun article disponible pour cette commande` });
                }
            }
        });
    }

    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'MGA',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount).replace('MGA', 'Ar');
    }

    getShortId(order: any): string {
        const id = order.orderNumber || order._id;
        return typeof id === 'string' ? id.substring(0, 8).toUpperCase() : '';
    }

    getPaginatedOrders(): Order[] {
        return this.orders.slice(this.first, this.first + this.rows);
    }

    onPageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;
        this.cdr.detectChanges();
    }

    formatDate(dateStr: Date | string): string {
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }
}

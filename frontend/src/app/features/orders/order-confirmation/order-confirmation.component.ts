import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { OrderService, Order } from '../../../core/services/order.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-order-confirmation',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule
    ],
    providers: [MessageService],
    templateUrl: './order-confirmation.component.html',
    styleUrl: './order-confirmation.component.css'
})
export class OrderConfirmationComponent implements OnInit {
    orderId: string = '';
    order: Order | null = null;
    loading: boolean = true;
    error: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private orderService: OrderService,
        private messageService: MessageService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.orderId = this.route.snapshot.paramMap.get('id') || '';
        if (this.orderId) {
            this.loadOrderInfo();
        } else {
            this.error = true;
            this.loading = false;
        }
    }

    loadOrderInfo() {
        this.orderService.getOrderById(this.orderId).subscribe({
            next: (order) => {
                Promise.resolve().then(() => {
                    this.order = order;
                    this.loading = false;
                    this.cdr.detectChanges();
                });
            },
            error: (err) => {
                console.error('Erreur de chargement de la commande', err);
                this.error = true;
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de charger les détails de la commande' });
            }
        });
    }

    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'MGA',
            minimumFractionDigits: 0
        }).format(amount).replace('MGA', 'Ar');
    }

    getEstimatedDeliveryDate(): string {
        if (!this.order?.createdAt) return 'Non défini';
        const date = new Date(this.order.createdAt);
        // Supposons 2 à 3 jours de livraison
        date.setDate(date.getDate() + 2);
        return date.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    goToHome() {
        this.router.navigate(['/home']);
    }
}

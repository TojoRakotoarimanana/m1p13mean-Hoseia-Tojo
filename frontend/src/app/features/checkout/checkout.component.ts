import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../core/services/auth.service';
import { NavbarComponent } from '../../core/components/navbar/navbar.component';

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [
        CommonModule,
        NavbarComponent,
        RouterModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        ToastModule
    ],
    providers: [MessageService],
    templateUrl: './checkout.component.html',
    styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
    stepDefs = [
        { label: 'Récapitulatif' },
        { label: 'Livraison' },
        { label: 'Paiement' },
        { label: 'Confirmation' }
    ];
    activeIndex: number = 0;

    cartGroups: { shop: any, items: CartItem[], total: number }[] = [];
    totalAmount = 0;

    shippingInfo = {
        fullName: '',
        address: '',
        city: '',
        phone: '',
        notes: ''
    };

    paymentMethod: string = 'cash';

    isProcessing = false;

    constructor(
        private cartService: CartService,
        private orderService: OrderService,
        private authService: AuthService,
        private router: Router,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        const state = this.cartService.getCart();
        if (state.totalItems === 0) {
            this.router.navigate(['/cart']);
            return;
        }

        this.cartGroups = this.cartService.getCartGroupedByShop();
        this.totalAmount = state.totalAmount;

        const user = this.authService.getUser();
        if (user) {
            this.shippingInfo.fullName = user.username || '';
            this.shippingInfo.phone = user.phone || '';
        }
    }

    nextStep() {
        if (this.activeIndex === 1 && !this.validateShipping()) {
            return;
        }
        if (this.activeIndex < 3) {
            this.activeIndex++;
        }
    }

    prevStep() {
        if (this.activeIndex > 0) {
            this.activeIndex--;
        }
    }

    validateShipping(): boolean {
        if (!this.shippingInfo.fullName || !this.shippingInfo.address || !this.shippingInfo.city || !this.shippingInfo.phone) {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Veuillez remplir tous les champs obligatoires' });
            return false;
        }
        return true;
    }

    placeOrder() {
        this.isProcessing = true;

        const shopOrders = this.cartGroups.map(group => {
            return {
                shopId: group.shop._id,
                items: group.items.map(item => ({
                    productId: item.product._id,
                    quantity: item.quantity,
                    price: item.product.price,
                    name: item.product.name,
                    subtotal: item.product.price * item.quantity
                })),
                subtotal: group.total,
                status: 'pending'
            };
        });

        const orderData = {
            shopOrders: shopOrders,
            totalAmount: this.totalAmount,
            deliveryInfo: {
                method: 'delivery',
                phone: this.shippingInfo.phone,
                address: {
                    street: this.shippingInfo.address,
                    city: this.shippingInfo.city
                }
            },
            paymentMethod: this.paymentMethod
        };

        this.orderService.createOrder(orderData).subscribe({
            next: (res) => {
                this.cartService.clearCartLocal();
                this.isProcessing = false;
                const orderId = res.order?._id || res.orders?.[0]?._id;

                if (orderId) {
                    this.router.navigate(['/orders/confirmation', orderId]);
                } else {
                    this.router.navigate(['/orders/my-orders']);
                }
            },
            error: (err) => {
                this.isProcessing = false;
                this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.error?.message || 'Erreur lors de la création de la commande' });
            }
        });
    }

    getProductImageUrl(product: any): string {
        const img = product.images?.[0];
        if (!img) return '';
        if (img.startsWith('http://') || img.startsWith('https://')) return img;
        return `http://localhost:3000/${img}`;
    }

    getDiscountedPrice(product: any): number {
        return product.price;
    }

    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'MGA',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount).replace('MGA', 'Ar');
    }
}

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../core/services/cart.service';
import { NavbarComponent } from '../../core/components/navbar/navbar.component';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [
        CommonModule,
        NavbarComponent,
        RouterModule,
        FormsModule,
        ButtonModule,
        ConfirmDialogModule,
        ToastModule
    ],
    providers: [ConfirmationService, MessageService],
    templateUrl: './cart.component.html',
    styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
    cartGroups: { shop: any, items: CartItem[], total: number }[] = [];
    totalAmount = 0;
    totalItems = 0;

    constructor(
        private cartService: CartService,
        private router: Router,
        private cdr: ChangeDetectorRef,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.cartService.cart$.subscribe(() => {
            this.refreshViewFromState();
        });
        // Rafraîchir depuis le serveur pour avoir les prix de promotion à jour
        this.cartService.refresh().subscribe();
    }

    private refreshViewFromState() {
        const state = this.cartService.getCart();
        this.totalAmount = state.totalAmount;
        this.totalItems = state.totalItems;
        this.cartGroups = this.cartService.getCartGroupedByShop();
        this.cdr.detectChanges();
    }

    updateQuantity(productId: string, quantity: number) {
        if (quantity > 0) {
            this.cartService.updateQuantity(productId, quantity).subscribe({
                next: () => {
                    this.refreshViewFromState();
                },
                error: (err) => {
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err?.error?.message || 'Impossible de mettre à jour la quantité' });
                }
            });
        }
    }

    removeItem(productId: string) {
        this.confirmationService.confirm({
            message: 'Voulez-vous vraiment retirer cet article du panier ?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Oui',
            rejectLabel: 'Non',
            accept: () => {
                this.cartService.removeItem(productId).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Article retiré du panier' });
                        this.refreshViewFromState();
                    },
                    error: (err) => {
                        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err?.error?.message || 'Impossible de supprimer cet article' });
                    }
                });
            }
        });
    }

    clearCart(event: Event) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Voulez-vous vraiment vider tout votre panier ?',
            header: 'Vider le panier',
            icon: 'pi pi-info-circle',
            acceptLabel: 'Oui, vider',
            rejectLabel: 'Annuler',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.cartService.clearCart().subscribe(() => {
                    this.messageService.add({ severity: 'info', summary: 'Panier vidé', detail: 'Votre panier a été entièrement vidé' });
                });
            }
        });
    }

    checkout() {
        this.router.navigate(['/checkout']);
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
        return product.price;
    }

    getProductImage(product: any): string {
        if (product.images?.length) {
            const img = product.images[0];
            if (img.startsWith('http://') || img.startsWith('https://')) return img;
            return `${environment.apiUrl}/${img}`;
        }
        return 'https://placehold.co/100x100/f1f5f9/94a3b8?text=Image';
    }

    getShopLogo(shop: any): string {
        if (shop?.logo) {
            if (shop.logo.startsWith('http://') || shop.logo.startsWith('https://')) return shop.logo;
            return `${environment.apiUrl}/${shop.logo}`;
        }
        return '';
    }
}

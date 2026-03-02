import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-floating-cart-button',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './floating-cart-button.component.html',
  styleUrls: ['./floating-cart-button.component.css']
})
export class FloatingCartButtonComponent implements OnInit, OnDestroy {
  cartItemsCount = 0;
  isClient = false;
  isOnCartPage = false;
  isPanelOpen = false;
  cartItems: any[] = [];
  totalAmount = 0;
  
  private cartSubscription?: Subscription;
  private userSubscription?: Subscription;
  private routerSubscription?: Subscription;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Subscribe to user changes to check if client
    this.userSubscription = this.authService.user$.subscribe(user => {
      this.isClient = user?.role === 'client';
    });

    // Subscribe to cart changes
    this.cartSubscription = this.cartService.cart$.subscribe(state => {
      this.cartItemsCount = state.totalItems;
      this.totalAmount = state.totalAmount;
      this.cartItems = state.items;
    });

    // Hide button on cart and checkout pages
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isOnCartPage = this.router.url.includes('/cart') || 
                           this.router.url.includes('/checkout');
        // Close panel on navigation
        this.isPanelOpen = false;
      });
    
    // Initial check
    this.isOnCartPage = this.router.url.includes('/cart') || 
                       this.router.url.includes('/checkout');
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  togglePanel(): void {
    this.isPanelOpen = !this.isPanelOpen;
  }

  closePanel(): void {
    this.isPanelOpen = false;
  }

  goToCart(): void {
    this.closePanel();
    this.router.navigate(['/cart']);
  }

  goToCheckout(): void {
    this.closePanel();
    this.router.navigate(['/checkout']);
  }

  removeItem(productId: string): void {
    this.cartService.removeItem(productId).subscribe({
      next: () => {
        // Item removed successfully
      },
      error: (err) => {
        console.error('Error removing item:', err);
      }
    });
  }

  updateQuantity(productId: string, change: number): void {
    const item = this.cartItems.find(i => i.product._id === productId);
    if (item) {
      const newQty = item.quantity + change;
      if (newQty > 0) {
        this.cartService.updateQuantity(productId, newQty).subscribe({
          next: () => {
            // Quantity updated successfully
          },
          error: (err) => {
            console.error('Error updating quantity:', err);
          }
        });
      } else {
        this.removeItem(productId);
      }
    }
  }

  getProductImageUrl(product: any): string {
    const img = product.images?.[0];
    if (!img) return 'assets/placeholder.png';
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    return `http://localhost:3000/${img}`;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0
    }).format(amount).replace('MGA', 'Ar');
  }
}

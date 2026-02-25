import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { ChipModule } from 'primeng/chip';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { NotificationBellComponent } from '../notification-bell/notification-bell.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DividerModule,
    RippleModule,
    MenuModule,
    ButtonModule,
    AvatarModule,
    ChipModule,
    NotificationBellComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  user: any = null;
  items: MenuItem[] = [];
  cartItemsCount = 0;
  private userSubscription?: Subscription;
  private cartSubscription?: Subscription;

  constructor(
    public authService: AuthService,
    private cartService: CartService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.userSubscription = this.authService.user$.subscribe((user) => {
      this.user = user;
      this.loadMenuItems();
    });

    this.cartSubscription = this.cartService.cart$.subscribe(state => {
      this.cartItemsCount = state.totalItems;
      if (this.user?.role === 'client') {
        this.loadMenuItems(); // Recharger le menu pour mettre à jour le badge
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  navigateToHome(): void {
    const role = this.user?.role;
    switch (role) {
      case 'client':
        this.router.navigate(['/home']);
        break;
      case 'boutique':
        this.router.navigate(['/boutique-dashboard']);
        break;
      case 'admin':
        this.router.navigate(['/dashboard']);
        break;
      default:
        this.router.navigate(['/dashboard']);
    }
  }

  loadMenuItems(): void {
    const role = this.user?.role;

    if (role === 'admin') {
      this.items = [
        {
          label: 'Gestion',
          icon: 'pi pi-cog',
          items: [
            {
              label: 'Boutiques',
              icon: 'pi pi-shop',
              command: () => this.router.navigate(['/admin/shops']),
            },
            {
              label: 'Catégories',
              icon: 'pi pi-tags',
              command: () => this.router.navigate(['/categories']),
            },
          ],
        },
        {
          label: 'Demandes',
          icon: 'pi pi-inbox',
          items: [
            {
              label: 'Propriétaires Boutiques',
              icon: 'pi pi-file-edit',
              command: () => this.router.navigate(['/admin/register-boutique-requests']),
            },
            {
              label: 'Demandes Shops',
              icon: 'pi pi-shopping-bag',
              command: () => this.router.navigate(['/admin/shop-requests']),
            },
          ],
        },
        {
          separator: true,
        },
        {
          label: 'Déconnexion',
          icon: 'pi pi-power-off',
          styleClass: 'logout-menu-item',
          command: () => this.logout(),
        },
      ];
    } else if (role === 'boutique') {
      this.items = [
        {
          label: 'Tableau de bord',
          icon: 'pi pi-th-large',
          command: () => this.router.navigate(['/boutique-dashboard']),
        },
        {
          separator: true,
        },
        {
          label: 'Ma Boutique',
          icon: 'pi pi-building',
          command: () => this.router.navigate(['/my-shop']),
        },
        {
          label: 'Mes Produits',
          icon: 'pi pi-box',
          command: () => this.router.navigate(['/my-products']),
        },
        {
          label: 'Commandes',
          icon: 'pi pi-receipt',
          command: () => this.router.navigate(['/my-orders']),
        },
        {
          label: 'Gestion Stock',
          icon: 'pi pi-list',
          command: () => this.router.navigate(['/my-products/stock']),
        },
        {
          separator: true,
        },
        {
          label: 'Déconnexion',
          icon: 'pi pi-power-off',
          styleClass: 'logout-menu-item',
          command: () => this.logout(),
        },
      ];
    } else if (role === 'client') {
      this.items = [
        {
          label: 'Navigation',
          icon: 'pi pi-compass',
          items: [
            {
              label: 'Accueil',
              icon: 'pi pi-home',
              command: () => this.router.navigate(['/home']),
            },
            {
              label: 'Boutiques',
              icon: 'pi pi-building',
              command: () => this.router.navigate(['/shops']),
            },
            {
              label: 'Tous les articles',
              icon: 'pi pi-th-large',
              command: () => this.router.navigate(['/products']),
            },
          ],
        },
        {
          label: 'Mes Achats',
          icon: 'pi pi-shopping-bag',
          items: [
            {
              label: 'Panier',
              icon: 'pi pi-shopping-cart',
              badge: this.cartItemsCount > 0 ? this.cartItemsCount.toString() : undefined,
              badgeStyleClass: 'bg-primary text-white',
              command: () => this.router.navigate(['/cart']),
            },
            {
              label: 'Mes Commandes',
              icon: 'pi pi-receipt',
              command: () => this.router.navigate(['/orders/my-orders']),
            },
            {
              label: 'Historique d\'Achats',
              icon: 'pi pi-history',
              command: () => this.router.navigate(['/orders/history']),
            },
          ]
        },
        {
          separator: true,
        },
        {
          label: 'Déconnexion',
          icon: 'pi pi-power-off',
          styleClass: 'logout-menu-item',
          command: () => this.logout(),
        },
      ];
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

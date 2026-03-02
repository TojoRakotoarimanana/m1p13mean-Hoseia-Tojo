import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription, filter } from 'rxjs';

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
import { UserService } from '../../services/user.service';
import { AdminService } from '../../services/admin.service';

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
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  user: any = null;
  items: MenuItem[] = [];
  cartItemsCount = 0;
  pendingBoutiquesCount = 0;
  pendingShopsCount = 0;
  sidebarOpen = signal(false);
  private userSubscription?: Subscription;
  private cartSubscription?: Subscription;
  private routerSubscription?: Subscription;
  private pendingCountsInterval?: any;

  constructor(
    public authService: AuthService,
    private cartService: CartService,
    private router: Router,
    private userService: UserService,
    private adminService: AdminService,
  ) { }

  ngOnInit(): void {
    this.userSubscription = this.authService.user$.subscribe((user) => {
      this.user = user;
      this.loadMenuItems();
      
      // Charger les comptes de demandes pour l'admin
      if (user?.role === 'admin') {
        this.loadPendingCounts();
        // Actualiser toutes les 30 secondes
        this.pendingCountsInterval = setInterval(() => {
          this.loadPendingCounts();
        }, 30000);
      }
    });

    this.cartSubscription = this.cartService.cart$.subscribe(state => {
      this.cartItemsCount = state.totalItems;
      if (this.user?.role === 'client') {
        this.loadMenuItems(); // Recharger le menu pour mettre à jour le badge
      }
    });

    // Close sidebar on route change (mobile UX)
    this.routerSubscription = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.sidebarOpen.set(false));
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.pendingCountsInterval) {
      clearInterval(this.pendingCountsInterval);
    }
  }

  loadPendingCounts(): void {
    // Vérifier explicitement que l'utilisateur est admin
    if (this.user?.role !== 'admin') {
      return;
    }

    // Charger les demandes de propriétaires de boutiques en attente
    this.userService.listPendingBoutiques().subscribe({
      next: (response) => {
        this.pendingBoutiquesCount = response.data?.length || 0;
        console.log('Pending boutiques count:', this.pendingBoutiquesCount);
        this.loadMenuItems(); // Rafraîchir le menu avec les nouveaux badges
      },
      error: (err) => console.error('Erreur lors du chargement des demandes de boutiques:', err)
    });

    // Charger les demandes de shops en attente
    this.adminService.getPendingShops().subscribe({
      next: (response) => {
        this.pendingShopsCount = response.data?.length || 0;
        console.log('Pending shops count:', this.pendingShopsCount);
        this.loadMenuItems(); // Rafraîchir le menu avec les nouveaux badges
      },
      error: (err) => console.error('Erreur lors du chargement des demandes de shops:', err)
    });
  }

  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
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
              label: 'Utilisateurs',
              icon: 'pi pi-users',
              command: () => this.router.navigate(['/admin/users']),
            },
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
            {
              label: 'Commandes',
              icon: 'pi pi-receipt',
              command: () => this.router.navigate(['/admin/orders']),
            },
          ],
        },
        {
          label: 'Demandes',
          icon: 'pi pi-inbox',
          badge: (this.pendingBoutiquesCount + this.pendingShopsCount) > 0 ? 
            (this.pendingBoutiquesCount + this.pendingShopsCount).toString() : undefined,
          badgeClass: 'p-badge-danger',
          items: [
            {
              label: 'Propriétaires Boutiques',
              icon: 'pi pi-file-edit',
              badge: this.pendingBoutiquesCount > 0 ? this.pendingBoutiquesCount.toString() : undefined,
              badgeClass: 'p-badge-danger',
              command: () => this.router.navigate(['/admin/register-boutique-requests']),
            },
            {
              label: 'Demandes Shops',
              icon: 'pi pi-shopping-bag',
              badge: this.pendingShopsCount > 0 ? this.pendingShopsCount.toString() : undefined,
              badgeClass: 'p-badge-danger',
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

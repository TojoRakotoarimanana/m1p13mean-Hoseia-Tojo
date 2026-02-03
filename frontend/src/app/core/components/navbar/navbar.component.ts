// navbar.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { ChipModule } from 'primeng/chip';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';

import { AuthService } from '../../services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  routerLink?: string;
  items?: MenuItem[];
  expanded?: boolean;
  separator?: boolean;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    AvatarModule,
    ChipModule,
    ButtonModule,
    DividerModule,
    RippleModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  user: any = null;
  items: MenuItem[] = [];
  private userSubscription?: Subscription;

  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // S'abonner aux changements d'utilisateur en temps réel
    this.userSubscription = this.authService.user$.subscribe(user => {
      this.user = user;
      this.loadMenuItems();
    });
  }

  ngOnDestroy(): void {
    // Nettoyer l'abonnement pour éviter les fuites mémoire
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  loadMenuItems(): void {
    const role = this.user?.role;

    // Menu selon le rôle avec sous-menus
    if (role === 'admin') {
      this.items = [
        {
          label: 'Dashboard',
          icon: 'pi pi-home',
          routerLink: '/dashboard'
        },
        {
          label: 'Gestion',
          icon: 'pi pi-cog',
          expanded: false,
          items: [
            { label: 'Boutiques', icon: 'pi pi-shop', routerLink: '/shops' },
            { label: 'Catégories', icon: 'pi pi-tags', routerLink: '/categories' }
          ]
        },
        {
          label: 'Demandes',
          icon: 'pi pi-inbox',
          expanded: false,
          items: [
            { label: 'Propriétaires Boutiques', icon: 'pi pi-file-edit', routerLink: '/admin/register-boutique-requests' },
            { label: 'Créations Shops', icon: 'pi pi-shopping-bag', routerLink: '/admin/shop-requests' }
          ]
        }
      ];
    } else if (role === 'boutique') {
      this.items = [
        {
          label: 'Dashboard',
          icon: 'pi pi-home',
          routerLink: '/dashboard'
        },
        {
          label: 'Mon Espace',
          icon: 'pi pi-briefcase',
          expanded: false,
          items: [
            { label: 'Ma Boutique', icon: 'pi pi-building', routerLink: '/my-shop' },
            { label: 'Mes Produits', icon: 'pi pi-box', routerLink: '/my-products' }
          ]
        },
        {
          label: 'Explorer',
          icon: 'pi pi-compass',
          expanded: false,
          items: [
            { label: 'Toutes les Boutiques', icon: 'pi pi-shop', routerLink: '/shops' }
          ]
        }
      ];
    } else if (role === 'client') {
      this.items = [
        {
          label: 'Accueil',
          icon: 'pi pi-home',
          routerLink: '/dashboard'
        },
        {
          label: 'Shopping',
          icon: 'pi pi-shopping-cart',
          expanded: false,
          items: [
            { label: 'Boutiques', icon: 'pi pi-shop', routerLink: '/shops' }
          ]
        }
      ];
    }
  }

  toggleSubmenu(item: MenuItem): void {
    if (item.items) {
      item.expanded = !item.expanded;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
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
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DividerModule, // kept as it might be used elsewhere
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
  private userSubscription?: Subscription;

  constructor(
    public authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // S'abonner aux changements d'utilisateur en temps réel
    this.userSubscription = this.authService.user$.subscribe((user) => {
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
  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
  loadMenuItems(): void {
    const role = this.user?.role;

    // Menu selon le rôle
    if (role === 'admin') {
      this.items = [
        {
          label: 'Gestion',
          icon: 'pi pi-cog',
          items: [
            {
              label: 'Boutiques',
              icon: 'pi pi-shop',
              command: () => this.router.navigate(['/shops']),
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
          label: 'Dashboard',
          icon: 'pi pi-home',
          command: () => this.router.navigate(['/dashboard']),
        },
        {
          separator: true,
        },
        {
          label: 'Mon Espace',
          icon: 'pi pi-briefcase',
          items: [
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
          ],
        },
        {
          label: 'Explorer',
          icon: 'pi pi-compass',
          items: [
            {
              label: 'Toutes les Boutiques',
              icon: 'pi pi-shop',
              command: () => this.router.navigate(['/shops']),
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
    } else if (role === 'client') {
      this.items = [
        {
          label: 'Accueil',
          icon: 'pi pi-home',
          command: () => this.router.navigate(['/dashboard']),
        },
        {
          separator: true,
        },
        {
          label: 'Boutiques',
          icon: 'pi pi-shop',
          command: () => this.router.navigate(['/shops']),
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

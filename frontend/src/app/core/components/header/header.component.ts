import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

// PrimeNG Imports
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    AvatarModule,
    ButtonModule,
    MenuModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('menu') menu!: Menu;
  
  user: any = null;
  userMenuItems: MenuItem[] = [];
  pageTitle: string = 'Dashboard';
  menuVisible: boolean = false;
  private userSubscription?: Subscription;
  private routeSubscription?: Subscription;

  private pageTitles: { [key: string]: string } = {
    'dashboard': 'Tableau de bord',
    'shops': 'Boutiques',
    'categories': 'Catégories',
    'my-shop': 'Ma Boutique',
    'my-products': 'Mes Produits',
    'register-boutique-requests': 'Demandes Propriétaires',
    'shop-requests': 'Demandes Boutiques',
    'product-form': 'Édition Produit',
    'stock-management': 'Gestion Stock',
    'product-stats': 'Statistiques'
  };

  constructor(
    public authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.user$.subscribe(user => {
      this.user = user;
      this.loadUserMenu();
    });

    // Subscribe to route changes
    this.routeSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updatePageTitle();
      });
    
    // Initial page title
    this.updatePageTitle();
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  updatePageTitle(): void {
    const url = this.router.url;
    const segments = url.split('/').filter(s => s);
    
    if (segments.length > 0) {
      const lastSegment = segments[segments.length - 1];
      this.pageTitle = this.pageTitles[lastSegment] || 'Mall Center';
    } else {
      this.pageTitle = 'Mall Center';
    }
  }

  loadUserMenu(): void {
    this.userMenuItems = [
      {
        label: 'Déconnexion',
        icon: 'pi pi-power-off',
        command: () => this.logout()
      }
    ];
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.menuVisible = !this.menuVisible;
    this.menu.toggle(event);
  }
}

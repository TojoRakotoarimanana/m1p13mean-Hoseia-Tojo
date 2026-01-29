// navbar.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
  routerLink: string;
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
export class NavbarComponent implements OnInit {
  user: any = null;
  items: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUser();
    this.loadMenuItems();
  }

  loadUser(): void {
    // Récupérer l'utilisateur depuis le service d'authentification
    this.user = this.authService.getUser();
  }

  loadMenuItems(): void {
    const role = this.user?.role;

    // Menu selon le rôle
    if (role === 'admin') {
      this.items = [
        { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/dashboard' },
        { label: 'Boutiques', icon: 'pi pi-shop', routerLink: '/shops' },
        { label: 'Catégories', icon: 'pi pi-tags', routerLink: '/categories' },
        { label: 'Demandes Boutiques', icon: 'pi pi-file-edit', routerLink: '/admin/register-boutique-requests' },
        { label: 'Demandes Shops', icon: 'pi pi-shopping-bag', routerLink: '/admin/shop-requests' }
      ];
    } else if (role === 'boutique') {
      this.items = [
        { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/dashboard' },
        { label: 'Ma Boutique', icon: 'pi pi-building', routerLink: '/my-shop' },
        { label: 'Boutiques', icon: 'pi pi-shop', routerLink: '/shops' }
      ];
    } else if (role === 'client') {
      this.items = [
        { label: 'Accueil', icon: 'pi pi-home', routerLink: '/dashboard' },
        { label: 'Boutiques', icon: 'pi pi-shop', routerLink: '/shops' }
      ];
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
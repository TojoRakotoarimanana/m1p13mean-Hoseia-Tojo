import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MenubarModule } from 'primeng/menubar'; // Or just buttons toolbar
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MenubarModule, ButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  items: MenuItem[] | undefined;
  user: any;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
        this.user = user;
        this.updateMenu();
    });
  }

  updateMenu() {
    if (!this.user) {
        this.items = [];
        return;
    }

    this.items = [
        {
            label: 'Tableau de bord',
            icon: 'pi pi-home',
            routerLink: '/dashboard',
             visible: this.user.role === 'admin' // Or everyone? Let's say Admin mainly uses Dashboard for overview? Or maybe Client has a dashboard?
             // Actually currently dashboard has buttons for everyone.
             // Let's keep /dashboard for everyone for now.
             // But user request specifically about Admin having all menus.
        },
        {
            label: 'Boutiques',
            icon: 'pi pi-shop',
            routerLink: '/shops'
        }
    ];

    if (this.user.role === 'admin') {
        this.items.push(
            {
                label: 'Catégories',
                icon: 'pi pi-tags',
                routerLink: '/categories'
            },
            {
                label: 'Demandes (Utilisateurs)',
                icon: 'pi pi-user-plus',
                routerLink: '/admin/register-boutique-requests'
            },
            {
                label: 'Demandes (Boutiques)',
                icon: 'pi pi-inbox',
                routerLink: '/admin/shop-requests'
            }
        );
    } else if (this.user.role === 'boutique') {
        this.items.push({
            label: 'Ma Boutique',
            icon: 'pi pi-store',
            routerLink: '/my-shop'
        });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

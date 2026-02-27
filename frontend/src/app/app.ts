import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { NavbarComponent } from './core/components/navbar/navbar.component';
import { HeaderComponent } from './core/components/header/header.component';
import { AuthService } from './core/services/auth.service';
import { ToastModule } from 'primeng/toast';
import { inject } from '@vercel/analytics';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, HeaderComponent, ToastModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('frontend');
  private routerSub?: Subscription;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Initialize Vercel Analytics
    inject();
    
    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const mainContent = document.querySelector('.main-content');
      if (mainContent) mainContent.scrollTop = 0;
    });
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
  }
}

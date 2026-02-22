import { Component, OnInit, OnDestroy, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Popover } from 'primeng/popover';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';

import { ApiNotificationService, ApiNotification } from '../../services/api-notification.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [
    CommonModule,
    Popover,
    ButtonModule,
    BadgeModule,
    DividerModule,
  ],
  templateUrl: './notification-bell.component.html',
  styleUrls: ['./notification-bell.component.css'],
})
export class NotificationBellComponent implements OnInit, OnDestroy {
  @ViewChild('op') popover!: Popover;

  private notifService = inject(ApiNotificationService);
  private authService  = inject(AuthService);
  private router       = inject(Router);
  private msgService   = inject(MessageService);

  unreadCount$   = this.notifService.unreadCount$;
  notifications$ = this.notifService.notifications$;

  /** true le temps de l'animation shake du badge */
  bellShaking = false;

  private userSub?: Subscription;
  private sseSub?: Subscription;

  ngOnInit(): void {
    // Démarrer/arrêter la connexion SSE selon l'utilisateur connecté
    this.userSub = this.authService.user$.subscribe(user => {
      if (user && (user.role === 'client' || user.role === 'boutique')) {
        this.notifService.startPolling();
        this.listenToSSE();
      } else {
        this.notifService.stopPolling();
        this.sseSub?.unsubscribe();
      }
    });
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
    this.sseSub?.unsubscribe();
    this.notifService.stopPolling();
  }

  private listenToSSE(): void {
    if (this.sseSub) return;
    this.sseSub = this.notifService.newNotification$.subscribe(n => {
      // Toast automatique visible sans cliquer sur la cloche
      this.msgService.add({
        severity: 'info',
        summary: n.title,
        detail: n.message,
        life: 6000,
        icon: 'pi pi-bell',
      });
      // Animation shake du badge
      this.bellShaking = true;
      setTimeout(() => this.bellShaking = false, 700);
    });
  }

  togglePanel(event: Event): void {
    this.popover.toggle(event);
    this.notifService.refresh();
  }

  onNotificationClick(n: ApiNotification): void {
    if (!n.isRead) {
      this.notifService.markAsRead(n._id).subscribe(() => {
        const updated = this.notifService.notifications$.value.map(x =>
          x._id === n._id ? { ...x, isRead: true } : x
        );
        this.notifService.notifications$.next(updated);
        const newCount = Math.max(0, this.notifService.unreadCount$.value - 1);
        this.notifService.unreadCount$.next(newCount);
      });
    }
    this.popover.hide();
    if (n.relatedModel === 'Order' && n.relatedId) {
      this.router.navigate(['/orders', n.relatedId]);
    }
  }

  markAllRead(): void {
    this.notifService.markAllAsRead().subscribe(() => {
      const updated = this.notifService.notifications$.value.map(x => ({ ...x, isRead: true }));
      this.notifService.notifications$.next(updated);
      this.notifService.unreadCount$.next(0);
    });
  }
}

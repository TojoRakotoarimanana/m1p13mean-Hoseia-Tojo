import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subject, Subscription, interval } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ApiNotification {
  _id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  relatedId?: string;
  relatedModel?: string;
  isRead: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class ApiNotificationService implements OnDestroy {
  private readonly apiUrl = `${environment.apiUrl}/api/notifications`;
  private pollingSub?: Subscription;
  private eventSource?: EventSource;
  private sseActive = false;

  unreadCount$ = new BehaviorSubject<number>(0);
  notifications$ = new BehaviorSubject<ApiNotification[]>([]);

  /** Émet la notification brute à chaque événement SSE entrant — pour les toasts */
  newNotification$ = new Subject<ApiNotification>();

  constructor(private http: HttpClient) {}

  // ── API HTTP ────────────────────────────────────────────────────────────────

  getNotifications(params: { page?: number; limit?: number } = {}) {
    return this.http.get<{ items: ApiNotification[]; total: number }>(this.apiUrl, { params: params as any });
  }

  getUnreadCount() {
    return this.http.get<{ unreadCount: number }>(`${this.apiUrl}/unread-count`);
  }

  markAsRead(id: string) {
    return this.http.patch(`${this.apiUrl}/${id}/read`, {});
  }

  markAllAsRead() {
    return this.http.patch(`${this.apiUrl}/read-all`, {});
  }

  // ── SSE + Fallback polling ──────────────────────────────────────────────────

  startPolling() {
    if (this.sseActive || this.pollingSub || this.eventSource) return;

    // Chargement immédiat
    this.refresh();

    const token = localStorage.getItem('auth_token');
    if (token && typeof EventSource !== 'undefined') {
      this.connectSSE(token);
    } else {
      this.startFallbackPolling();
    }
  }

  private connectSSE(token: string) {
    const url = `${this.apiUrl}/stream?token=${encodeURIComponent(token)}`;
    this.eventSource = new EventSource(url);

    this.eventSource.onopen = () => {
      this.sseActive = true;
      this.stopFallbackPolling();
    };

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'notification') {
          // 1. Mettre à jour le badge instantanément
          this.unreadCount$.next(data.unreadCount);
          // 2. Prépend la nouvelle notification dans le cache sans attendre le HTTP
          if (data.notification) {
            const current = this.notifications$.value;
            this.notifications$.next([data.notification, ...current].slice(0, 10));
            // 3. Signaler aux composants abonnés (toast)
            this.newNotification$.next(data.notification as ApiNotification);
          }
          // 4. Synchroniser la liste complète depuis le serveur
          this.fetchNotifications();
        }
      } catch { /* ignorer */ }
    };

    this.eventSource.onerror = () => {
      this.sseActive = false;
      this.eventSource?.close();
      this.eventSource = undefined;
      this.startFallbackPolling();
    };
  }

  private startFallbackPolling() {
    if (this.pollingSub) return;
    this.pollingSub = interval(15000)
      .pipe(switchMap(() => this.getUnreadCount().pipe(catchError(() => of({ unreadCount: 0 })))))
      .subscribe(res => this.unreadCount$.next(res.unreadCount));
  }

  private stopFallbackPolling() {
    this.pollingSub?.unsubscribe();
    this.pollingSub = undefined;
  }

  stopPolling() {
    this.stopFallbackPolling();
    this.eventSource?.close();
    this.eventSource = undefined;
    this.sseActive = false;
    this.unreadCount$.next(0);
    this.notifications$.next([]);
  }

  refresh() {
    this.getUnreadCount()
      .pipe(catchError(() => of({ unreadCount: 0 })))
      .subscribe(res => this.unreadCount$.next(res.unreadCount));
    this.fetchNotifications();
  }

  private fetchNotifications() {
    this.getNotifications({ limit: 10 })
      .pipe(catchError(() => of({ items: [], total: 0 })))
      .subscribe(res => this.notifications$.next(res.items));
  }

  refreshUnreadCount() {
    this.getUnreadCount()
      .pipe(catchError(() => of({ unreadCount: 0 })))
      .subscribe(res => this.unreadCount$.next(res.unreadCount));
  }

  ngOnDestroy() {
    this.stopPolling();
  }
}

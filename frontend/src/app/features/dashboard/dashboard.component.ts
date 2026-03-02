import { Component, OnInit, LOCALE_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { forkJoin } from 'rxjs';

registerLocaleData(localeFr);
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { ChartModule } from 'primeng/chart';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AdminService, GlobalStats, Activity } from '../../core/services/admin.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TableModule,
    TagModule,
    SkeletonModule,
    ChartModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  user: any;
  stats: GlobalStats | null = null;
  allActivities: Activity[] = [];
  loading = true;
  activitiesLoading = true;
  currentDate = new Date();

  // Pagination
  currentPage = 1;
  readonly pageSize = 5;

  get activities(): Activity[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.allActivities.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.allActivities.length / this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get pageEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.allActivities.length);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  revenueChartData: any = null;
  revenueChartOptions: any = null;
  ordersChartData: any = null;
  ordersChartOptions: any = null;
  shopStatusChartData: any = null;
  shopStatusChartOptions: any = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) {
    this.user = this.authService.getUser();
  }

  ngOnInit() {
    setTimeout(() => {
      this.loadDashboardData();
    });
  }

  loadDashboardData() {
    this.loading = true;
    this.activitiesLoading = true;
    this.allActivities = [];
    this.currentPage = 1;
    this.revenueChartData = null;
    this.ordersChartData = null;
    this.shopStatusChartData = null;

    this.adminService.getGlobalStats().subscribe({
      next: (response) => {
        if (response.success) {
          this.stats = response.data;
          this.buildShopStatusChart();
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });

    this.adminService.getRecentActivities(50).subscribe({
      next: (response) => {
        if (response.success) {
          this.allActivities = response.data.activities;
          this.currentPage = 1;
        }
        this.activitiesLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.activitiesLoading = false;
        this.cdr.detectChanges();
      },
    });

    // Revenus + commandes par mois fusionnés en une seule passe
    forkJoin({
      rev:  this.adminService.getRevenueByMonth(6),
      ord:  this.adminService.getOrdersByMonth(6),
    }).subscribe({
      next: ({ rev, ord }) => {
        const revData: any[] = rev?.data?.revenue  ?? [];
        const ordData: any[] = ord?.data?.orders   ?? [];

        // Fusionner : ajouter le compte de commandes à chaque mois de revenus
        const merged = revData.map((r: any) => {
          const match = ordData.find(
            (o: any) => o.year === r.year && o.month === r.month
          );
          return { ...r, orderCount: match?.count ?? 0 };
        });

        this.buildRevenueChart(merged);
        this.cdr.detectChanges();
      },
      error: () => {
        this.buildRevenueChart([]);
        this.cdr.detectChanges();
      },
    });

    this.adminService.getOrdersByDay(7).subscribe({
      next: (response) => {
        const raw: any[] = response?.data?.orders ?? [];
        this.buildOrdersChart(raw);
        this.cdr.detectChanges();
      },
      error: () => {
        this.buildOrdersChart([]);
        this.cdr.detectChanges();
      },
    });
  }

  buildRevenueChart(data: any[]) {
    const empty = data.length === 0;
    // Le backend retourne { label, total, orderCount (fusionné) }
    const labels   = empty ? ['Jan','Fév','Mar','Avr','Mai','Jun']
                           : data.map((d: any) => d.label ?? '');
    const revenues = empty ? [0,0,0,0,0,0]
                           : data.map((d: any) => d.total ?? 0);
    const orders   = empty ? [0,0,0,0,0,0]
                           : data.map((d: any) => d.orderCount ?? 0);

    this.revenueChartData = {
      labels,
      datasets: [
        {
          label: 'Revenus (Ar)',
          data: revenues,
          borderColor: '#2563eb',
          // Couleur statique — évite le crash du gradient factory avant mount du canvas
          backgroundColor: 'rgba(37,99,235,0.07)',
          fill: true,
          tension: 0.42,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#2563eb',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          borderWidth: 2,
          yAxisID: 'y',
        },
        {
          label: 'Commandes',
          data: orders,
          borderColor: '#059669',
          backgroundColor: 'rgba(5,150,105,0.05)',
          fill: false,
          tension: 0.42,
          pointRadius: 3,
          pointHoverRadius: 5,
          pointBackgroundColor: '#059669',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          borderWidth: 2,
          borderDash: [5, 3],
          yAxisID: 'y1',
        },
      ],
    };

    this.revenueChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#111827',
          borderColor: '#e5e7eb',
          borderWidth: 1,
          titleColor: '#f9fafb',
          bodyColor: '#9ca3af',
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: (ctx: any) => {
              if (ctx.datasetIndex === 0)
                return `  Revenus: ${this.formatCurrency(ctx.parsed.y)}`;
              return `  Commandes: ${ctx.parsed.y}`;
            },
          },
        },
      },
      scales: {
        x: {
          ticks: { color: '#9ca3af', font: { size: 10 } },
          grid: { color: '#f3f4f6' },
          border: { color: '#e5e7eb' },
        },
        y: {
          position: 'left',
          ticks: {
            color: '#9ca3af',
            font: { size: 10 },
            callback: (v: number) =>
              v >= 1_000_000
                ? (v / 1_000_000).toFixed(1) + 'M'
                : v >= 1_000
                  ? (v / 1_000).toFixed(0) + 'k'
                  : v,
          },
          grid: { color: '#f3f4f6' },
          border: { color: '#e5e7eb' },
        },
        y1: {
          position: 'right',
          ticks: { color: '#9ca3af', font: { size: 10 } },
          grid: { drawOnChartArea: false },
          border: { color: '#e5e7eb' },
        },
      },
    };
  }

  buildOrdersChart(data: any[]) {
    const empty = data.length === 0;
    // Le backend retourne { date, label (ex: "01/03"), count }
    const labels = empty
      ? ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
      : data.map((d: any) => d.label ?? d.date ?? '');
    const counts = empty
      ? [0, 0, 0, 0, 0, 0, 0]
      : data.map((d: any) => d.count ?? 0);

    this.ordersChartData = {
      labels,
      datasets: [
        {
          label: 'Commandes',
          data: counts,
          backgroundColor: counts.map((_: any, i: number) =>
            i === counts.length - 1
              ? 'rgba(37,99,235,0.80)'
              : 'rgba(37,99,235,0.15)'
          ),
          borderColor: counts.map((_: any, i: number) =>
            i === counts.length - 1 ? '#2563eb' : 'rgba(37,99,235,0.3)'
          ),
          borderWidth: 1,
          borderRadius: 5,
          borderSkipped: false,
          hoverBackgroundColor: 'rgba(37,99,235,0.55)',
        },
      ],
    };

    this.ordersChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#111827',
          borderColor: '#e5e7eb',
          borderWidth: 1,
          titleColor: '#f9fafb',
          bodyColor: '#9ca3af',
          padding: 10,
          cornerRadius: 8,
        },
      },
      scales: {
        x: {
          ticks: { color: '#9ca3af', font: { size: 10 } },
          grid: { display: false },
          border: { color: '#e5e7eb' },
        },
        y: {
          ticks: { color: '#9ca3af', font: { size: 10 } },
          grid: { color: '#f3f4f6' },
          border: { color: '#e5e7eb' },
        },
      },
    };
  }

  buildShopStatusChart() {
    if (!this.stats) return;
    const { active, pending, suspended, rejected } = this.stats.shops;

    this.shopStatusChartData = {
      labels: ['Actives', 'En attente', 'Suspendues', 'Rejetées'],
      datasets: [
        {
          data: [active, pending, suspended, rejected],
          backgroundColor: [
            'rgba(16,185,129,0.75)',
            'rgba(245,158,11,0.75)',
            'rgba(239,68,68,0.75)',
            'rgba(107,114,128,0.65)',
          ],
          borderColor: ['#10b981', '#f59e0b', '#ef4444', '#6b7280'],
          borderWidth: 1.5,
          hoverOffset: 6,
        },
      ],
    };

    this.shopStatusChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#6b7280',
            font: { size: 11 },
            boxWidth: 8,
            boxHeight: 8,
            padding: 10,
            usePointStyle: true,
            pointStyle: 'circle',
          },
        },
        tooltip: {
          backgroundColor: '#111827',
          borderColor: '#e5e7eb',
          borderWidth: 1,
          titleColor: '#f9fafb',
          bodyColor: '#9ca3af',
          padding: 10,
          cornerRadius: 8,
        },
      },
    };
  }

  formatCurrency(amount: number): string {
    return (
      new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount) + ' Ar'
    );
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('fr-FR').format(num);
  }

  getStatusSeverity(
    status: string
  ):
    | 'success'
    | 'info'
    | 'warn'
    | 'danger'
    | 'secondary'
    | 'contrast' {
    const map: Record<
      string,
      'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'
    > = {
      active: 'success',
      completed: 'success',
      paid: 'success',
      pending: 'warn',
      suspended: 'danger',
      rejected: 'danger',
      processing: 'info',
      shipped: 'info',
    };
    return map[status] ?? 'secondary';
  }

  getActivityIcon(type: string): string {
    const map: Record<string, string> = {
      shop: 'pi-shop',
      user: 'pi-user',
      order: 'pi-shopping-cart',
      product: 'pi-box',
    };
    return 'pi ' + (map[type] ?? 'pi-info-circle');
  }

  getActivityColor(type: string): string {
    const map: Record<string, string> = {
      shop: '#3b82f6',
      user: '#10b981',
      order: '#f59e0b',
      product: '#a78bfa',
    };
    return map[type] ?? '#94a3b8';
  }

  getRelativeTime(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60_000);
    const diffHours = Math.floor(diffMs / 3_600_000);
    const diffDays = Math.floor(diffMs / 86_400_000);

    if (diffMins < 1) return 'Maintenant';
    if (diffMins < 60) return `${diffMins}min`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}j`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

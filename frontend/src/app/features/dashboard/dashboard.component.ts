import { Component, OnInit, LOCALE_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr);
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
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
    SkeletonModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr-FR' }
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  user: any;
  stats: GlobalStats | null = null;
  activities: Activity[] = [];
  loading = true;
  activitiesLoading = true;
  currentDate = new Date();

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

    this.adminService.getGlobalStats().subscribe({
      next: (response) => {
        if (response.success) {
          this.stats = response.data;
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });

    this.adminService.getRecentActivities(10).subscribe({
      next: (response) => {
        if (response.success) {
          this.activities = response.data.activities;
        }
        this.activitiesLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des activités:', error);
        this.activitiesLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount) + ' Ar';
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('fr-FR').format(num);
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    const statusMap: { [key: string]: 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' } = {
      'active': 'success',
      'completed': 'success',
      'paid': 'success',
      'pending': 'warn',
      'suspended': 'danger',
      'rejected': 'danger',
      'processing': 'info',
      'shipped': 'info'
    };
    return statusMap[status] || 'secondary';
  }

  getActivityIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      'shop': 'pi-shop',
      'user': 'pi-user',
      'order': 'pi-shopping-cart',
      'product': 'pi-box'
    };
    return 'pi ' + (iconMap[type] || 'pi-info-circle');
  }

  getRelativeTime(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

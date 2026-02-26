import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { NotificationService } from '../../core/services/notification.service';
import { AuthService } from '../../core/services/auth.service';
import { ShopService } from '../../core/services/shop.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-my-shop',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, SkeletonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './my-shop.component.html',
  styleUrl: './my-shop.component.css'
})
export class MyShopComponent implements OnInit {
  shop: any = null;
  loading = false;
  notFound = false;
  isEditing = false;
  isSaving = false;
  editContact = { phone: '', email: '' };
  editHours: Record<string, { open: string; close: string }> = {};

  readonly days: string[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  readonly dayLabels: Record<string, string> = {
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
    sunday: 'Dimanche'
  };

  constructor(
    private authService: AuthService,
    private shopService: ShopService,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    const user = this.authService.getUser();
    if (!user?.id) { this.notFound = true; return; }

    this.loading = true;
    this.shopService.getByUser(user.id).subscribe({
      next: (response: any) => {
        const shops: any[] = Array.isArray(response) ? response : [response];
        this.shop = shops[0] ?? null;
        this.setEditValues();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.notFound = true;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getShopLogoUrl(): string {
    return `${environment.apiUrl}/${this.shop?.logo}`;
  }

  getLocationString(): string {
    const loc = this.shop?.location;
    if (!loc) return '';
    const parts: string[] = [];
    if (loc.floor) parts.push(`Étage ${loc.floor}`);
    if (loc.zone) parts.push(`Zone ${loc.zone}`);
    if (loc.shopNumber) parts.push(`N° ${loc.shopNumber}`);
    return parts.join(' · ');
  }

  isDayOpen(day: string): boolean {
    return !!(this.shop?.hours?.[day]?.open && this.shop?.hours?.[day]?.close);
  }

  startEdit() {
    this.isEditing = true;
    this.setEditValues();
  }

  cancelEdit() {
    this.isEditing = false;
    this.setEditValues();
  }

  saveChanges() {
    if (!this.shop?._id) return;
    this.isSaving = true;
    const payload = {
      name: this.shop?.name,
      description: this.shop?.description,
      logo: this.shop?.logo,
      category: this.shop?.category?._id ?? this.shop?.category,
      location: this.shop?.location,
      status: this.shop?.status,
      isActive: this.shop?.isActive,
      contact: this.editContact,
      hours: this.editHours
    };

    this.shopService.update(this.shop._id, payload).subscribe({
      next: (result) => {
        this.shop = result.shop ?? { ...this.shop, ...payload };
        this.isSaving = false;
        this.isEditing = false;
        this.notificationService.success('Informations mises à jour.', 'Succès');
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isSaving = false;
        this.notificationService.error(error.error?.message || 'Erreur lors de la mise à jour', 'Erreur');
        this.cdr.detectChanges();
      }
    });
  }

  private setEditValues() {
    this.editContact = {
      phone: this.shop?.contact?.phone || '',
      email: this.shop?.contact?.email || ''
    };
    this.editHours = {};
    this.days.forEach((day) => {
      this.editHours[day] = {
        open: this.shop?.hours?.[day]?.open || '',
        close: this.shop?.hours?.[day]?.close || ''
      };
    });
  }
}

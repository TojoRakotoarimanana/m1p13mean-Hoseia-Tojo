import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../core/services/auth.service';
import { ShopService } from '../../core/services/shop.service';

@Component({
  selector: 'app-my-shop',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, TagModule, ButtonModule, InputTextModule, ToastModule],
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
  readonly days: string[] = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
  ];

  constructor(
    private authService: AuthService,
    private shopService: ShopService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    const user = this.authService.getUser();
    if (!user?.id) {
      this.notFound = true;
      return;
    }

    this.loading = true;
    this.shopService.getByUser(user.id).subscribe({
      next: (shop) => {
        this.shop = shop;
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
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Informations mises à jour.' });
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isSaving = false;
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.error?.message || 'Erreur lors de la mise à jour' });
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

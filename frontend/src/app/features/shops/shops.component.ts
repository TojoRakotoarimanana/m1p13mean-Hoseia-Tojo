import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { PaginatorModule } from 'primeng/paginator';

import { ShopService } from '../../core/services/shop.service';
import { UserService } from '../../core/services/user.service';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-shops',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    ToastModule,
    TagModule,
    PaginatorModule
  ],
  providers: [MessageService],
  templateUrl: './shops.component.html',
  styleUrl: './shops.component.css'
})
export class ShopsComponent implements OnInit {
  shops: any[] = [];
  total = 0;
  page = 1;
  limit = 10;
  loading = false;

  filters = {
    category: '',
    status: '',
    floor: '',
    zone: '',
    shopNumber: ''
  };

  shopDialog = false;
  isEdit = false;
  shopForm: any = this.getEmptyShop();

  users: any[] = [];
  categories: any[] = [];

  statusOptions = [
    { label: 'En attente', value: 'pending' },
    { label: 'Active', value: 'active' },
    { label: 'Suspendue', value: 'suspended' },
    { label: 'Rejetée', value: 'rejected' }
  ];

  constructor(
    private shopService: ShopService,
    private userService: UserService,
    private categoryService: CategoryService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadShops();
    this.loadUsers();
    this.loadCategories();
  }

  loadUsers() {
    this.userService.list().subscribe({
      next: (users: any[]) => {
        this.users = (users || []).map((user) => ({
          ...user,
          displayName: `${user.firstName || ''} ${user.lastName || ''}`.trim() + ` (${user.email})`
        }));
        this.cdr.detectChanges();
      },
      error: () => {
        this.cdr.detectChanges();
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de charger les utilisateurs' });
      }
    });
  }

  loadCategories() {
    this.categoryService.list('boutique').subscribe({
      next: (categories: any[]) => {
        this.categories = (categories || []).map((category) => ({
          ...category,
          displayName: category.name
        }));
        this.cdr.detectChanges();
      },
      error: () => {
        this.cdr.detectChanges();
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de charger les catégories' });
      }
    });
  }

  loadShops() {
    this.loading = true;
    const params = {
      ...this.filters,
      page: this.page,
      limit: this.limit
    };

    this.shopService.list(params).subscribe({
      next: (response: any) => {
        this.shops = response.items || [];
        this.total = response.total || 0;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.loading = false;
        this.cdr.detectChanges();
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.error?.message || 'Erreur lors du chargement' });
      }
    });
  }

  onFilter() {
    this.page = 1;
    this.loadShops();
  }

  onPageChange(event: any) {
    this.page = event.page + 1;
    this.limit = event.rows;
    this.loadShops();
  }

  openNew() {
    this.isEdit = false;
    this.shopForm = this.getEmptyShop();
    this.shopDialog = true;
  }

  editShop(shop: any) {
    this.isEdit = true;
    this.shopForm = {
      _id: shop._id,
      userId: shop.userId,
      name: shop.name,
      category: shop.category,
      description: shop.description,
      status: shop.status,
      location: { ...shop.location },
      contact: { ...shop.contact }
    };
    this.shopDialog = true;
  }

  saveShop() {
    if (!this.shopForm.name || !this.shopForm.userId || !this.shopForm.category) {
      this.messageService.add({ severity: 'warn', summary: 'Champs requis', detail: 'userId, name, category sont obligatoires.' });
      return;
    }

    const payload = { ...this.shopForm };

    const request = this.isEdit
      ? this.shopService.update(this.shopForm._id, payload)
      : this.shopService.create(payload);

    request.subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: this.isEdit ? 'Boutique mise à jour.' : 'Boutique créée.' });
        this.shopDialog = false;
        this.loadShops();
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.error?.message || 'Erreur lors de la sauvegarde' });
      }
    });
  }

  suspendShop(shop: any) {
    this.shopService.suspend(shop._id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Boutique suspendue.' });
        this.loadShops();
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.error?.message || 'Erreur lors de la suspension' });
      }
    });
  }

  deleteShop(shop: any) {
    if (!confirm('Supprimer cette boutique ?')) return;

    this.shopService.remove(shop._id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Boutique supprimée.' });
        this.loadShops();
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.error?.message || 'Erreur lors de la suppression' });
      }
    });
  }

  getStatusSeverity(status: string) {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warn';
      case 'suspended':
        return 'danger';
      default:
        return 'info';
    }
  }

  private getEmptyShop() {
    return {
      userId: '',
      name: '',
      category: '',
      description: '',
      status: 'pending',
      location: { floor: '', zone: '', shopNumber: '' },
      contact: { phone: '', email: '' }
    };
  }
}

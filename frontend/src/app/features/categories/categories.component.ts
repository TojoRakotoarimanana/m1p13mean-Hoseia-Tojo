import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';

import { PaginatorModule } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';

import { NotificationService } from '../../core/services/notification.service';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ToastModule,
    TagModule,
    AvatarModule,
    PaginatorModule,
    SelectModule,
    TooltipModule
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {
  categories: any[] = [];
  loading = false;

  // Filtres
  searchQuery = '';
  selectedType = '';
  selectedActive = '';

  filterTypeOptions = [
    { label: 'Tous les types', value: '' },
    { label: 'Boutique', value: 'boutique' },
    { label: 'Produit', value: 'produit' }
  ];

  filterActiveOptions = [
    { label: 'Tous les statuts', value: '' },
    { label: 'Active', value: 'true' },
    { label: 'Inactive', value: 'false' }
  ];

  get filteredCategories(): any[] {
    const q = this.searchQuery.trim().toLowerCase();
    return this.categories.filter(c => {
      const matchName = !q || (c.name ?? '').toLowerCase().includes(q);
      const matchType = !this.selectedType || c.type === this.selectedType;
      const matchActive = this.selectedActive === ''
        || String(c.isActive) === this.selectedActive;
      return matchName && matchType && matchActive;
    });
  }

  get hasActiveFilter(): boolean {
    return !!this.searchQuery.trim() || !!this.selectedType || this.selectedActive !== '';
  }

  // Pagination
  first = 0;
  pageSize = 10;

  get pagedCategories(): any[] {
    return this.filteredCategories.slice(this.first, this.first + this.pageSize);
  }

  onFilterChange() {
    this.first = 0;
    this.cdr.detectChanges();
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedType = '';
    this.selectedActive = '';
    this.first = 0;
    this.cdr.detectChanges();
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.pageSize = event.rows;
    this.cdr.detectChanges();
  }

  categoryDialog = false;
  isEdit = false;
  categoryForm: any = this.getEmptyCategory();

  typeOptions = [
    { label: 'Boutique', value: 'boutique' },
    { label: 'Produit', value: 'produit' }
  ];

  constructor(
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.categoryService.list().subscribe({
      next: (categories: any[]) => {
        this.categories = categories || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.loading = false;
        this.cdr.detectChanges();
        this.notificationService.error(error.error?.message || 'Erreur lors du chargement', 'Erreur');
      }
    });
  }

  openNew() {
    this.isEdit = false;
    this.categoryForm = this.getEmptyCategory();
    this.categoryDialog = true;
  }

  editCategory(category: any) {
    this.isEdit = true;
    this.categoryForm = { ...category };
    this.categoryDialog = true;
  }

  saveCategory() {
    if (!this.categoryForm.name || !this.categoryForm.type) {
      this.notificationService.warn('name et type sont obligatoires.', 'Champs requis');
      return;
    }

    const payload = { ...this.categoryForm };

    const request = this.isEdit
      ? this.categoryService.update(this.categoryForm._id, payload)
      : this.categoryService.create(payload);

    request.subscribe({
      next: () => {
        this.notificationService.success(this.isEdit ? 'Catégorie mise à jour.' : 'Catégorie créée.', 'Succès');
        this.categoryDialog = false;
        this.loadCategories();
      },
      error: (error) => {
        this.notificationService.error(error.error?.message || 'Erreur lors de la sauvegarde', 'Erreur');
      }
    });
  }

  deleteCategory(category: any) {
    if (!confirm('Supprimer cette catégorie ?')) return;

    this.categoryService.remove(category._id).subscribe({
      next: () => {
        this.notificationService.success('Catégorie supprimée.', 'Succès');
        this.loadCategories();
      },
      error: (error) => {
        this.notificationService.error(error.error?.message || 'Erreur lors de la suppression', 'Erreur');
      }
    });
  }

  getTypeLabel(type: string) {
    const option = this.typeOptions.find((item) => item.value === type);
    return option ? option.label : type;
  }

  getTypeSeverity(type: string) {
    return type === 'boutique' ? 'success' : 'info';
  }

  private getEmptyCategory() {
    return {
      name: '',
      type: 'boutique',
      description: '',
      icon: '',
      isActive: true
    };
  }
}

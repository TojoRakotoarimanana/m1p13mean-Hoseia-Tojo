import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { PaginatorModule } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

import { NotificationService } from '../../core/services/notification.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    TableModule,
    ButtonModule,
    TagModule,
    AvatarModule,
    PaginatorModule,
    SelectModule,
    ToastModule,
    TooltipModule,
    DialogModule,
    InputTextModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  allUsers: any[] = [];
  filteredUsers: any[] = [];
  loading = false;

  first = 0;
  pageSize = 10;

  selectedRole: string = '';
  selectedStatus: string = '';

  roleFilterOptions = [
    { label: 'Tous', value: '' },
    { label: 'Admin', value: 'admin' },
    { label: 'Boutique', value: 'boutique' },
    { label: 'Client', value: 'client' }
  ];

  statusFilterOptions = [
    { label: 'Tous', value: '' },
    { label: 'Actif', value: 'true' },
    { label: 'Inactif', value: 'false' }
  ];

  userDialog = false;
  isEdit = false;
  userForm: any = {};

  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  get pagedUsers(): any[] {
    return this.filteredUsers.slice(this.first, this.first + this.pageSize);
  }

  loadUsers() {
    this.loading = true;
    this.userService.list().subscribe({
      next: (users: any[]) => {
        this.allUsers = users || [];
        this.applyFilter();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        this.loading = false;
        this.cdr.detectChanges();
        this.notificationService.error(
          error.error?.message || 'Erreur lors du chargement des utilisateurs',
          'Erreur'
        );
      }
    });
  }

  resetFilters() {
    this.selectedRole = '';
    this.selectedStatus = '';
    this.applyFilter();
  }

  applyFilter() {
    this.filteredUsers = this.allUsers.filter(u => {
      const matchRole = !this.selectedRole || u.role === this.selectedRole;
      const matchStatus = this.selectedStatus === ''
        ? true
        : u.isActive === (this.selectedStatus === 'true');
      return matchRole && matchStatus;
    });
    this.first = 0;
    this.cdr.detectChanges();
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.pageSize = event.rows;
    this.cdr.detectChanges();
  }

  editUser(user: any) {
    this.isEdit = true;
    this.userForm = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      isActive: user.isActive
    };
    this.userDialog = true;
  }

  saveUser() {
    const payload = {
      firstName: this.userForm.firstName,
      lastName: this.userForm.lastName,
      phone: this.userForm.phone,
      role: this.userForm.role,
      isActive: this.userForm.isActive
    };

    this.userService.update(this.userForm._id, payload).subscribe({
      next: () => {
        this.notificationService.success('Utilisateur mis à jour.', 'Succès');
        this.userDialog = false;
        this.loadUsers();
      },
      error: (error: any) => {
        this.notificationService.error(
          error.error?.message || 'Erreur lors de la mise à jour',
          'Erreur'
        );
      }
    });
  }

  getRoleSeverity(role: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | null | undefined {
    switch (role) {
      case 'admin':   return 'danger';
      case 'boutique': return 'warn';
      case 'client':  return 'info';
      default:        return 'secondary';
    }
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'boutique':
        return 'Boutique';
      case 'client':
        return 'Client';
      default:
        return role;
    }
  }
}

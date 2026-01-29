import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-register-boutique-requests',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, ButtonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './register-boutique-requests.component.html',
  styleUrl: './register-boutique-requests.component.css'
})
export class RegisterBoutiqueRequestsComponent implements OnInit {
  pendingUsers: any[] = [];
  loading = false;

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadPending();
  }

  loadPending() {
    this.loading = true;
    this.userService.listPendingBoutiques().subscribe({
      next: (users: any[]) => {
        this.pendingUsers = users || [];
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

  approve(user: any) {
    this.userService.approveBoutique(user._id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Utilisateur validé.' });
        this.loadPending();
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.error?.message || 'Erreur lors de la validation' });
      }
    });
  }

  reject(user: any) {
    if (!confirm('Refuser cette demande ?')) return;

    this.userService.rejectBoutique(user._id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Demande refusée.' });
        this.loadPending();
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.error?.message || 'Erreur lors du refus' });
      }
    });
  }
}

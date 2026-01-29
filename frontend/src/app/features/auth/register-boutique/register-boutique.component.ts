import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { StepsModule } from 'primeng/steps';
import { SelectModule } from 'primeng/select';

import { AuthService } from '../../../core/services/auth.service';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-register-boutique',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    FloatLabelModule,
    IconFieldModule,
    InputIconModule,
    ToastModule,
    StepsModule,
    SelectModule
  ],
  providers: [MessageService],
  templateUrl: './register-boutique.component.html',
  styleUrl: './register-boutique.component.css'
})
export class RegisterBoutiqueComponent {
  stepIndex = 0;
  isLoading = false;

  readonly days: Array<keyof RegisterBoutiqueComponent['hoursData']> = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
  ];

  steps = [
    { label: 'Utilisateur' },
    { label: 'Boutique' },
    { label: 'Horaires & Contact' }
  ];

  categories: any[] = [];

  userData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  };

  shopData = {
    name: '',
    category: '',
    description: ''
  };

  contactData = {
    phone: '',
    email: ''
  };

  hoursData = {
    monday: { open: '', close: '' },
    tuesday: { open: '', close: '' },
    wednesday: { open: '', close: '' },
    thursday: { open: '', close: '' },
    friday: { open: '', close: '' },
    saturday: { open: '', close: '' },
    sunday: { open: '', close: '' }
  };

  constructor(
    private authService: AuthService,
    private categoryService: CategoryService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.list('boutique').subscribe({
      next: (categories: any[]) => {
        this.categories = categories || [];
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de charger les catégories' });
      }
    });
  }

  nextStep() {
    if (this.stepIndex === 0 && !this.isUserStepValid()) {
      this.messageService.add({ severity: 'warn', summary: 'Champs requis', detail: 'Veuillez compléter vos informations.' });
      return;
    }

    if (this.stepIndex === 1 && !this.isShopStepValid()) {
      this.messageService.add({ severity: 'warn', summary: 'Champs requis', detail: 'Veuillez compléter les informations boutique.' });
      return;
    }

    this.stepIndex = Math.min(this.stepIndex + 1, this.steps.length - 1);
  }

  previousStep() {
    this.stepIndex = Math.max(this.stepIndex - 1, 0);
  }

  submit() {
    if (!this.isUserStepValid() || !this.isShopStepValid()) {
      this.messageService.add({ severity: 'warn', summary: 'Champs requis', detail: 'Veuillez compléter toutes les informations.' });
      return;
    }

    if (this.userData.password !== this.userData.confirmPassword) {
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Les mots de passe ne correspondent pas.' });
      return;
    }

    this.isLoading = true;

    const payload = {
      firstName: this.userData.firstName,
      lastName: this.userData.lastName,
      email: this.userData.email,
      phone: this.userData.phone,
      password: this.userData.password,
      confirmPassword: this.userData.confirmPassword,
      shop: {
        name: this.shopData.name,
        category: this.shopData.category,
        description: this.shopData.description,
        contact: this.contactData,
        hours: this.hoursData
      }
    };

    this.authService.registerBoutique(payload).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: response.message || 'Demande envoyée.' });
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (error) => {
        this.isLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.error?.message || 'Erreur lors de l\'inscription' });
      }
    });
  }

  private isUserStepValid() {
    return !!this.userData.firstName && !!this.userData.lastName && !!this.userData.email && !!this.userData.password && !!this.userData.confirmPassword;
  }

  private isShopStepValid() {
    return !!this.shopData.name && !!this.shopData.category;
  }
}

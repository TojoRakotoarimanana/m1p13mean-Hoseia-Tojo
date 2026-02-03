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
import { CheckboxModule } from 'primeng/checkbox';

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
    SelectModule,
    CheckboxModule
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

  readonly dayLabels: Record<string, string> = {
    'monday': 'Lundi',
    'tuesday': 'Mardi',
    'wednesday': 'Mercredi',
    'thursday': 'Jeudi',
    'friday': 'Vendredi',
    'saturday': 'Samedi',
    'sunday': 'Dimanche'
  };

  // Generate time options (00:00 to 23:30 in 30-minute intervals)
  timeOptions: Array<{ label: string, value: string }> = [];

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
    monday: { open: '09:00', close: '18:00', closed: false },
    tuesday: { open: '09:00', close: '18:00', closed: false },
    wednesday: { open: '09:00', close: '18:00', closed: false },
    thursday: { open: '09:00', close: '18:00', closed: false },
    friday: { open: '09:00', close: '18:00', closed: false },
    saturday: { open: '09:00', close: '18:00', closed: false },
    sunday: { open: '', close: '', closed: true }
  };

  constructor(
    private authService: AuthService,
    private categoryService: CategoryService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.generateTimeOptions();
    this.loadCategories();
  }

  generateTimeOptions() {
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        this.timeOptions.push({ label: timeStr, value: timeStr });
      }
    }
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

  // Copy Monday hours to all weekdays
  copyToWeekdays() {
    const mondayHours = this.hoursData.monday;
    ['tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].forEach((day) => {
      this.hoursData[day as keyof typeof this.hoursData] = { ...mondayHours };
    });
    this.messageService.add({ severity: 'success', summary: 'Copié', detail: 'Horaires du lundi copiés sur les jours de semaine' });
  }

  // Copy to all days including Sunday
  copyToAllDays() {
    const mondayHours = this.hoursData.monday;
    this.days.forEach((day) => {
      if (day !== 'monday') {
        this.hoursData[day] = { ...mondayHours };
      }
    });
    this.messageService.add({ severity: 'success', summary: 'Copié', detail: 'Horaires du lundi copiés sur tous les jours' });
  }

  // Toggle closed status for a day
  toggleClosed(day: keyof typeof this.hoursData) {
    if (this.hoursData[day].closed) {
      this.hoursData[day].open = '';
      this.hoursData[day].close = '';
    } else {
      this.hoursData[day].open = '09:00';
      this.hoursData[day].close = '18:00';
    }
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

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
import { StepsModule } from 'primeng/steps';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';

import { AuthService } from '../../../core/services/auth.service';
import { CategoryService } from '../../../core/services/category.service';
import { NotificationService } from '../../../core/services/notification.service';

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
    ToastModule,
    FloatLabelModule,
    IconFieldModule,
    InputIconModule,
    StepsModule,
    SelectModule,
    CheckboxModule
  ],
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
    private notificationService: NotificationService
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
        this.notificationService.error('Impossible de charger les catégories', 'Erreur');
      }
    });
  }

  nextStep() {
    if (this.stepIndex === 0 && !this.isUserStepValid()) {
      this.notificationService.warn('Veuillez compléter vos informations', 'Champs requis');
      return;
    }

    if (this.stepIndex === 1 && !this.isShopStepValid()) {
      this.notificationService.warn('Veuillez compléter les informations boutique', 'Champs requis');
      return;
    }

    this.stepIndex = Math.min(this.stepIndex + 1, this.steps.length - 1);
  }

  previousStep() {
    this.stepIndex = Math.max(this.stepIndex - 1, 0);
  }

  copyToWeekdays() {
    const mondayHours = this.hoursData.monday;
    ['tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].forEach((day) => {
      this.hoursData[day as keyof typeof this.hoursData] = { ...mondayHours };
    });
    this.notificationService.success('Horaires du lundi copiés sur les jours de semaine', 'Copié');
  }

  copyToAllDays() {
    const mondayHours = this.hoursData.monday;
    this.days.forEach((day) => {
      if (day !== 'monday') {
        this.hoursData[day] = { ...mondayHours };
      }
    });
    this.notificationService.success('Horaires du lundi copiés sur tous les jours', 'Copié');
  }

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
      this.notificationService.warn('Veuillez compléter toutes les informations', 'Champs requis');
      return;
    }

    if (this.userData.password !== this.userData.confirmPassword) {
      this.notificationService.error('Les mots de passe ne correspondent pas', 'Erreur de validation');
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
        this.notificationService.success(response.message || 'Votre demande a été envoyée avec succès', 'Inscription réussie');
        this.router.navigate(['/login'])
      },
      error: (error) => {
        this.isLoading = false;
        this.notificationService.error(error.error?.message || 'Erreur lors de l\'inscription', 'Erreur');
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

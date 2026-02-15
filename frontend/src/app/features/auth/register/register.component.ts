import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
    selector: 'app-register',
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
        ToastModule
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {
    registerData = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    };

    isLoading = false;

    constructor(
        private authService: AuthService,
        private router: Router,
        private notificationService: NotificationService
    ) {}

    onSubmit() {
        if (this.registerData.password !== this.registerData.confirmPassword) {
            this.notificationService.error('Les mots de passe ne correspondent pas', 'Erreur de validation');
            return;
        }

        this.isLoading = true;
        this.authService.register(this.registerData).subscribe({
            next: (response) => {
                this.isLoading = false;
                this.notificationService.success('Inscription réussie, redirection en cours...', 'Bienvenue');
                    this.router.navigate(['/']);
            },
            error: (error) => {
                this.isLoading = false;
                this.notificationService.error(error.error?.message || 'Une erreur est survenue', 'Erreur d\'inscription');
            }
        });
    }
}

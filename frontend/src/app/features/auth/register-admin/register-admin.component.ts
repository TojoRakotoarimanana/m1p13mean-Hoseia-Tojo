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
    selector: 'app-register-admin',
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
    templateUrl: './register-admin.component.html',
    styleUrl: './register-admin.component.css'
})
export class RegisterAdminComponent {
    registerData = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'admin' // Force role to admin
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
        // Ideally this should use a specific registerAdmin endpoint or handle role check in backend
        // For now using standard register but with 'admin' role
        this.authService.register(this.registerData).subscribe({
            next: (response) => {
                this.isLoading = false;
                this.notificationService.success('Compte administrateur créé avec succès', 'Redirection...');
                setTimeout(() => {
                    this.router.navigate(['/login-admin']);
                }, 1500);
            },
            error: (error) => {
                this.isLoading = false;
                this.notificationService.error(error.error?.message || 'Une erreur est survenue', 'Erreur d\'inscription');
            }
        });
    }
}

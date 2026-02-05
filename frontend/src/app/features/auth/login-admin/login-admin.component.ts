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
    selector: 'app-login-admin',
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
    templateUrl: './login-admin.component.html',
    styleUrl: './login-admin.component.css'
})
export class LoginAdminComponent {
    loginData = {
        email: '',
        password: ''
    };
    
    isLoading = false;

    constructor(
        private authService: AuthService, 
        private router: Router,
        private notificationService: NotificationService
    ) {}

    onSubmit() {
        if (this.loginData.email && this.loginData.password) {
            this.isLoading = true;
            this.authService.login(this.loginData).subscribe({
                next: (response) => {
                    this.isLoading = false;
                    if (response.user.role === 'admin') {
                        this.notificationService.success('Connexion administrateur réussie', 'Bienvenue Admin');
                        setTimeout(() => {
                            this.router.navigate(['/dashboard']);
                        }, 1000);
                    } else {
                        this.notificationService.error('Email ou mot de passe incorrect.', 'Erreur de connexion');
                        this.authService.logout();
                    }
                },
                error: (error) => {
                    this.isLoading = false;
                    this.notificationService.error(error.error?.message || 'Une erreur est survenue', 'Erreur');
                }
            });
        }
    }
}

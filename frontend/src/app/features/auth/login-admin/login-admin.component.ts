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
import { AuthService } from '../../../core/services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

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
    providers: [MessageService],
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
        private messageService: MessageService
    ) {}

    onSubmit() {
        if (this.loginData.email && this.loginData.password) {
            this.isLoading = true;
            this.authService.login(this.loginData).subscribe({
                next: (response) => {
                    this.isLoading = false;
                    if (response.user.role === 'admin') {
                        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Connexion administrateur réussie' });
                        setTimeout(() => {
                            this.router.navigate(['/admin/shop-requests']);
                        }, 1000);
                    } else {
                        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Email ou mot de passe incorrect.' });
                        this.authService.logout();
                    }
                },
                error: (error) => {
                    this.isLoading = false;
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.error?.message || 'Une erreur est survenue' });
                }
            });
        }
    }
}

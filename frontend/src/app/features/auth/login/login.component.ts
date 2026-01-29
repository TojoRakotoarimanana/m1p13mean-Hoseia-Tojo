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
    selector: 'app-login',
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
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
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
        this.isLoading = true;
        this.authService.login(this.loginData).subscribe({
            next: (response) => {
                this.isLoading = false;
                if (response.user.role === 'client') {
                    this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Connexion réussie' });
                    this.router.navigate(['/shops']);
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Email ou mot de passe incorrect.' });
                    this.authService.logout();
                }
            },
            error: (error) => {
                this.isLoading = false;
                this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.error?.message || 'Erreur lors de la connexion' });
            }
        });
    }
}

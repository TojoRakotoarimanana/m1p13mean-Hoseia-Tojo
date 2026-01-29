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
    providers: [MessageService],
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
        private messageService: MessageService
    ) {}

    onSubmit() {
        if (this.registerData.password !== this.registerData.confirmPassword) {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Les mots de passe ne correspondent pas' });
            return;
        }

        this.isLoading = true;
        // Ideally this should use a specific registerAdmin endpoint or handle role check in backend
        // For now using standard register but with 'admin' role
        this.authService.register(this.registerData).subscribe({
            next: (response) => {
                this.isLoading = false;
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Compte administrateur créé' });
                setTimeout(() => {
                    this.router.navigate(['/login-admin']);
                }, 1000);
            },
            error: (error) => {
                this.isLoading = false;
                this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.error?.message || 'Une erreur est survenue' });
            }
        });
    }
}

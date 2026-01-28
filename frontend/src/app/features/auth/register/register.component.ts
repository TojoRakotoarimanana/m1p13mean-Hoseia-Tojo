import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {
    registerData = {
        name: '',
        email: '',
        password: ''
    };

    onSubmit() {
        console.log('Register attempt:', this.registerData);
        // TODO: Implement actual register logic
    }
}

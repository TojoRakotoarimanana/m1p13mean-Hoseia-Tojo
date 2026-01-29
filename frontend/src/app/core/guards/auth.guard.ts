import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MessageService } from 'primeng/api';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const messageService = inject(MessageService);

  if (authService.isLoggedIn()) {
    return true;
  }

    messageService.add({
      severity: 'warn',
      summary: 'Accès refusé',
      detail: "Vous devez être connecté pour accéder à cette page.",
    });
    router.navigate(['/login']);

  return false;
};

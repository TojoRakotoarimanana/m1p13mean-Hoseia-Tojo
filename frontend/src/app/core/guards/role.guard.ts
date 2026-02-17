import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MessageService } from 'primeng/api';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const messageService = inject(MessageService);

    if (!authService.isLoggedIn()) {
      messageService.add({
        severity: 'warn',
        summary: 'Accès refusé',
        detail: "Vous devez être connecté pour accéder à cette page.",
      });
      router.navigate(['/login']);
      return false;
    }

    const user = authService.getUserFromStorage();
    if (!user || !user.role) {
      messageService.add({
        severity: 'error',
        summary: 'Erreur d\'authentification',
        detail: "Informations utilisateur invalides.",
      });
      authService.logout();
      router.navigate(['/login']);
      return false;
    }

    if (!allowedRoles.includes(user.role)) {
      messageService.add({
        severity: 'warn',
        summary: 'Accès refusé',
        detail: `Vous n'avez pas les permissions nécessaires pour accéder à cette page.`,
      });
      
      // Rediriger vers la page appropriée selon le rôle
      switch (user.role) {
        case 'client':
          router.navigate(['/home']);
          break;
        case 'boutique':
          router.navigate(['/my-shop']);
          break;
        case 'admin':
          router.navigate(['/dashboard']);
          break;
        default:
          router.navigate(['/login']);
      }
      return false;
    }

    return true;
  };
};

// Guards spécifiques pour chaque rôle
export const adminGuard: CanActivateFn = roleGuard(['admin']);
export const boutiqueGuard: CanActivateFn = roleGuard(['boutique']);
export const clientGuard: CanActivateFn = roleGuard(['client']);
export const boutiqueOrAdminGuard: CanActivateFn = roleGuard(['admin', 'boutique']);
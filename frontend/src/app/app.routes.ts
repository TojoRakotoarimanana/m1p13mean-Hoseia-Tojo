import { Routes } from '@angular/router';

import { LoginComponent } from './features/auth/login/login.component';
import { LoginBoutiqueComponent } from './features/auth/login-boutique/login-boutique.component';
import { LoginAdminComponent } from './features/auth/login-admin/login-admin.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { RegisterAdminComponent } from './features/auth/register-admin/register-admin.component';
import { RegisterBoutiqueComponent } from './features/auth/register-boutique/register-boutique.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ShopsComponent } from './features/shops/shops.component';
import { CategoriesComponent } from './features/categories/categories.component';
import { RegisterBoutiqueRequestsComponent } from './features/register-boutique-requests/register-boutique-requests.component';
import { ShopRequestsComponent } from './features/shop-requests/shop-requests.component';
import { MyShopComponent } from './features/my-shop/my-shop.component';
import { MyProductsComponent } from './features/products/my-products/my-products.component';
import { ProductFormComponent } from './features/products/product-form/product-form.component';
import { StockManagementComponent } from './features/products/stock-management/stock-management.component';
import { ProductStatsComponent } from './features/products/product-stats/product-stats.component';
import { HomeClientComponent } from './features/home/home-client.component';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard, clientGuard, boutiqueGuard, boutiqueOrAdminGuard } from './core/guards/role.guard';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';

const redirectIfLoggedIn: any = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isLoggedIn()) {
    const user = authService.getUserFromStorage();
    // Rediriger selon le rôle de l'utilisateur
    if (user && user.role) {
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
    } else {
      router.navigate(['/dashboard']); // Fallback
    }
    return false;
  }
  return true;
};

export const routes: Routes = [
    { path: '', canActivate: [redirectIfLoggedIn], component: LoginComponent },
    
    { path: 'login', canActivate: [redirectIfLoggedIn], component: LoginComponent },
    { path: 'login-boutique', canActivate: [redirectIfLoggedIn], component: LoginBoutiqueComponent },
    { path: 'login-admin', canActivate: [redirectIfLoggedIn], component: LoginAdminComponent },
    { path: 'register', canActivate: [redirectIfLoggedIn], component: RegisterComponent },
    { path: 'register-admin', canActivate: [redirectIfLoggedIn], component: RegisterAdminComponent },
    { path: 'register-boutique', canActivate: [redirectIfLoggedIn], component: RegisterBoutiqueComponent },
    
    // Page d'accueil client
    { path: 'home', component: HomeClientComponent, canActivate: [clientGuard] },
    
    // Dashboard admin uniquement
    { path: 'dashboard', component: DashboardComponent, canActivate: [adminGuard] },
    
    // Routes admin
    { path: 'shops', component: ShopsComponent, canActivate: [adminGuard] },
    { path: 'categories', component: CategoriesComponent, canActivate: [adminGuard] },
    { path: 'admin/register-boutique-requests', component: RegisterBoutiqueRequestsComponent, canActivate: [adminGuard] },
    { path: 'admin/shop-requests', component: ShopRequestsComponent, canActivate: [adminGuard] },
    
    // Routes boutique
    { path: 'my-shop', component: MyShopComponent, canActivate: [boutiqueGuard] },
    { path: 'my-products', component: MyProductsComponent, canActivate: [boutiqueGuard] },
    { path: 'my-products/new', component: ProductFormComponent, canActivate: [boutiqueGuard] },
    { path: 'my-products/:id/edit', component: ProductFormComponent, canActivate: [boutiqueGuard] },
    { path: 'my-products/stock', component: StockManagementComponent, canActivate: [boutiqueGuard] },
    { path: 'my-products/stats', component: ProductStatsComponent, canActivate: [boutiqueGuard] }
];

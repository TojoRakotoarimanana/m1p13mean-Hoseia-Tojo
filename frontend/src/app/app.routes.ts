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
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    // Routes publiques (authentification)
    { path: 'login', component: LoginComponent },
    { path: 'login-boutique', component: LoginBoutiqueComponent },
    { path: 'login-admin', component: LoginAdminComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'register-admin', component: RegisterAdminComponent },
    { path: 'register-boutique', component: RegisterBoutiqueComponent },
    
    // Routes protégées
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: 'shops', component: ShopsComponent, canActivate: [authGuard] },
    { path: 'categories', component: CategoriesComponent, canActivate: [authGuard] },
    { path: 'admin/register-boutique-requests', component: RegisterBoutiqueRequestsComponent, canActivate: [authGuard] },
    { path: 'admin/shop-requests', component: ShopRequestsComponent, canActivate: [authGuard] },
    { path: 'my-shop', component: MyShopComponent, canActivate: [authGuard] },
    { path: 'my-products', component: MyProductsComponent, canActivate: [authGuard] },
    { path: 'my-products/new', component: ProductFormComponent, canActivate: [authGuard] },
    { path: 'my-products/:id/edit', component: ProductFormComponent, canActivate: [authGuard] },
    { path: 'my-products/stock', component: StockManagementComponent, canActivate: [authGuard] },
    { path: 'my-products/stats', component: ProductStatsComponent, canActivate: [authGuard] },
    
    { path: '', redirectTo: 'login', pathMatch: 'full' }
];

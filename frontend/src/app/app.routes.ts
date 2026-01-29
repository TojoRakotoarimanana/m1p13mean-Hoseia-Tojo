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

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'login-boutique', component: LoginBoutiqueComponent },
    { path: 'login-admin', component: LoginAdminComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'register-admin', component: RegisterAdminComponent },
    { path: 'register-boutique', component: RegisterBoutiqueComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'shops', component: ShopsComponent },
    { path: 'categories', component: CategoriesComponent },
    { path: 'admin/register-boutique-requests', component: RegisterBoutiqueRequestsComponent },
    { path: 'admin/shop-requests', component: ShopRequestsComponent },
    { path: 'my-shop', component: MyShopComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' }
];

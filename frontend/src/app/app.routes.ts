import { Routes } from '@angular/router';

import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ShopsComponent } from './features/shops/shops.component';
import { CategoriesComponent } from './features/categories/categories.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'shops', component: ShopsComponent },
    { path: 'categories', component: CategoriesComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' }
];

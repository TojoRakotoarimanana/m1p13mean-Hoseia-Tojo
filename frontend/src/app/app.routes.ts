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
import { MyOrdersComponent } from './features/orders/my-orders/my-orders.component';
import { OrderDetailComponent } from './features/orders/order-detail/order-detail.component';
import { ShopOrdersComponent } from './features/orders/shop-orders/shop-orders.component';
import { HomeClientComponent } from './features/home/home-client.component';
import { ShopsListComponent } from './features/shops/shops-list.component';
import { ShopDetailComponent } from './features/shops/shop-detail.component';
import { ShopDetailsComponent } from './features/catalog/shop-details/shop-details.component';
import { ProductDetailsComponent } from './features/catalog/product-details/product-details.component';
import { ProductsListComponent } from './features/catalog/products-list/products-list.component';

// Cart & Orders (client)
import { CartComponent } from './features/cart/cart.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { OrderConfirmationComponent } from './features/orders/order-confirmation/order-confirmation.component';
import { OrderDetailsComponent } from './features/orders/order-details/order-details.component';
import { OrderHistoryComponent } from './features/orders/order-history/order-history.component';

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

    // Routes client publiques  
    { path: 'shops', component: ShopsListComponent, canActivate: [clientGuard] },
    { path: 'shop/:id', component: ShopDetailsComponent, canActivate: [clientGuard] },
    { path: 'products', component: ProductsListComponent, canActivate: [clientGuard] },
    { path: 'product/:id', component: ProductDetailsComponent, canActivate: [clientGuard] },

    // Cart & Orders routes
    { path: 'cart', component: CartComponent, canActivate: [clientGuard] },
    { path: 'checkout', component: CheckoutComponent, canActivate: [clientGuard] },
    { path: 'orders/my-orders', component: MyOrdersComponent, canActivate: [clientGuard] },
    { path: 'orders/history', component: OrderHistoryComponent, canActivate: [clientGuard] },
    { path: 'orders/confirmation/:id', component: OrderConfirmationComponent, canActivate: [clientGuard] },
    { path: 'orders/:id', component: OrderDetailsComponent, canActivate: [clientGuard] },

    // Dashboard admin uniquement
    { path: 'dashboard', component: DashboardComponent, canActivate: [adminGuard] },

    // Routes admin
    { path: 'admin/shops', component: ShopsComponent, canActivate: [adminGuard] },
    { path: 'categories', component: CategoriesComponent, canActivate: [adminGuard] },
    { path: 'admin/register-boutique-requests', component: RegisterBoutiqueRequestsComponent, canActivate: [adminGuard] },
    { path: 'admin/shop-requests', component: ShopRequestsComponent, canActivate: [adminGuard] },

    // Routes boutique
    { path: 'my-shop', component: MyShopComponent, canActivate: [boutiqueGuard] },
    { path: 'my-products', component: MyProductsComponent, canActivate: [boutiqueGuard] },
    { path: 'my-products/new', component: ProductFormComponent, canActivate: [boutiqueGuard] },
    { path: 'my-products/:id/edit', component: ProductFormComponent, canActivate: [boutiqueGuard] },
    { path: 'my-products/stock', component: StockManagementComponent, canActivate: [boutiqueGuard] },
    { path: 'my-products/stats', component: ProductStatsComponent, canActivate: [boutiqueGuard] },
    { path: 'my-orders', component: ShopOrdersComponent, canActivate: [boutiqueGuard] },
    { path: 'my-orders/:id', component: OrderDetailComponent, canActivate: [boutiqueGuard] }
];

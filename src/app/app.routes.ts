import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { StoreComponent } from './pages/store/store.component';
import { CartComponent } from './pages/cart/cart.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { AdminComponent } from './admin/admin.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { OrderComponent } from './pages/order/order.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { AuthGuard } from './guards/auth.guard';
import { DashboardComponent } from './admin/pages/dashboard/dashboard.component';
import { UsersComponent } from './admin/pages/users/users.component';
import { ProductsComponent } from './admin/pages/products/products.component';
import { OrdersComponent } from './admin/pages/orders/orders.component';
import { AdminGuard } from './guards/admin.guard';
import { ForbiddenComponent } from './pages/forbidden/forbidden.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'store', component: StoreComponent },
    { path: 'cart', component: CartComponent },
    { path: 'order', component: OrderComponent },
    { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    {path:'error',component:ForbiddenComponent},
    {
      path: 'admin',
      children: [
        { 
          path: '',
          component: AdminComponent,
          canActivate: [AuthGuard,AdminGuard],
          children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'users', component: UsersComponent },
            { path: 'products', component: ProductsComponent },
            { path: 'orders', component: OrdersComponent },
            { path: '**', redirectTo: 'dashboard', pathMatch: 'full' } 
          ]
        }
      ]
    },
    { path: 'profile', component: ProfileComponent },
    { path: '**', redirectTo: 'home' } // Redirect any unknown paths to home
  ];
  

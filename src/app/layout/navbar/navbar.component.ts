import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';
import { StorageService } from '../../services/storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit,OnDestroy {
  showDropdown: boolean = false;
  cartItems: any[] = [];
  
  private cartSubscription: Subscription = new Subscription();

  constructor(private cartService: CartService, private storageService: StorageService, private router: Router) { }

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
    this.cartSubscription = this.cartService.getCartUpdated().subscribe(() => {
      this.cartItems = this.cartService.getCartItems();
    });
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
  }
  isLoggedIn(): boolean {
    return this.storageService.isLoggedIn();
  }

  isAdmin(): boolean {
    return this.storageService.isAdmin();
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }
  getTotalCartItemCount(): number {
    let totalCount = 0;
    for (const item of this.cartItems) {
      totalCount += item.quantity;
    }
    return totalCount;
  }

  logout(): void {
    this.storageService.logout();
  }
}

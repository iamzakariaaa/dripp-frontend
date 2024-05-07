import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CartService {
  
  private cartUpdated = new Subject<void>();
  constructor() { }

  addToCart(product: any): void {
    let cartItems: any[] = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const existingItem = cartItems.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      cartItems.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    this.cartUpdated.next();
  }

  getCartItems(): any[] {
    return JSON.parse(localStorage.getItem('cartItems') || '[]');
  }

  clearCart(): void {
    localStorage.removeItem('cartItems');
  }

  updateCartItem(item: any): void {
    let cartItems: any[] = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const index = cartItems.findIndex(cartItem => cartItem.id === item.id);

    if (index !== -1) {
      cartItems[index].quantity = item.quantity;
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
    this.cartUpdated.next();
  }

  getCartUpdated() {
    return this.cartUpdated.asObservable();
  }

  deleteCartItem(item: any): void {
    let cartItems: any[] = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const index = cartItems.findIndex(cartItem => cartItem.id === item.id);

    if (index !== -1) {
      cartItems.splice(index, 1);
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
    this.cartUpdated.next();
  }
  
}

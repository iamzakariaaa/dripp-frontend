import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { StorageService } from './storage.service';
import axios, { AxiosError, AxiosResponse } from 'axios';

@Injectable({
  providedIn: 'root'
})

export class CartService {
  
  private cartUpdated = new Subject<void>();
  private baseUrl = 'http://localhost:8080/api/v1/products';
  constructor(private storageService : StorageService) { }

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
  
  getProductImage(productId: number): Observable<any> {
    const token = this.storageService.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.handleRequest(axios.get(`${this.baseUrl}/${productId}/image`, { headers, responseType: 'arraybuffer' }));
  }
  
  private handleRequest<T>(axiosPromise: Promise<AxiosResponse<T>>): Observable<T> {
    return new Observable<T>(observer => {
      axiosPromise
        .then((response: AxiosResponse<T>) => {
          observer.next(response.data);
          observer.complete();
        })
        .catch((error: AxiosError) => {
          observer.error(`Error: ${error}`);
        });
    })
  }
}

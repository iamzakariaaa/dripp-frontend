import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule,FormsModule,RouterLink],
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  totalPrice: number = 0;
  imageMap: Map<number, string> = new Map<number, string>();
  constructor(private cartService: CartService,private productService: ProductService) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
    this.calculateTotalPrice();
    this.cartItems.forEach(item => {
      this.fetchProductImage(item.id);
    });
    console.log(this.cartItems)
    console.log('Image Map Items:', this.imageMap);
  }

  updateQuantity(item: any): void {
    this.cartService.updateCartItem(item);
    this.calculateTotalPrice();
  }

  deleteItem(item: any): void {
    this.cartService.deleteCartItem(item);
    this.cartItems = this.cartService.getCartItems();
    this.calculateTotalPrice();
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.cartItems = [];
    this.calculateTotalPrice();
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getImageUrl(productId: number): string | undefined {
    return this.imageMap.get(productId);
  }


  fetchProductImage(productId: number): void {
    this.productService.getProductImage(productId).subscribe({
      next: (imageData: any) => {
        const imageUrl = URL.createObjectURL(new Blob([imageData], { type: 'image/png' }));
        this.imageMap.set(productId, imageUrl);
      },
      error: (error: any) => {
        console.error('Error fetching product image:', error);
      }
    });
  }
}


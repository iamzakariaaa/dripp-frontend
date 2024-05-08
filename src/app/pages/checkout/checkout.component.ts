import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { Subscription } from 'rxjs';
import { User } from '../../models/user';
import { StorageService } from '../../services/storage.service';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule,CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  dropdownOpen: boolean = false;
  orderItems: any[] = [];
  shippingPrice: number = 8;
  totalPrice: number = 0;
  checkoutForm: FormGroup;
  checkoutSubscription : Subscription | undefined;
  userSubscription : Subscription | undefined;
  currentUser : User | undefined;

  constructor(
    private cartService: CartService,
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    private storageService : StorageService,
    private userService : UserService
  ) {
    this.checkoutForm = this.formBuilder.group({
      address: [''],
      phoneNumber: ['']
    });
  }

  ngOnInit(): void {
    this.orderItems = this.cartService.getCartItems();
    console.log(this.orderItems)
    this.calculateTotalPrice(); 
    this.fetchUserByEmail();
    
  }
  fetchUserByEmail(): void {
    const userEmail = this.storageService.getUser()?.sub;
    if (userEmail) {
      this.userSubscription = this.userService.getUserByEmail(userEmail).subscribe({
        next: user => {
          this.currentUser = user;
          console.log(typeof(user));
          console.log('fetching user:', this.currentUser , "with email:" , userEmail);
        },
        error: error => {
          console.error('Error fetching user:', error);
        }
      });
    } else {
      console.log("Something is wrong");
    }
  }
  calculateTotalPrice(): void {
    this.totalPrice = this.orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  submitOrder(): void {
    if (this.checkoutForm.valid && this.orderItems.length > 0) {
      const address = this.checkoutForm.get('address')?.value;
      const phoneNumber = this.checkoutForm.get('phoneNumber')?.value;

      const order: any = {
        id: 0,
        address: address,
        phoneNumber: phoneNumber,
        createdAt: new Date(),
        totalAmount: this.totalPrice,
        status: 'PENDING',
        customer: this.currentUser, 
        items: this.orderItems.map(item => ({
          id: item.id,
          product: item.product,
          quantity: item.quantity,
          amount: item.price * item.quantity,
          order: null 
        }))
      };

      this.checkoutSubscription = this.orderService.addOrder(order).subscribe({
        next: response => {
          console.log('Order placed successfully:', response);
          this.cartService.clearCart();
        },
        error: error => {
          console.error('Error placing order:', error);
        }
    })
    } else {
      console.log("mafaka fill da form")
    }
  }
}
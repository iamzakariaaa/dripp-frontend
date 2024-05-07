import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order } from '../../../models/order';
import { OrderService } from '../../../services/order.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;
  orders: Order[] = [
    {
      id: 1,
      createdAt: new Date("2024-05-01T08:00:00"),
      shippingAddress: "123 Main St, Anytown, USA",
      phoneNumber: "555-1234",
      status: "Pending",
      totalAmount: 100,
      customer: { id: 1, name: "John Doe" },
      items: [
        {
          id: 1,
          productId: 101,
          orderId: 1,
          productName: "Product A",
          quantity: 2,
          amount: 50,
        },
        {
          id: 2,
          productId: 102,
          orderId: 1,
          productName: "Product B",
          quantity: 1,
          amount: 50,
        },
      ],
    },
    {
      id: 2,
      createdAt: new Date("2024-05-02T09:00:00"),
      shippingAddress: "456 Elm St, Othertown, USA",
      phoneNumber: "555-5678",
      status: "Shipped",
      totalAmount: 75,
      customer: { id: 2, name: "Jane Smith" },
      items: [
        {
          id: 3,
          productId: 103,
          orderId: 2,
          productName: "Product C",
          quantity: 3,
          amount: 25,
        },
      ],
    },
  ];
  selectedOrder: Order | null = null; 
  showReceipt(order: Order) {
    this.selectedOrder = order;
  }
  constructor(private orderService: OrderService) {}

  /* ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getAllOrders().subscribe(orders => {
      this.orders = orders;
      this.totalPages = Math.ceil(this.orders.length / this.itemsPerPage);
    });
  } */

  getPaginatedOrders(): Order[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.orders.slice(startIndex, endIndex);
  }
  // Function to go to the next page
  nextPage() {
    const totalPages = Math.ceil(this.orders.length / this.itemsPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
    }
  }

  // Function to go to the previous page
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Function to jump to a specific page
  goToPage(pageNumber: number) {
    const totalPages = Math.ceil(this.orders.length / this.itemsPerPage);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      this.currentPage = pageNumber;
    }
  }
  getTotalPages(): number {
    return Math.ceil(this.orders.length / this.itemsPerPage);
  }
  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    return Array(totalPages).fill(0).map((x, i) => i + 1);
  }

}

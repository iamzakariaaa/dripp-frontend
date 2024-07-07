import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order } from '../../../models/order';
import { OrderService } from '../../../services/order.service';
import { FormsModule } from '@angular/forms';
import { OrderDTO } from '../../../models/order.dto';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;
  orders: OrderDTO[] = [];
  selectedOrder: OrderDTO | null = null;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: orders => {
        this.orders = orders;
        this.totalPages = Math.ceil(this.orders.length / this.itemsPerPage);
      },
      error: error => {
        console.error('Error fetching orders:', error);
      }
    });
  }

  getPaginatedOrders(): OrderDTO[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.orders.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
    }
  }

  getTotalPages(): number {
    return this.totalPages;
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  showReceipt(order: OrderDTO): void {
    this.selectedOrder = order;
  }
}
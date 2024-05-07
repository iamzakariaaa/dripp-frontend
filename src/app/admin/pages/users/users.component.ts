import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../../models/user';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;
  users: User[] = [
    {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        username: "johndoe",
        email: "john@example.com",
        role: "ADMIN"
    },
    {
        id: 2,
        firstName: "Jane",
        lastName: "Smith",
        username: "janesmith",
        email: "jane@example.com",
        role: "CUSTOMER"
    },
    {
        id: 3,
        firstName: "Alice",
        lastName: "Johnson",
        username: "alicejohnson",
        email: "alice@example.com",
        role: "CUSTOMER"
    },
    {
        id: 4,
        firstName: "Michael",
        lastName: "Brown",
        username: "michaelbrown",
        email: "michael@example.com",
        role: "CUSTOMER"
    },
    {
        id: 5,
        firstName: "Emily",
        lastName: "Davis",
        username: "emilydavis",
        email: "emily@example.com",
        role: "CUSTOMER"
    },
    {
        id: 6,
        firstName: "William",
        lastName: "Martinez",
        username: "williammartinez",
        email: "william@example.com",
        role: "CUSTOMER"
    },
    {
        id: 7,
        firstName: "Olivia",
        lastName: "Wilson",
        username: "oliviawilson",
        email: "olivia@example.com",
        role: "CUSTOMER"
    },
    {
        id: 8,
        firstName: "Ethan",
        lastName: "Anderson",
        username: "ethananderson",
        email: "ethan@example.com",
        role: "CUSTOMER"
    }
];


   // Pagination logic to get the users for the current page
   getPaginatedUsers(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.users.slice(startIndex, endIndex);
  }

  // Function to go to the next page
  nextPage() {
    const totalPages = Math.ceil(this.users.length / this.itemsPerPage);
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
    const totalPages = Math.ceil(this.users.length / this.itemsPerPage);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      this.currentPage = pageNumber;
    }
  }
  getTotalPages(): number {
    return Math.ceil(this.users.length / this.itemsPerPage);
  }
  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    return Array(totalPages).fill(0).map((x, i) => i + 1);
  }

}

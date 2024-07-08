import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../../models/user';
import { Subscription } from 'rxjs';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit{
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;
  userSubscription: Subscription | undefined;
  users: User[] = [];

constructor(private userService: UserService) {}
  
  ngOnInit() {
    this.loadUsers();
  }

loadUsers() {
  this.userSubscription = this.userService.getAllUsers().subscribe({
    next: (users: User[]) => {
      this.users = users;
      console.error('fetched users:', users);
    },
    error: (error) => {
      console.error('Error fetching users:', error);
    }
  });
}

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

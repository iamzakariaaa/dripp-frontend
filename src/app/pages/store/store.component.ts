import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';


@Component({
  selector: 'app-store',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './store.component.html',
  styleUrl: './store.component.css'
})
export class StoreComponent {
  products = [
    { id: 1, name: 'Product 1', price: 30, description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem officia eligendi fuga animi sed non placeat perspiciatis adipisci sit distinctio',category: 'HOODIE', image: 'hoodie.png' },
    { id: 2, name: 'Product 2', price: 55, description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem officia eligendi fuga animi sed non placeat perspiciatis adipisci sit distinctio',category: 'JACKET', image: 'jacket.png' },
    { id: 3, name: 'Product 3', price: 25, description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem officia eligendi fuga animi sed non placeat perspiciatis adipisci sit distinctio',category: 'SHIRT', image: 'shirt.png' },
    { id: 4, name: 'Product 4', price: 48, description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem officia eligendi fuga animi sed non placeat perspiciatis adipisci sit distinctio',category: 'SNEAKER', image: 'sneaker.png' },
    { id: 5, name: 'Product 5', price: 30, description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem officia eligendi fuga animi sed non placeat perspiciatis adipisci sit distinctio',category: 'PANT', image: 'pant.png' },
  ];

  filteredProducts = this.products;
  selectedCategory = 'All';
  searchText = '';

  constructor(private cartService: CartService) {}

  filterProducts() {
    this.filteredProducts = this.products.filter(product => {
      const categoryMatch = this.selectedCategory === 'All' || product.category === this.selectedCategory;
      const searchTextMatch = product.name.toLowerCase().includes(this.searchText.toLowerCase());
      return categoryMatch && searchTextMatch;
    });
  }

  addToCart(product: any): void {
    this.cartService.addToCart(product);
  }
}

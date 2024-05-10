import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product';
import { Subscription } from 'rxjs';
import { ProductService } from '../../services/product.service';


@Component({
  selector: 'app-store',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './store.component.html',
  styleUrl: './store.component.css'
})
export class StoreComponent implements OnInit{
  products: Product[] = [];
  imageMap: Map<number, string> = new Map<number, string>();
  productSubscription: Subscription | undefined;
  filteredProducts : Product[] = [];
  selectedCategory = 'All';
  searchText = '';

  constructor(private cartService: CartService,  private productService: ProductService) {}
  
  ngOnInit() {
    this.loadProducts();
  }
  
  loadProducts() {
    this.productSubscription = this.productService.getAllProducts().subscribe({
      next: (products: Product[]) => {
        this.products = products;
        this.filteredProducts = [...this.products];
        this.products.forEach(product => {
          this.fetchProductImage(product.id);
        });
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      }
    });
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

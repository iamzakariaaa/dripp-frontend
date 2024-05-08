import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit{
  productForm: FormGroup = this.formBuilder.group({});
  selectedFile: File | undefined;
  products: Product[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;
  productImageUrl: string | null = null;
  productSubscription: Subscription | undefined;

  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],
      units: ['', Validators.required],
      image: [null, Validators.required]
    });

    this.loadProducts();
  }

  loadProducts() {
    this.productSubscription = this.productService.getAllProducts().subscribe({
      next: (products: Product[]) => {
        this.products = products;
        this.totalPages = Math.ceil(this.products.length / this.itemsPerPage);
  
        // Fetch image for each product
        this.products.forEach(product => {
          this.fetchProductImage(product.id);
        });
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      }
    });
  }

  
  fetchProductImage(productId: number): void {
    this.productSubscription = this.productService.getProductImage(productId).subscribe({
      next: (imageData: any) => {
        this.productImageUrl = URL.createObjectURL(new Blob([imageData], { type: 'image/png' }));
      },
      error: (error: any) => {
        console.error('Error fetching product image:', error);
      }
    });
  }
  

  addProduct() {
    if (!this.selectedFile) {
      console.error('No file selected.');
      return;
    }
    const productData = this.productForm.value;
    this.productSubscription = this.productService.addProduct(productData, this.selectedFile).subscribe({
      next: (data: Product) => {
        console.log('Product added successfully:', data);
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error adding product:', error);
      }
    });
  }
  
  updateProduct(product: Product) {
    const productData = this.productForm.value;
    const id = product.id; 
    this.productSubscription = this.productService.updateProduct(id, productData).subscribe({
      next: (data: Product) => {
        console.log('Product updated successfully:', data);
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error updating product:', error);
      }
    });
  }
  

  deleteProduct(id: number) {
    this.productSubscription = this.productService.deleteProduct(id).subscribe({
      next: () => {
        console.log('Product deleted successfully');
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error deleting product:', error);
      }
    });
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  

  // Pagination logic to get the products for the current page
  getPaginatedProducts(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.products.slice(startIndex, endIndex);
  }

  // Function to go to the next page
  nextPage() {
    const totalPages = Math.ceil(this.products.length / this.itemsPerPage);
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
    const totalPages = Math.ceil(this.products.length / this.itemsPerPage);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      this.currentPage = pageNumber;
    }
  }
  getTotalPages(): number {
    return Math.ceil(this.products.length / this.itemsPerPage);
  }
  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    return Array(totalPages).fill(0).map((x, i) => i + 1);
  }
}

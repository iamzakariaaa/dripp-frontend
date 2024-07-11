import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  productForm: FormGroup;
  selectedFile: File | undefined;
  products: Product[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;
  imageMap = new Map<number, string>();
  productSubscription: Subscription | undefined;
  isEditMode = false;
  selectedProduct: Product | null = null;

  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder
  ) {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],
      units: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadProducts();
   
  }
 
  ngOnDestroy(): void {
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      if (this.isEditMode && this.selectedProduct) {
        const updatedProduct: Product = {
          ...this.selectedProduct,
          ...formValue
        };
        this.updateProduct(updatedProduct);
      } else {
        this.addProduct();
      }
    }
  }
  
  

  loadProducts(): void {
    this.productSubscription = this.productService.getAllProducts().subscribe({
      next: (products: Product[]) => {
        this.products = products;
        this.totalPages = Math.ceil(this.products.length / this.itemsPerPage);
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

  addProduct(): void {
    if (!this.selectedFile) {
      Swal.fire({
        icon: 'error',
        title: 'No file selected',
        text: 'Please select a file to upload.'
      });
      return;
    }
    const productData = this.productForm.value;
    this.productSubscription = this.productService.addProduct(productData, this.selectedFile).subscribe({
      next: (data: Product) => {
        Swal.fire({
          icon: 'success',
          title: 'Product Added',
          text: 'Product added successfully!'
        });
        console.log('Product added successfully:', data);
        this.loadProducts();
        this.resetForm();
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error Adding Product',
          text: 'There was an error adding the product. Please try again.'
        });
        console.error('Error adding product:', error);
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.productForm.patchValue({ image: file });
  }

  

  updateProduct(product: Product): void {
    const id = product.id;
    console.log('Updating product with data:', product);
  
    this.productSubscription = this.productService.updateProduct(id, product).subscribe({
      next: (updatedProduct: Product) => {
        console.log('Product updated successfully:', updatedProduct);
  
        Swal.fire({
          icon: 'success',
          title: 'Product Updated',
          text: 'Product updated successfully!'
        });
  
        this.loadProducts();
        this.resetForm();
      },
      error: (error) => {
        console.error('Error updating product:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error Updating Product',
          text: 'There was an error updating the product. Please try again.'
        });
      }
    });
  }
  
  
  
  resetForm() {
    this.isEditMode = false;
    this.selectedProduct = null;
    this.productForm.reset();
  }
  
  
  deleteProduct(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productSubscription = this.productService.deleteProduct(id).subscribe({
          next: () => {
            Swal.fire(
              'Deleted!',
              'Product has been deleted.',
              'success'
            );
            console.log('Product deleted successfully');
            this.loadProducts();
          },
          error: (error) => {
            Swal.fire(
              'Error!',
              'There was an error deleting the product. Please try again.',
              'error'
            );
            console.error('Error deleting product:', error);
          }
        });
      }
    });
  }

  editProduct(product: Product) {
    this.isEditMode = true;
    this.selectedProduct = product;
    this.productForm.patchValue({
      name: this.selectedProduct.name,
      description: this.selectedProduct.description,
      price: this.selectedProduct.price,
      category: this.selectedProduct.category,
      units: this.selectedProduct.units,
    })
    console.log('Product being edited:', product);
    
  }



  // Pagination logic to get the products for the current page
  getPaginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.products.slice(startIndex, endIndex);
  }

  // Function to go to the next page
  nextPage(): void {
    const totalPages = Math.ceil(this.products.length / this.itemsPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
    }
  }

  // Function to go to the previous page
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Function to jump to a specific page
  goToPage(pageNumber: number): void {
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

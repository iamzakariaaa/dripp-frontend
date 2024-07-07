import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import axios from 'axios';
import { Product } from '../models/product';
import { StorageService } from './storage.service';
import handleRequest from '../helpers/handleRequest';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:8080/api/v1/products';
  
  constructor(private storageService : StorageService) { }

  
  getAllProducts(): Observable<Product[]> {
    const token = this.storageService.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return handleRequest(axios.get<Product[]>(`${this.baseUrl}`, {headers}));
  }

  getProductById(id: number): Observable<Product> {
    const token = this.storageService.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return handleRequest(axios.get<Product>(`${this.baseUrl}/${id}`, {headers}));
  }

  getProductImage(productId: number): Observable<any> {
    const token = this.storageService.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return handleRequest(axios.get(`${this.baseUrl}/${productId}/image`, { headers, responseType: 'arraybuffer' }));
  }
  
  addProduct(productData: any, file: File): Observable<Product> {
    const token = this.storageService.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', productData.price);
    formData.append('category', productData.category);
    formData.append('units', productData.units);
    
    return handleRequest(axios.post<Product>(`${this.baseUrl}`, formData, {headers}));
  }

  updateProduct(id: number, productData: any): Observable<Product> {
    return handleRequest(axios.put<Product>(`${this.baseUrl}/${id}`, productData));
  }

  deleteProduct(id: number): Observable<void> {
    const token = this.storageService.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return handleRequest(axios.delete<void>(`${this.baseUrl}/${id}`,{headers}));
  }

}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { Product } from '../models/product';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:8080/api/v1/products';
  constructor(private storageService : StorageService) { }

  token = this.storageService.getToken();
  
  getAllProducts(): Observable<Product[]> {
    const headers = { Authorization: `Bearer ${this.token}` };
    return this.handleRequest(axios.get<Product[]>(`${this.baseUrl}`, {headers}));
  }

  getProductById(id: number): Observable<Product> {
    return this.handleRequest(axios.get<Product>(`${this.baseUrl}/${id}`));
  }

  getProductImage(productId: number): Observable<any> {
    const headers = { Authorization: `Bearer ${this.token}` };
    return this.handleRequest(axios.get(`${this.baseUrl}/${productId}/image`, { headers, responseType: 'arraybuffer' }));
  }
  
  addProduct(productData: any, file: File): Observable<Product> {
    const headers = { Authorization: `Bearer ${this.token}` };
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', productData.price);
    formData.append('category', productData.category);
    formData.append('units', productData.units);
    
    return this.handleRequest(axios.post<Product>(`${this.baseUrl}`, formData, {headers}));
  }

  updateProduct(id: number, productData: any): Observable<Product> {
    return this.handleRequest(axios.put<Product>(`${this.baseUrl}/${id}`, productData));
  }

  deleteProduct(id: number): Observable<void> {
    const headers = { Authorization: `Bearer ${this.token}` };
    return this.handleRequest(axios.delete<void>(`${this.baseUrl}/${id}`,{headers}));
  }

  private handleRequest<T>(axiosPromise: Promise<AxiosResponse<T>>): Observable<T> {
    return new Observable<T>(observer => {
      axiosPromise
        .then((response: AxiosResponse<T>) => {
          observer.next(response.data);
          observer.complete();
        })
        .catch((error: AxiosError) => {
          observer.error(`Error: ${error}`);
        });
    })
  }
}

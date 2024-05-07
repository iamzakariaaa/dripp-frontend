import { Injectable } from '@angular/core';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'http://localhost:8080/api/v1/orders';
  private token = "";
  constructor() { }
  
  getAllOrders(): Observable<Order[]> {
    const headers = { Authorization: `Bearer ${this.token}` };
    return this.handleRequest(axios.get<Order[]>(`${this.baseUrl}`, {headers}));
  }

  getOrderById(id: number): Observable<Order> {
    return this.handleRequest(axios.get<Order>(`${this.baseUrl}/${id}`));
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

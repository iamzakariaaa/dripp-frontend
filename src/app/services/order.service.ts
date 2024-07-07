import { Injectable } from '@angular/core';
import axios from 'axios';
import { Observable } from 'rxjs';
import { Order } from '../models/order';
import { StorageService } from './storage.service';
import handleRequest from '../helpers/handleRequest';
import { ItemService } from './item.service';
import { Item } from '../models/item';
import { OrderDTO } from '../models/order.dto';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  
  private baseUrl = 'http://localhost:8080/api/v1/orders';
  constructor(private storageService : StorageService, private itemService: ItemService) { }
  token = this.storageService.getToken();
  
  getAllOrders(): Observable<OrderDTO[]> {
    const headers = { Authorization: `Bearer ${this.token}` };
    return handleRequest(axios.get<OrderDTO[]>(`${this.baseUrl}`, {headers}));
  }

  getOrderById(id: number): Observable<Order> {
    return handleRequest(axios.get<Order>(`${this.baseUrl}/${id}`));
  }

  addOrder(order: Order): Observable<Order> {
    const headers = { Authorization: `Bearer ${this.token}` };
    return handleRequest(axios.post<Order>(`${this.baseUrl}`, order, { headers }));
  }
  assignItemToOrder(orderId: number, orderItem: Item): Observable<Item> {
    orderItem.order = { id: orderId } as Order;  
    return this.itemService.addItem(orderItem);
  }
}

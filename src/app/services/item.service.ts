// src/app/services/item.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import axios from 'axios';
import { StorageService } from './storage.service';
import handleRequest from '../helpers/handleRequest';
import { Item } from '../models/item';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private baseUrl = 'http://localhost:8080/api/v1/items';

  constructor(private storageService: StorageService) { }

  addItem(item: Item): Observable<Item> {
    const token = this.storageService.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return handleRequest(axios.post<Item>(`${this.baseUrl}`, item, { headers }));
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Item {
  _id?: string;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class CrudService {
  private apiUrl = 'https://crudcrud.com/api/YOUR_UNIQUE_ID/items';

  constructor(private http: HttpClient) {}

  // GET - Retrieve all items
  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.apiUrl);
  }

  // POST - Create a new item
  createItem(item: Item): Observable<Item> {
    return this.http.post<Item>(this.apiUrl, item);
  }

  // PUT - Update an item
  updateItem(id: string, item: Item): Observable<Item> {
    return this.http.put<Item>(`${this.apiUrl}/${id}`, item);
  }

  // DELETE - Remove an item
  deleteItem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

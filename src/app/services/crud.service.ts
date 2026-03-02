import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Item {
  _id?: string;
  idPrenda: string;
  tipo_prenda: string;
  talla: string;
  color: string;
  marca: string;
}

@Injectable({
  providedIn: 'root',
})
export class CrudService {
  private apiUrl = 'https://crudcrud.com/api/b1998c367c214e8a8c6ec1a348ee5429/items';

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

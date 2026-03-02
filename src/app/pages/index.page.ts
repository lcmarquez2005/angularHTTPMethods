import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CrudService, Item } from '../services/crud.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  providers: [CrudService],
  template: `
    <div class="container">
      <h1>CRUD Operations with crudcrud.com</h1>
      
      <div class="operations">
        <!-- GET Items -->
        <div class="section">
          <h2>GET - Fetch All Items</h2>
          <button (click)="onGetItems()" class="btn btn-primary">
            Get Items
          </button>
          <div *ngIf="items.length > 0" class="items-list">
            <h3>Items:</h3>
            <div *ngFor="let item of items" class="item">
              <p><strong>ID:</strong> {{ item._id }}</p>
              <p><strong>Name:</strong> {{ item.name }}</p>
              <p><strong>Description:</strong> {{ item.description }}</p>
            </div>
          </div>
        </div>

        <!-- POST Create Item -->
        <div class="section">
          <h2>POST - Create Item</h2>
          <form [formGroup]="createForm">
            <input 
              type="text" 
              formControlName="name" 
              placeholder="Item name"
              class="input-field"
            />
            <input 
              type="text" 
              formControlName="description" 
              placeholder="Description"
              class="input-field"
            />
            <button 
              (click)="onCreateItem()" 
              [disabled]="createForm.invalid"
              class="btn btn-success"
            >
              Create Item
            </button>
          </form>
          <p *ngIf="createdItem" class="success-message">✓ Created: {{ createdItem.name }}</p>
        </div>

        <!-- PUT Update Item -->
        <div class="section">
          <h2>PUT - Update Item</h2>
          <form [formGroup]="updateForm">
            <input 
              type="text" 
              formControlName="id" 
              placeholder="Item ID"
              class="input-field"
            />
            <input 
              type="text" 
              formControlName="name" 
              placeholder="New name"
              class="input-field"
            />
            <input 
              type="text" 
              formControlName="description" 
              placeholder="New description"
              class="input-field"
            />
            <button 
              (click)="onUpdateItem()" 
              [disabled]="updateForm.invalid"
              class="btn btn-warning"
            >
              Update Item
            </button>
          </form>
          <p *ngIf="updatedItem" class="success-message">✓ Updated: {{ updatedItem.name }}</p>
        </div>

        <!-- DELETE Item -->
        <div class="section">
          <h2>DELETE - Remove Item</h2>
          <form [formGroup]="deleteForm">
            <input 
              type="text" 
              formControlName="id" 
              placeholder="Item ID to delete"
              class="input-field"
            />
            <button 
              (click)="onDeleteItem()" 
              [disabled]="deleteForm.invalid"
              class="btn btn-danger"
            >
              Delete Item
            </button>
          </form>
          <p *ngIf="deletedId" class="success-message">✓ Deleted item with ID: {{ deletedId }}</p>
        </div>
      </div>

      <p *ngIf="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
  `,
  styles: `
    .container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    h1 {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 2rem;
    }

    .operations {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
    }

    .section {
      border: 2px solid #e0e0e0;
      padding: 1.5rem;
      border-radius: 8px;
      background: #f9f9f9;
    }

    .section h2 {
      font-size: 1.3rem;
      margin-top: 0;
      margin-bottom: 1rem;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .input-field {
      padding: 0.75rem;
      font-size: 1rem;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    .input-field:focus {
      outline: none;
      border-color: #4CAF50;
      box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
    }

    .btn {
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.3s ease;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-primary {
      background-color: #2196F3;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #0b7dda;
    }

    .btn-success {
      background-color: #4CAF50;
      color: white;
    }

    .btn-success:hover:not(:disabled) {
      background-color: #45a049;
    }

    .btn-warning {
      background-color: #ff9800;
      color: white;
    }

    .btn-warning:hover:not(:disabled) {
      background-color: #e68900;
    }

    .btn-danger {
      background-color: #f44336;
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      background-color: #da190b;
    }

    .items-list {
      margin-top: 1rem;
      background: white;
      padding: 1rem;
      border-radius: 4px;
    }

    .items-list h3 {
      margin-top: 0;
    }

    .item {
      background: #f0f0f0;
      padding: 0.75rem;
      margin-bottom: 0.75rem;
      border-radius: 4px;
      font-size: 0.9rem;
    }

    .item p {
      margin: 0.25rem 0;
    }

    .success-message {
      color: #4CAF50;
      font-weight: bold;
      margin-top: 0.75rem;
    }

    .error-message {
      color: #f44336;
      font-weight: bold;
      text-align: center;
      margin-top: 1rem;
    }
  `,
})
export default class Home implements OnInit {
  items: Item[] = [];
  createdItem: Item | null = null;
  updatedItem: Item | null = null;
  deletedId: string | null = null;
  errorMessage: string = '';

  createForm: FormGroup;
  updateForm: FormGroup;
  deleteForm: FormGroup;

  constructor(private crudService: CrudService, private fb: FormBuilder) {
    this.createForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.updateForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.deleteForm = this.fb.group({
      id: ['', Validators.required],
    });
  }

  ngOnInit() {}

  onGetItems() {
    this.crudService.getItems().subscribe({
      next: (data) => {
        this.items = data;
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = 'Error fetching items: ' + err.message;
      },
    });
  }

  onCreateItem() {
    if (this.createForm.valid) {
      const newItem: Item = this.createForm.value;
      this.crudService.createItem(newItem).subscribe({
        next: (data) => {
          this.createdItem = data;
          this.createForm.reset();
          this.errorMessage = '';
        },
        error: (err) => {
          this.errorMessage = 'Error creating item: ' + err.message;
        },
      });
    }
  }

  onUpdateItem() {
    if (this.updateForm.valid) {
      const id = this.updateForm.get('id')?.value;
      const item: Item = {
        name: this.updateForm.get('name')?.value,
        description: this.updateForm.get('description')?.value,
      };
      this.crudService.updateItem(id, item).subscribe({
        next: (data) => {
          this.updatedItem = data;
          this.updateForm.reset();
          this.errorMessage = '';
        },
        error: (err) => {
          this.errorMessage = 'Error updating item: ' + err.message;
        },
      });
    }
  }

  onDeleteItem() {
    if (this.deleteForm.valid) {
      const id = this.deleteForm.get('id')?.value;
      this.crudService.deleteItem(id).subscribe({
        next: () => {
          this.deletedId = id;
          this.deleteForm.reset();
          this.errorMessage = '';
        },
        error: (err) => {
          this.errorMessage = 'Error deleting item: ' + err.message;
        },
      });
    }
  }
}

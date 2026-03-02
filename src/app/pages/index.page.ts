import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CrudService, Item } from '../services/crud.service';

// Definimos cómo es una Prenda
interface Prenda {
  _id?: string;
  idPrenda: string;
  marca: string;
  tipo: string;
  talla: string;
  color: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div style="padding: 20px; font-family: sans-serif; background-color: #121212; color: white; min-height: 100vh;">
      <h1>Registro de Prendas - CRUD</h1>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
        <!-- CREATE Section -->
        <div style="background: #1e1e1e; padding: 20px; border-radius: 8px;">
          <h3>Crear Nueva Prenda (POST)</h3>
          <form [formGroup]="createForm" style="display: flex; flex-direction: column; gap: 10px;">
            <input 
              formControlName="idPrenda" 
              placeholder="Id de Prenda (Código)"
              style="padding: 8px; border-radius: 4px; border: 1px solid #444; background: #333; color: white;"
            />
            <input 
              formControlName="marca" 
              placeholder="Marca"
              style="padding: 8px; border-radius: 4px; border: 1px solid #444; background: #333; color: white;"
            />
            <input 
              formControlName="tipo_prenda" 
              placeholder="Tipo de prenda"
              style="padding: 8px; border-radius: 4px; border: 1px solid #444; background: #333; color: white;"
            />
            <input 
              formControlName="talla" 
              placeholder="Talla"
              style="padding: 8px; border-radius: 4px; border: 1px solid #444; background: #333; color: white;"
            />
            <input 
              formControlName="color" 
              placeholder="Color"
              style="padding: 8px; border-radius: 4px; border: 1px solid #444; background: #333; color: white;"
            />
            <button 
              (click)="onCreateItem()" 
              [disabled]="createForm.invalid"
              style="padding: 10px; background: #4CAF50; color: white; border: none; cursor: pointer; border-radius: 4px; font-weight: bold;"
            >
              CREAR PRENDA (POST)
            </button>
            <p *ngIf="createdItem" style="color: #4CAF50;">✓ Prenda creada: {{ createdItem.idPrenda }}</p>
          </form>
        </div>

        <!-- UPDATE Section -->
        <div style="background: #1e1e1e; padding: 20px; border-radius: 8px;">
          <h3>Actualizar Prenda (PUT)</h3>
          <form [formGroup]="updateForm" style="display: flex; flex-direction: column; gap: 10px;">
            <input 
              formControlName="id" 
              placeholder="ID de la Prenda a Actualizar (MongoDB ID)"
              style="padding: 8px; border-radius: 4px; border: 1px solid #444; background: #333; color: white;"
            />
            <input 
              formControlName="idPrenda" 
              placeholder="Id de Prenda"
              style="padding: 8px; border-radius: 4px; border: 1px solid #444; background: #333; color: white;"
            />
            <input 
              formControlName="marca" 
              placeholder="Marca"
              style="padding: 8px; border-radius: 4px; border: 1px solid #444; background: #333; color: white;"
            />
            <input 
              formControlName="tipo_prenda" 
              placeholder="Tipo de prenda"
              style="padding: 8px; border-radius: 4px; border: 1px solid #444; background: #333; color: white;"
            />
            <input 
              formControlName="talla" 
              placeholder="Talla"
              style="padding: 8px; border-radius: 4px; border: 1px solid #444; background: #333; color: white;"
            />
            <input 
              formControlName="color" 
              placeholder="Color"
              style="padding: 8px; border-radius: 4px; border: 1px solid #444; background: #333; color: white;"
            />
            <button 
              (click)="onUpdateItem()" 
              [disabled]="updateForm.invalid"
              style="padding: 10px; background: #FF9800; color: white; border: none; cursor: pointer; border-radius: 4px; font-weight: bold;"
            >
              ACTUALIZAR PRENDA (PUT)
            </button>
            <p *ngIf="updatedItem" style="color: #FF9800;">✓ Actualizada: {{ updatedItem.idPrenda }}</p>
          </form>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
        <!-- DELETE Section -->
        <div style="background: #1e1e1e; padding: 20px; border-radius: 8px;">
          <h3>Eliminar Prenda (DELETE)</h3>
          <form [formGroup]="deleteForm" style="display: flex; flex-direction: column; gap: 10px;">
            <input 
              formControlName="id" 
              placeholder="ID de la Prenda a Eliminar (MongoDB ID)"
              style="padding: 8px; border-radius: 4px; border: 1px solid #444; background: #333; color: white;"
            />
            <button 
              (click)="onDeleteItem()" 
              [disabled]="deleteForm.invalid"
              style="padding: 10px; background: #f44336; color: white; border: none; cursor: pointer; border-radius: 4px; font-weight: bold;"
            >
              ELIMINAR PRENDA (DELETE)
            </button>
            <p *ngIf="deletedId" style="color: #f44336;">✓ Prenda eliminada: {{ deletedId }}</p>
          </form>
        </div>

        <!-- GET Items -->
        <div style="background: #1e1e1e; padding: 20px; border-radius: 8px;">
          <h3>Cargar Prendas (GET)</h3>
          <button 
            (click)="onGetItems()"
            style="padding: 10px; background: #2196F3; color: white; border: none; cursor: pointer; border-radius: 4px; font-weight: bold; width: 100%;"
          >
            CARGAR PRENDAS (GET)
          </button>
          <div *ngIf="items.length > 0" style="margin-top: 15px;">
            <h4>{{ items.length }} Prendas Disponibles:</h4>
            <div style="max-height: 400px; overflow-y: auto;">
              <div *ngFor="let item of items" style="background: #2a2a2a; padding: 10px; margin: 5px 0; border-radius: 4px; border-left: 3px solid #2196F3;">
                <p><strong>ID BD:</strong> {{ item._id }}</p>
                <p><strong>ID Prenda:</strong> {{ item.idPrenda }}</p>
                <p><strong>Tipo:</strong> {{ item.tipo_prenda }}</p>
                <p><strong>Talla:</strong> {{ item.talla }}</p>
                <p><strong>Color:</strong> {{ item.color }}</p>
                <p><strong>Marca:</strong> {{ item.marca }}</p>
              </div>
            </div>
          </div>
          <div *ngIf="items.length === 0 && !loadingItems">No hay prendas registradas.</div>
        </div>
      </div>

      <div *ngIf="errorMessage" style="background: #f44336; padding: 15px; border-radius: 4px; margin-top: 20px; color: white;">
        {{ errorMessage }}
      </div>
    </div>
  `,
})
export default class IndexPage implements OnInit {
  private crudService = inject(CrudService);
  private fb = inject(FormBuilder);

  // Forms
  createForm: FormGroup;
  updateForm: FormGroup;
  deleteForm: FormGroup;

  // Data
  items: Item[] = [];
  
  // Response states
  createdItem: Item | null = null;
  updatedItem: Item | null = null;
  deletedId: string | null = null;
  errorMessage: string = '';
  loadingItems: boolean = false;

  constructor() {
    this.createForm = this.fb.group({
      idPrenda: ['', Validators.required],
      tipo_prenda: ['', Validators.required],
      talla: ['', Validators.required],
      color: ['', Validators.required],
      marca: ['', Validators.required],
    });

    this.updateForm = this.fb.group({
      id: ['', Validators.required],
      idPrenda: ['', Validators.required],
      tipo_prenda: ['', Validators.required],
      talla: ['', Validators.required],
      color: ['', Validators.required],
      marca: ['', Validators.required],
    });

    this.deleteForm = this.fb.group({
      id: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.onGetItems();
  }

  // GET: Load all items
  onGetItems() {
    this.loadingItems = true;
    this.crudService.getItems().subscribe({
      next: (data) => {
        this.items = data;
        this.errorMessage = '';
        this.loadingItems = false;
      },
      error: (err) => {
        this.errorMessage = 'Error loading items: ' + err.message;
        this.loadingItems = false;
      },
    });
  }

  // POST: Create new item
  onCreateItem() {
    if (this.createForm.valid) {
      const newItem: Item = this.createForm.value;
      this.crudService.createItem(newItem).subscribe({
        next: (data) => {
          this.createdItem = data;
          this.createForm.reset();
          this.errorMessage = '';
          this.onGetItems();
        },
        error: (err) => {
          this.errorMessage = 'Error creating item: ' + err.message;
        },
      });
    }
  }

  // PUT: Update existing item
  onUpdateItem() {
    if (this.updateForm.valid) {
      const id = this.updateForm.get('id')?.value;
      const item: Item = {
        idPrenda: this.updateForm.get('idPrenda')?.value,
        tipo_prenda: this.updateForm.get('tipo_prenda')?.value,
        talla: this.updateForm.get('talla')?.value,
        color: this.updateForm.get('color')?.value,
        marca: this.updateForm.get('marca')?.value,
      };
      this.crudService.updateItem(id, item).subscribe({
        next: (data) => {
          this.updatedItem = data;
          this.updateForm.reset();
          this.errorMessage = '';
          this.onGetItems();
        },
        error: (err) => {
          this.errorMessage = 'Error updating item: ' + err.message;
        },
      });
    }
  }

  // DELETE: Remove item
  onDeleteItem() {
    if (this.deleteForm.valid) {
      const id = this.deleteForm.get('id')?.value;
      this.crudService.deleteItem(id).subscribe({
        next: () => {
          this.deletedId = id;
          this.deleteForm.reset();
          this.errorMessage = '';
          this.onGetItems();
        },
        error: (err) => {
          this.errorMessage = 'Error deleting item: ' + err.message;
        },
      });
    }
  }
}

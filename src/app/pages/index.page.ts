import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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
  imports: [CommonModule, FormsModule],
  template: `
    <div style="padding: 20px; font-family: sans-serif; background-color: #121212; color: white; min-height: 100vh;">
      <h1>Registro de Prendas</h1>

      <div style="background: #1e1e1e; padding: 20px; border-radius: 8px; margin-bottom: 20px; max-width: 400px; display: flex; flex-direction: column; gap: 10px;">
        <h3>Nueva Prenda</h3>
        <input [(ngModel)]="nuevaPrenda.idPrenda" placeholder="Id de Prenda (Código)">
        <input [(ngModel)]="nuevaPrenda.marca" placeholder="Marca">
        <input [(ngModel)]="nuevaPrenda.tipo" placeholder="Tipo de prenda">
        <input [(ngModel)]="nuevaPrenda.talla" placeholder="Talla">
        <input [(ngModel)]="nuevaPrenda.color" placeholder="Color">
        
        <button (click)="crearPrenda()" style="padding: 10px; background: #4CAF50; color: white; border: none; cursor: pointer; border-radius: 4px; font-weight: bold;">
          CREAR PRENDA (POST)
        </button>
      </div>

      <hr>

      <div style="margin-top: 20px;">
        <h3>Inventario en API</h3>
        <div *ngIf="prendas.length === 0">No hay prendas registradas.</div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px;">
          <div *ngFor="let p of prendas" style="background: #2a2a2a; padding: 15px; border-radius: 5px; border-left: 4px solid #4CAF50;">
            <p><strong>ID:</strong> {{ p.idPrenda }}</p>
            <p><strong>Marca:</strong> {{ p.marca }}</p>
            <p><strong>Tipo:</strong> {{ p.tipo }}</p>
            <p><strong>Talla:</strong> {{ p.talla }}</p>
            <p><strong>Color:</strong> {{ p.color }}</p>
          </div>
        </div>
      </div>
    </div>

    <style>
      input { padding: 8px; border-radius: 4px; border: 1px solid #444; background: #333; color: white; }
    </style>
  `,
})
export default class IndexPage implements OnInit {
  private http = inject(HttpClient);
  // Reemplaza esta URL si expira el ID de crudcrud
  private apiUrl = 'https://crudcrud.com/api/fa2b0ab0fca04a578690571af5e8d0ab/prendas';

  prendas: Prenda[] = [];
  
  // Objeto inicializador para los campos
  nuevaPrenda: Prenda = {
    idPrenda: '',
    marca: '',
    tipo: '',
    talla: '',
    color: ''
  };

  ngOnInit() {
    this.obtenerPrendas();
  }

  // MÉTODO GET: Para leer lo que hay en la API
  obtenerPrendas() {
    this.http.get<Prenda[]>(this.apiUrl).subscribe(res => {
      this.prendas = res;
    });
  }

  // MÉTODO POST: Para enviar los datos
  crearPrenda() {
    // Validación simple: no enviar si los campos están vacíos
    if (!this.nuevaPrenda.idPrenda || !this.nuevaPrenda.marca) {
      alert('Por favor rellena al menos el ID y la Marca');
      return;
    }

    this.http.post(this.apiUrl, this.nuevaPrenda).subscribe({
      next: () => {
        alert('Prenda guardada con éxito');
        // Limpiamos el formulario
        this.nuevaPrenda = { idPrenda: '', marca: '', tipo: '', talla: '', color: '' };
        // Actualizamos la lista para ver el nuevo registro
        this.obtenerPrendas();
      },
      error: (err) => console.error('Error al guardar:', err)
    });
  }
}
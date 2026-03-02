import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <h1>Hello World App</h1>
      
      <input 
        type="text" 
        [formControl]="nameInput" 
        placeholder="Enter your name"
        class="input-field"
      />
      
      <div *ngIf="nameInput.value" class="greeting">
        Hello, {{ nameInput.value }}!
      </div>
      <div *ngIf="!nameInput.value" class="greeting placeholder">
        Hello, World!
      </div>
    </div>
  `,
  styles: `
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      gap: 2rem;
      padding: 2rem;
    }

    h1 {
      font-size: 2rem;
      margin: 0;
    }

    .input-field {
      padding: 0.75rem 1rem;
      font-size: 1rem;
      border: 2px solid #333;
      border-radius: 4px;
      width: 300px;
      max-width: 100%;
    }

    .greeting {
      font-size: 1.5rem;
      font-weight: bold;
      min-height: 2rem;
    }

    .greeting.placeholder {
      color: #888;
    }

    @media (prefers-color-scheme: light) {
      .input-field {
        border-color: #ccc;
        color: #333;
      }
    }
  `,
})
export default class Home {
  nameInput = new FormControl('');
}

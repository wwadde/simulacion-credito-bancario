import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  template: `
    <div class="not-found-container">
      <div class="not-found-content">
        <mat-icon class="error-icon">error_outline</mat-icon>
        <h1>404</h1>
        <h2>Página no encontrada</h2>
        <p>La página que buscas no existe o ha sido movida.</p>
        <button mat-raised-button color="primary" routerLink="/dashboard">
          <mat-icon>home</mat-icon>
          Volver al inicio
        </button>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .not-found-content {
      text-align: center;
      color: white;
      max-width: 400px;
      padding: 40px;
    }

    .error-icon {
      font-size: 80px;
      margin-bottom: 20px;
      opacity: 0.8;
    }

    h1 {
      font-size: 72px;
      font-weight: 300;
      margin: 0;
      opacity: 0.9;
    }

    h2 {
      font-size: 24px;
      font-weight: 400;
      margin: 10px 0;
    }

    p {
      font-size: 16px;
      opacity: 0.8;
      margin-bottom: 30px;
      line-height: 1.5;
    }

    button {
      font-size: 16px;
      padding: 12px 24px;
    }
  `]
})
export class NotFoundComponent {}

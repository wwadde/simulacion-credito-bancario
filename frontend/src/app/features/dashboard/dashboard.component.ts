import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  styleUrls: ['./dashboard.component.css'],
  template: `
    <div class="dashboard-container">
      <h1 class="page-title">
        Dashboard del Sistema de Crédito
      </h1>
      
      <div class="stats-section">
        <div class="stats-grid">
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-icon-container bg-blue">
                <mat-icon class="stat-icon">people</mat-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">125</div>
                <div class="stat-label">Total Personas</div>
              </div>
            </mat-card-content>
          </mat-card>
          
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-icon-container bg-green">
                <mat-icon class="stat-icon">account_balance</mat-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">89</div>
                <div class="stat-label">Cuentas Activas</div>
              </div>
            </mat-card-content>
          </mat-card>
          
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-icon-container bg-purple">
                <mat-icon class="stat-icon">credit_card</mat-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">34</div>
                <div class="stat-label">Créditos Otorgados</div>
              </div>
            </mat-card-content>
          </mat-card>
          
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-icon-container bg-orange">
                <mat-icon class="stat-icon">attach_money</mat-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">$2,500,000</div>
                <div class="stat-label">Monto Total</div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
      
      <div class="quick-actions-section">
        <h2 class="section-title">Acciones Rápidas</h2>
        <div class="actions-grid">
          <mat-card class="action-card" (click)="navigateTo('/personas')">
            <mat-card-content>
              <mat-icon class="action-icon">person_add</mat-icon>
              <h3>Gestionar Personas</h3>
              <p>Agregar, editar o consultar información de personas</p>
            </mat-card-content>
          </mat-card>
          
          <mat-card class="action-card" (click)="navigateTo('/cuentas')">
            <mat-card-content>
              <mat-icon class="action-icon">account_balance_wallet</mat-icon>
              <h3>Administrar Cuentas</h3>
              <p>Crear y gestionar cuentas bancarias</p>
            </mat-card-content>
          </mat-card>
          
          <mat-card class="action-card" (click)="navigateTo('/creditos')">
            <mat-card-content>
              <mat-icon class="action-icon">request_quote</mat-icon>
              <h3>Procesar Créditos</h3>
              <p>Solicitar y administrar créditos</p>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}

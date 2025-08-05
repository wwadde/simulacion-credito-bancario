import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { DashboardService, DashboardStats } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  styleUrls: ['./dashboard.component.css'],
  template: `
    <div class="dashboard-container">
      <div class="header-section">
        <h1 class="page-title">Dashboard</h1>
        <button mat-icon-button (click)="refreshData()" [disabled]="loading" class="refresh-button">
          <mat-icon [class.spin]="loading">refresh</mat-icon>
        </button>
      </div>
      
      <div class="stats-section">
        <div class="stats-grid">
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-icon-container bg-blue">
                <mat-icon class="stat-icon">people</mat-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ loading ? '...' : stats.totalPersonas }}</div>
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
                <div class="stat-value">{{ loading ? '...' : stats.cuentasActivas }}</div>
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
                <div class="stat-value">{{ loading ? '...' : stats.creditosOtorgados }}</div>
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
                <div class="stat-value">{{ loading ? '...' : ('$' + stats.montoTotal.toLocaleString()) }}</div>
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
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalPersonas: 0,
    cuentasActivas: 0,
    creditosOtorgados: 0,
    montoTotal: 0
  };
  
  loading = true;

  constructor(
    private router: Router,
    private dashboardService: DashboardService
  ) {}

  ngOnInit() {
    this.loadDashboardStats();
  }

  loadDashboardStats() {
    this.loading = true;
    this.dashboardService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
        this.loading = false;
        // En caso de error, mantener valores por defecto
        this.stats = {
          totalPersonas: 0,
          cuentasActivas: 0,
          creditosOtorgados: 0,
          montoTotal: 0
        };
      }
    });
  }

  refreshData() {
    this.loadDashboardStats();
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}

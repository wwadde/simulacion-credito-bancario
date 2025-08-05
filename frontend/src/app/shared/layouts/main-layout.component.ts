import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule
  ],
  template: `
    <mat-sidenav-container class="layout-container">
      <mat-sidenav #drawer class="sidenav" fixedInViewport="true" mode="side" opened="true">
        <div class="sidenav-header">
          <h2>Gestión Crediticia</h2>
        </div>
        
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active-link">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>
          
          <a mat-list-item routerLink="/personas" routerLinkActive="active-link">
            <mat-icon matListItemIcon>people</mat-icon>
            <span matListItemTitle>Personas</span>
          </a>
          
          <a mat-list-item routerLink="/cuentas" routerLinkActive="active-link">
            <mat-icon matListItemIcon>account_balance</mat-icon>
            <span matListItemTitle>Cuentas</span>
          </a>
          
          <a mat-list-item routerLink="/creditos" routerLinkActive="active-link">
            <mat-icon matListItemIcon>credit_card</mat-icon>
            <span matListItemTitle>Créditos</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>
      
      <mat-sidenav-content>
        <mat-toolbar color="primary" class="main-toolbar">
          <button mat-icon-button (click)="drawer.toggle()" class="menu-button">
            <mat-icon>menu</mat-icon>
          </button>
          
          <span class="app-title">Sistema de Gestión Crediticia</span>
          
          <span class="toolbar-spacer"></span>
          
          <button mat-icon-button [matMenuTriggerFor]="userMenu" class="user-button">
            <mat-icon>person</mat-icon>
          </button>
          
          <mat-menu #userMenu="matMenu">
            <button mat-menu-item (click)="logout()">
              <mat-icon>exit_to_app</mat-icon>
              <span>Cerrar Sesión</span>
            </button>
          </mat-menu>
        </mat-toolbar>
        
        <div class="main-content">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .layout-container {
      height: 100vh;
      display: flex;
    }

    .sidenav {
      width: 260px;
      background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
      border-right: none;
      box-shadow: 2px 0 5px rgba(0,0,0,0.1);
    }

    .sidenav-header {
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 16px;
      background: rgba(255, 255, 255, 0.1);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }

    .sidenav-header h2 {
      color: white;
      font-size: 18px;
      font-weight: 600;
      margin: 0;
      text-align: center;
    }

    .main-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      height: 64px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .app-title {
      font-size: 18px;
      font-weight: 500;
      margin-left: 16px;
    }

    .menu-button {
      display: none;
    }

    .user-button {
      margin-right: 8px;
    }

    .toolbar-spacer {
      flex: 1 1 auto;
    }

    .main-content {
      padding: 24px;
      min-height: calc(100vh - 64px);
      background-color: #f8f9fa;
      overflow-y: auto;
    }

    /* Estilos para los elementos de navegación */
    mat-nav-list {
      padding-top: 16px;
    }

    mat-nav-list a {
      margin: 6px 12px;
      border-radius: 12px;
      transition: all 0.3s ease;
      color: rgba(255, 255, 255, 0.8);
      font-weight: 500;
    }

    mat-nav-list a:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: white;
      transform: translateX(4px);
    }

    .active-link {
      background-color: rgba(255, 255, 255, 0.15) !important;
      color: white !important;
      font-weight: 600;
    }

    .active-link mat-icon {
      color: white !important;
    }

    mat-nav-list a mat-icon {
      color: rgba(255, 255, 255, 0.8);
      margin-right: 12px;
    }

    mat-nav-list a:hover mat-icon {
      color: white;
    }

    /* Estilos para el menú del usuario */
    .mat-mdc-menu-panel {
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .sidenav {
        width: 100%;
      }
      
      .menu-button {
        display: block;
      }

      .app-title {
        display: none;
      }

      .main-content {
        padding: 16px;
      }
    }

    @media (max-width: 480px) {
      .main-content {
        padding: 12px;
      }
    }
  `]
})
export class MainLayoutComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        // Even if logout fails on server, clear local session
        this.router.navigate(['/auth/login']);
      }
    });
  }
}

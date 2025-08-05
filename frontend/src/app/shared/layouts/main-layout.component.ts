import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

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
    MatMenuModule,
    MatTooltipModule
  ],
  template: `
    <mat-sidenav-container class="layout-container">
      <mat-sidenav #drawer class="sidenav" 
                   [fixedInViewport]="true" 
                   [mode]="isHandset ? 'over' : 'side'" 
                   [opened]="!isHandset">
        <div class="sidenav-header">
          <h2>Gestión Crediticia</h2>
        </div>
        
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active-link" (click)="closeDrawerIfHandset(drawer)">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>
          
          <a mat-list-item routerLink="/personas" routerLinkActive="active-link" (click)="closeDrawerIfHandset(drawer)">
            <mat-icon matListItemIcon>people</mat-icon>
            <span matListItemTitle>Personas</span>
          </a>
          
          <a mat-list-item routerLink="/cuentas" routerLinkActive="active-link" (click)="closeDrawerIfHandset(drawer)">
            <mat-icon matListItemIcon>account_balance</mat-icon>
            <span matListItemTitle>Cuentas</span>
          </a>
          
          <a mat-list-item routerLink="/creditos" routerLinkActive="active-link" (click)="closeDrawerIfHandset(drawer)">
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
          
          <button 
            mat-icon-button 
            (click)="toggleTheme()" 
            [matTooltip]="(isDarkTheme$ | async) ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'"
            class="theme-button">
            <mat-icon>{{ (isDarkTheme$ | async) ? 'light_mode' : 'dark_mode' }}</mat-icon>
          </button>
          
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
      width: 100% !important;
      max-width: none !important;
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

    .theme-button,
    .user-button {
      margin-left: 8px;
      color: white;
      transition: all 0.3s ease;
    }

    .theme-button:hover,
    .user-button:hover {
      background-color: rgba(255, 255, 255, 0.1);
      transform: scale(1.1);
    }

    .main-content {
      padding: 0;
      min-height: calc(100vh - 64px);
      background-color: var(--background-color);
      color: var(--text-primary);
      overflow-y: auto;
      transition: background-color 0.3s ease, color 0.3s ease;
      width: 100% !important;
      max-width: none !important;
      flex: 1;
      box-sizing: border-box;
    }

    /* Forzar que el sidenav-content use todo el ancho */
    mat-sidenav-content {
      width: 100% !important;
      max-width: none !important;
      flex: 1 !important;
    }

    /* Forzar que el router-outlet use todo el ancho */
    router-outlet + * {
      width: 100% !important;
      max-width: none !important;
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
      .layout-container {
        flex-direction: column;
      }

      .sidenav {
        width: 100vw;
        height: 100vh;
      }
      
      .menu-button {
        display: block;
      }

      .app-title {
        font-size: 16px;
      }

      .main-content {
        padding: 0;
        width: 100%;
        margin-left: 0 !important;
      }
    }

    @media (max-width: 480px) {
      .app-title {
        display: none;
      }

      .theme-button,
      .user-button {
        margin-left: 4px;
      }

      .sidenav-header h2 {
        font-size: 16px;
      }
    }
  `]
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  isDarkTheme$: Observable<boolean>;
  isHandset: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.isDarkTheme$ = this.themeService.isDarkTheme$;
  }

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.isHandset = result.matches;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  closeDrawerIfHandset(drawer: any): void {
    if (this.isHandset) {
      drawer.close();
    }
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

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

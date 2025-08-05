import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div style="padding: 20px; width: 100%; font-family: 'Roboto', sans-serif; background-color: #f8f9fa; min-height: 100%;">
      <h1 style="color: #1a202c; text-align: center; margin-bottom: 32px; font-weight: 300; font-size: 2.5rem;">
        Dashboard del Sistema de Crédito
      </h1>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 40px;">
        <mat-card style="transition: transform 0.2s ease, box-shadow 0.2s ease;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 20px rgba(0,0,0,0.12)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='initial'">
          <mat-card-content style="text-align: center; padding: 24px;">
            <mat-icon style="font-size: 48px; color: #667eea; margin-bottom: 16px;">people</mat-icon>
            <h3 style="color: #2d3748; margin: 0 0 8px 0; font-weight: 500;">Total Personas</h3>
            <div style="font-size: 28px; font-weight: 600; color: #1a202c;">125</div>
          </mat-card-content>
        </mat-card>
        
        <mat-card style="transition: transform 0.2s ease, box-shadow 0.2s ease;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 20px rgba(0,0,0,0.12)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='initial'">
          <mat-card-content style="text-align: center; padding: 24px;">
            <mat-icon style="font-size: 48px; color: #4facfe; margin-bottom: 16px;">account_balance</mat-icon>
            <h3 style="color: #2d3748; margin: 0 0 8px 0; font-weight: 500;">Cuentas Activas</h3>
            <div style="font-size: 28px; font-weight: 600; color: #1a202c;">89</div>
          </mat-card-content>
        </mat-card>
        
        <mat-card style="transition: transform 0.2s ease, box-shadow 0.2s ease;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 20px rgba(0,0,0,0.12)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='initial'">
          <mat-card-content style="text-align: center; padding: 24px;">
            <mat-icon style="font-size: 48px; color: #a8edea; margin-bottom: 16px;">credit_card</mat-icon>
            <h3 style="color: #2d3748; margin: 0 0 8px 0; font-weight: 500;">Créditos Otorgados</h3>
            <div style="font-size: 28px; font-weight: 600; color: #1a202c;">34</div>
          </mat-card-content>
        </mat-card>
        
        <mat-card style="transition: transform 0.2s ease, box-shadow 0.2s ease;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 20px rgba(0,0,0,0.12)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='initial'">
          <mat-card-content style="text-align: center; padding: 24px;">
            <mat-icon style="font-size: 48px; color: #ff9a9e; margin-bottom: 16px;">attach_money</mat-icon>
            <h3 style="color: #2d3748; margin: 0 0 8px 0; font-weight: 500;">Monto Total</h3>
            <div style="font-size: 28px; font-weight: 600; color: #1a202c;">$2,500,000</div>
          </mat-card-content>
        </mat-card>
      </div>
      
      <div style="margin-top: 40px;">
        <h2 style="color: #2d3748; margin-bottom: 20px; font-weight: 500; font-size: 1.5rem;">Acciones Rápidas</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
          <mat-card style="cursor: pointer; transition: transform 0.3s ease, box-shadow 0.3s ease;" (click)="navigateTo('/personas')" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='initial'">
            <mat-card-content style="text-align: center; padding: 24px;">
              <mat-icon style="font-size: 48px; color: #673ab7; margin-bottom: 16px;">person_add</mat-icon>
              <h3 style="color: #1a202c; margin: 0 0 8px 0; font-weight: 600;">Gestionar Personas</h3>
              <p style="color: #4a5568; margin: 0; line-height: 1.4;">Agregar, editar o consultar información de personas</p>
            </mat-card-content>
          </mat-card>
          
          <mat-card style="cursor: pointer; transition: transform 0.3s ease, box-shadow 0.3s ease;" (click)="navigateTo('/cuentas')" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='initial'">
            <mat-card-content style="text-align: center; padding: 24px;">
              <mat-icon style="font-size: 48px; color: #673ab7; margin-bottom: 16px;">account_balance_wallet</mat-icon>
              <h3 style="color: #1a202c; margin: 0 0 8px 0; font-weight: 600;">Administrar Cuentas</h3>
              <p style="color: #4a5568; margin: 0; line-height: 1.4;">Crear y gestionar cuentas bancarias</p>
            </mat-card-content>
          </mat-card>
          
          <mat-card style="cursor: pointer; transition: transform 0.3s ease, box-shadow 0.3s ease;" (click)="navigateTo('/creditos')" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='initial'">
            <mat-card-content style="text-align: center; padding: 24px;">
              <mat-icon style="font-size: 48px; color: #673ab7; margin-bottom: 16px;">request_quote</mat-icon>
              <h3 style="color: #1a202c; margin: 0 0 8px 0; font-weight: 600;">Procesar Créditos</h3>
              <p style="color: #4a5568; margin: 0; line-height: 1.4;">Solicitar y administrar créditos</p>
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

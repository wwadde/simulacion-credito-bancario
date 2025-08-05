import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { AccountService } from '../../core/services/account.service';
import { AccountDTO } from '../../core/models/account.model';
import { AccountFormDialogComponent } from './account-form-dialog.component';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  template: `
    <div class="account-list-container">
      <div class="header-section">
        <h1 class="page-title">Gestión de Cuentas</h1>
        <button mat-raised-button color="primary" (click)="openAccountDialog()">
          <mat-icon>add</mat-icon>
          Nueva Cuenta
        </button>
      </div>

      <mat-card class="table-card">
        <mat-card-content>
          <div *ngIf="loading" class="loading-container">
            <mat-spinner></mat-spinner>
          </div>

          <div *ngIf="!loading && accounts.length === 0" class="empty-state">
            <mat-icon class="empty-icon">account_balance_wallet</mat-icon>
            <h3>No hay cuentas registradas</h3>
            <p>Comienza creando una nueva cuenta bancaria</p>
            <button mat-raised-button color="primary" (click)="openAccountDialog()">
              <mat-icon>add</mat-icon>
              Crear Primera Cuenta
            </button>
          </div>

          <table mat-table [dataSource]="accounts" *ngIf="!loading && accounts.length > 0" class="accounts-table">
            <!-- ID Column -->
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let account">{{account.id}}</td>
            </ng-container>

            <!-- Person Column -->
            <ng-container matColumnDef="person">
              <th mat-header-cell *matHeaderCellDef>Titular</th>
              <td mat-cell *matCellDef="let account">
                <div class="person-info">
                  <strong>{{account.person.name}} {{account.person.surname}}</strong>
                  <span class="document">{{account.person.documentType}}: {{account.person.document}}</span>
                </div>
              </td>
            </ng-container>

            <!-- Balance Column -->
            <ng-container matColumnDef="balance">
              <th mat-header-cell *matHeaderCellDef>Balance</th>
              <td mat-cell *matCellDef="let account">
                <mat-chip 
                  [color]="account.balance >= 0 ? 'primary' : 'warn'" 
                  selected 
                  class="balance-chip">
                  {{formatCurrency(account.balance)}}
                </mat-chip>
              </td>
            </ng-container>

            <!-- Payments Column -->
            <ng-container matColumnDef="payments">
              <th mat-header-cell *matHeaderCellDef>Pagos</th>
              <td mat-cell *matCellDef="let account">
                <span class="payments-count">{{account.paymentList.length}} pagos</span>
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let account">
                <button mat-icon-button color="primary" (click)="updateBalance(account)" matTooltip="Actualizar Balance">
                  <mat-icon>account_balance_wallet</mat-icon>
                </button>
                <button mat-icon-button color="accent" (click)="viewPayments(account)" matTooltip="Ver Pagos">
                  <mat-icon>payment</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteAccount(account)" matTooltip="Eliminar">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="account-row"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .account-list-container {
      width: 100% !important;
      max-width: none !important;
      margin: 0 !important;
      padding: 24px !important;
      box-sizing: border-box !important;
      display: block !important;
      position: relative;
    }

    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .page-title {
      font-size: 32px;
      font-weight: 400;
      margin: 0;
      background: linear-gradient(135deg, #4caf50, #8bc34a);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      position: relative;
    }

    .page-title::after {
      content: attr(title);
      position: absolute;
      top: 0;
      left: 0;
      background: var(--text-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      z-index: -1;
      opacity: 0.1;
    }

    .table-card {
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
      border-radius: 16px;
      width: 100%;
      max-width: none;
      background-color: var(--surface-color);
      border: 1px solid var(--border-color);
      overflow: hidden;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 60px;
    }

    .empty-state {
      text-align: center;
      padding: 80px 20px;
      background: linear-gradient(135deg, rgba(76, 175, 80, 0.02), rgba(139, 195, 74, 0.02));
      border-radius: 12px;
      margin: 20px;
    }

    .empty-icon {
      font-size: 80px;
      color: var(--success-color);
      margin-bottom: 20px;
      opacity: 0.6;
      background: linear-gradient(135deg, #4caf50, #8bc34a);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .empty-state h3 {
      color: var(--text-primary);
      margin-bottom: 12px;
      font-size: 24px;
      font-weight: 500;
    }

    .empty-state p {
      color: var(--text-secondary);
      margin-bottom: 32px;
      font-size: 16px;
      line-height: 1.5;
    }

    .accounts-table {
      width: 100%;
    }

    .account-row {
      background-color: var(--surface-color) !important;
    }

    .account-row:hover {
      background-color: #f0f0f0 !important;
    }

    /* Deshabilitar todas las transiciones y animaciones en las filas */
    .account-row,
    .account-row *,
    .account-row::before,
    .account-row::after {
      transition: none !important;
      animation: none !important;
    }

    .dark-theme .account-row:hover {
      background-color: var(--hover-color) !important;
    }

    .account-row td {
      color: var(--text-primary) !important;
      font-weight: 500;
    }

    .account-row:hover td {
      color: var(--text-primary) !important;
    }

    .person-info {
      display: flex;
      flex-direction: column;
    }

    .person-info strong {
      color: var(--text-primary) !important;
      font-weight: 600;
    }

    .document {
      font-size: 12px;
      color: var(--text-secondary) !important;
      font-weight: 500;
    }

    .balance-chip {
      font-weight: 700 !important;
      font-size: 14px !important;
      padding: 8px 16px !important;
      border-radius: 20px !important;
      background: linear-gradient(135deg, #4caf50, #66bb6a) !important;
      color: white !important;
      box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3) !important;
    }

    .balance-chip.negative {
      background: linear-gradient(135deg, var(--warn-color), #ff7043) !important;
      box-shadow: 0 2px 8px rgba(244, 67, 54, 0.3) !important;
    }

    .payments-count {
      color: var(--text-primary) !important;
      font-size: 14px;
      font-weight: 600;
      background: var(--hover-color);
      padding: 4px 12px;
      border-radius: 12px;
      display: inline-block;
    }

    .mat-mdc-table {
      width: 100% !important;
      max-width: none !important;
    }

    /* Forzar que todos los contenedores usen el ancho completo */
    .table-card mat-card-content {
      width: 100% !important;
      max-width: none !important;
      padding: 16px !important;
    }

    .account-list-container,
    .account-list-container > *,
    .table-card,
    .table-card > * {
      width: 100% !important;
      max-width: none !important;
    }

    .mat-mdc-header-cell {
      font-weight: 700;
      color: var(--success-color) !important;
      background-color: var(--surface-color) !important;
      border-bottom: 2px solid var(--success-color);
      font-size: 14px;
      letter-spacing: 0.5px;
    }

    .mat-mdc-header-row {
      background-color: var(--surface-color) !important;
    }

    @media (max-width: 768px) {
      .header-section {
        flex-direction: column;
        align-items: stretch;
      }
      
      .page-title {
        font-size: 24px;
        text-align: center;
      }
      
      .accounts-table {
        font-size: 14px;
      }
    }
  `]
})
export class AccountListComponent implements OnInit {
  accounts: AccountDTO[] = [];
  loading = true;
  displayedColumns = ['id', 'person', 'balance', 'payments', 'actions'];

  constructor(
    private accountService: AccountService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.loading = true;
    this.accountService.getAllAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open('Error al cargar cuentas', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  openAccountDialog(): void {
    const dialogRef = this.dialog.open(AccountFormDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAccounts();
      }
    });
  }

  updateBalance(account: AccountDTO): void {
    // Implementation for updating balance
    this.snackBar.open('Funcionalidad próximamente', 'Cerrar', {
      duration: 2000
    });
  }

  viewPayments(account: AccountDTO): void {
    // Implementation for viewing payments
    this.snackBar.open('Funcionalidad próximamente', 'Cerrar', {
      duration: 2000
    });
  }

  deleteAccount(account: AccountDTO): void {
    if (confirm(`¿Está seguro de eliminar la cuenta de ${account.person.name}?`)) {
      this.accountService.deleteAccount(account.person.id).subscribe({
        next: () => {
          this.snackBar.open('Cuenta eliminada correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadAccounts();
        },
        error: (error) => {
          this.snackBar.open('Error al eliminar cuenta', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
}

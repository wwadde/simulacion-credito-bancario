import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { CreditService } from '../../core/services/credit.service';
import { PersonService } from '../../core/services/person.service';
import { CreditDTO, CreateCreditDTO } from '../../core/models/credit.model';
import { PersonDTO } from '../../core/models/person.model';
import { CreditFormDialogComponent, CreditDialogData } from './credit-form-dialog.component';
import { PaymentFormDialogComponent, PaymentDialogData } from './payment-form-dialog.component';
import { PersonSelectionDialogComponent, PersonSelectionData } from './person-selection-dialog.component';

export class CustomDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'DD/MM/YYYY') {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
    return super.format(date, displayFormat);
  }

  override parse(value: any): Date | null {
    if (typeof value === 'string') {
      const parts = value.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
      }
    }
    return super.parse(value);
  }
}

@Component({
  selector: 'app-credit-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: 'DD/MM/YYYY',
        },
        display: {
          dateInput: 'DD/MM/YYYY',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'DD/MM/YYYY',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      },
    }
  ],
  template: `
    <div class="credit-list-container">
      <div class="header-section">
        <h1 class="page-title">Gestión de Créditos</h1>
        <button mat-raised-button color="primary" (click)="createCredit()">
          <mat-icon>add</mat-icon>
          Nuevo Crédito
        </button>
      </div>

      <div class="persons-grid" *ngIf="!loading">
        <mat-card *ngFor="let person of persons" class="person-card">
          <mat-card-header>
            <mat-card-title>{{person.name}} {{person.surname}}</mat-card-title>
            <mat-card-subtitle>{{person.documentType}}: {{person.document}}</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <div *ngIf="!hasCredit(person.id)" class="no-credit">
              <mat-icon class="no-credit-icon">credit_card_off</mat-icon>
              <p>Sin crédito activo</p>
            </div>

            <div *ngIf="hasCredit(person.id)" class="credit-info">
              <ng-container *ngFor="let credit of getPersonCredits(person.id)">
                <div class="credit-details">
                  <div class="amount-info">
                    <span class="label">Monto Total:</span>
                    <span class="amount">{{formatCurrency(credit.totalLoan)}}</span>
                  </div>
                  
                  <div class="progress-info">
                    <div class="progress-header">
                      <span>Progreso: {{credit.paymentsMade}}/{{credit.agreedPayments}} pagos</span>
                      <span>{{getProgressPercentage(credit)}}%</span>
                    </div>
                    <mat-progress-bar 
                      [value]="getProgressPercentage(credit)" 
                      [color]="getProgressColor(credit)">
                    </mat-progress-bar>
                  </div>

                  <div class="payment-info">
                    <div class="payment-row">
                      <span class="label">Pagado:</span>
                      <span class="paid">{{formatCurrency(credit.amountPaid)}}</span>
                    </div>
                    <div class="payment-row">
                      <span class="label">Por pagar:</span>
                      <span class="pending">{{formatCurrency(credit.amountToPay)}}</span>
                    </div>
                  </div>

                  <div class="status-info">
                    <mat-chip 
                      [color]="getStatusColor(credit.status)" 
                      selected>
                      {{credit.status}}
                    </mat-chip>
                    <span class="interest-rate">Tasa: {{credit.interestRate}}%</span>
                  </div>

                  <div class="date-info">
                    <small>Vence: {{formatDate(credit.creditExpirationDate)}}</small>
                  </div>
                </div>

                <div class="credit-actions">
                  <button mat-raised-button color="accent" (click)="makePayment(credit)">
                    <mat-icon>payment</mat-icon>
                    Realizar Pago
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteCredit(credit)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </ng-container>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div *ngIf="loading" class="loading-container">
        <mat-spinner></mat-spinner>
      </div>

      <div *ngIf="!loading && persons.length === 0" class="empty-state">
        <mat-icon class="empty-icon">credit_card</mat-icon>
        <h3>No hay personas para gestionar créditos</h3>
        <p>Primero debe registrar personas en el sistema</p>
        <button mat-raised-button color="primary" routerLink="/personas">
          <mat-icon>people</mat-icon>
          Ir a Personas
        </button>
      </div>
    </div>
  `,
  styles: [`
    .credit-list-container {
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
      font-weight: 300;
      color: var(--text-primary);
      margin: 0;
    }

    .persons-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 20px;
    }

    .person-card {
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      border-radius: 12px;
      transition: transform 0.3s ease;
      background-color: var(--surface-color);
    }

    .person-card:hover {
      transform: translateY(-2px);
    }

    .no-credit {
      text-align: center;
      padding: 20px;
      color: var(--text-secondary);
    }

    .no-credit-icon {
      font-size: 48px;
      color: var(--text-disabled);
      margin-bottom: 12px;
    }

    .credit-info {
      padding: 8px;
    }

    .credit-details {
      margin-bottom: 16px;
    }

    .amount-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .amount {
      font-size: 18px;
      font-weight: 600;
      color: var(--primary-color);
    }

    .progress-info {
      margin-bottom: 12px;
    }

    .progress-header {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: var(--text-secondary);
      margin-bottom: 4px;
    }

    .payment-info {
      margin-bottom: 12px;
    }

    .payment-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
    }

    .paid {
      color: #4caf50;
      font-weight: 500;
    }

    .pending {
      color: #f44336;
      font-weight: 500;
    }

    .status-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .interest-rate {
      font-size: 12px;
      color: var(--text-secondary);
    }

    .date-info {
      color: var(--text-secondary);
      font-size: 12px;
    }

    .credit-actions {
      display: flex;
      gap: 8px;
      justify-content: space-between;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid var(--border-color);
    }

    .label {
      font-size: 14px;
      color: var(--text-secondary);
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 60px;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
    }

    .empty-icon {
      font-size: 64px;
      color: var(--text-disabled);
      margin-bottom: 16px;
    }

    .empty-state h3 {
      color: var(--text-secondary);
      margin-bottom: 8px;
    }

    .empty-state p {
      color: var(--text-muted);
      margin-bottom: 24px;
    }

    /* Asegurar que el contenido use todo el ancho en pantallas grandes */
    .table-card {
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      border-radius: 12px;
      width: 100%;
      max-width: none;
      background-color: var(--surface-color);
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

    .credit-list-container,
    .credit-list-container > *,
    .table-card,
    .table-card > * {
      width: 100% !important;
      max-width: none !important;
    }

    @media (max-width: 768px) {
      .persons-grid {
        grid-template-columns: 1fr;
      }
      
      .header-section {
        flex-direction: column;
        align-items: stretch;
      }
      
      .page-title {
        font-size: 24px;
        text-align: center;
      }
    }
  `]
})
export class CreditListComponent implements OnInit {
  persons: PersonDTO[] = [];
  credits: { [personId: number]: CreditDTO } = {};
  loading = true;

  constructor(
    private creditService: CreditService,
    private personService: PersonService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading = true;
    
    this.personService.findAllPersons().subscribe({
      next: (persons) => {
        this.persons = persons.filter(p => p.status === 'ACTIVO');
        this.loadCreditsForPersons();
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Error al cargar personas', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  private loadCreditsForPersons(): void {
    const creditPromises = this.persons.map(person =>
      this.creditService.getCredit(person.id).toPromise().catch(() => null)
    );

    Promise.all(creditPromises).then(results => {
      results.forEach((credit, index) => {
        if (credit) {
          this.credits[this.persons[index].id] = credit;
        }
      });
      this.loading = false;
    });
  }

  hasCredit(personId: number): boolean {
    return !!this.credits[personId];
  }

  getPersonCredits(personId: number): CreditDTO[] {
    const credit = this.credits[personId];
    return credit ? [credit] : [];
  }

  getProgressPercentage(credit: CreditDTO): number {
    return Math.round((credit.paymentsMade / credit.agreedPayments) * 100);
  }

  getProgressColor(credit: CreditDTO): string {
    const percentage = this.getProgressPercentage(credit);
    if (percentage >= 75) return 'primary';
    if (percentage >= 50) return 'accent';
    return 'warn';
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'activo': return 'primary';
      case 'completado': return 'accent';
      case 'vencido': return 'warn';
      default: return 'primary';
    }
  }

  createCredit(): void {
    // Get list of persons who don't have credits
    const personsWithCredits = Object.keys(this.credits).map(id => parseInt(id));
    
    const dialogData: PersonSelectionData = {
      persons: this.persons,
      excludePersonsWithCredit: personsWithCredits
    };

    const dialogRef = this.dialog.open(PersonSelectionDialogComponent, {
      width: '700px',
      data: dialogData,
      disableClose: false
    });

    dialogRef.afterClosed().subscribe((selectedPerson: PersonDTO) => {
      if (selectedPerson) {
        this.createCreditForPerson(selectedPerson);
      }
    });
  }

  createCreditForPerson(person: PersonDTO): void {
    const dialogData: CreditDialogData = { person };
    
    const dialogRef = this.dialog.open(CreditFormDialogComponent, {
      width: '600px',
      data: dialogData,
      disableClose: false
    });

    dialogRef.afterClosed().subscribe((creditData: CreateCreditDTO) => {
      if (creditData) {
        this.creditService.createCredit(person.id, creditData).subscribe({
          next: (response) => {
            this.snackBar.open('Crédito creado exitosamente', 'Cerrar', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            // Reload credits to show the new one
            this.loadCreditsForPersons();
          },
          error: (error) => {
            console.error('Error creating credit:', error);
            this.snackBar.open('Error al crear el crédito', 'Cerrar', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  makePayment(credit: CreditDTO): void {
    const dialogData: PaymentDialogData = { credit };
    
    const dialogRef = this.dialog.open(PaymentFormDialogComponent, {
      width: '600px',
      data: dialogData,
      disableClose: false
    });

    dialogRef.afterClosed().subscribe((paymentData) => {
      if (paymentData) {
        const personId = credit.account.person.id;
        this.creditService.makePayment(credit.id, personId, paymentData).subscribe({
          next: (response) => {
            this.snackBar.open('Pago realizado exitosamente', 'Cerrar', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            // Reload credits to show updated payment information
            this.loadCreditsForPersons();
          },
          error: (error) => {
            console.error('Error making payment:', error);
            this.snackBar.open('Error al realizar el pago', 'Cerrar', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  deleteCredit(credit: CreditDTO): void {
    if (confirm('¿Está seguro de eliminar este crédito?')) {
      // Get person ID from credit account
      const personId = credit.account.person.id;
      
      this.creditService.deleteCredit(credit.id, personId).subscribe({
        next: () => {
          this.snackBar.open('Crédito eliminado correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          delete this.credits[personId];
        },
        error: () => {
          this.snackBar.open('Error al eliminar crédito', 'Cerrar', {
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

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-CO');
  }
}

import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { PersonDTO } from '../../core/models/person.model';
import { CreateCreditDTO } from '../../core/models/credit.model';

export interface CreditDialogData {
  person: PersonDTO;
}

@Component({
  selector: 'app-credit-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  template: `
    <div class="dialog-header">
      <mat-icon class="dialog-icon">credit_card</mat-icon>
      <h2 mat-dialog-title>Crear Nuevo Crédito</h2>
    </div>
    
    <mat-dialog-content>
      <form [formGroup]="creditForm" class="credit-form">
        <div class="form-section client-section">
          <h3 class="section-title">
            <mat-icon>person</mat-icon>
            Cliente Seleccionado
          </h3>
          <div class="client-info">
            <div class="client-main">
              <h4>{{data.person.name}} {{data.person.surname}}</h4>
              <p class="document">{{data.person.documentType}}: {{data.person.document}}</p>
            </div>
            <div class="client-details" *ngIf="data.person.email || data.person.phoneNumber">
              <p *ngIf="data.person.email">
                <mat-icon>email</mat-icon>
                {{data.person.email}}
              </p>
              <p *ngIf="data.person.phoneNumber">
                <mat-icon>phone</mat-icon>
                {{data.person.phoneNumber}}
              </p>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3 class="section-title">
            <mat-icon>payments</mat-icon>
            Detalles del Crédito
          </h3>
          
          <div class="form-row">
            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Monto del Préstamo</mat-label>
              <input matInput 
                     type="number" 
                     formControlName="loan"
                     placeholder="Ingrese el monto">
              <mat-icon matSuffix>attach_money</mat-icon>
              <mat-error *ngIf="creditForm.get('loan')?.hasError('required')">
                El monto es requerido
              </mat-error>
              <mat-error *ngIf="creditForm.get('loan')?.hasError('min')">
                El monto debe ser mayor a cero
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Tasa de Interés (%)</mat-label>
              <input matInput 
                     type="number" 
                     step="0.01"
                     formControlName="interestRate"
                     placeholder="Tasa de interés">
              <span matTextSuffix>%</span>
              <mat-icon matSuffix>percent</mat-icon>
              <mat-error *ngIf="creditForm.get('interestRate')?.hasError('required')">
                La tasa de interés es requerida
              </mat-error>
              <mat-error *ngIf="creditForm.get('interestRate')?.hasError('min')">
                La tasa debe ser mayor a cero
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Número de Cuotas</mat-label>
              <input matInput 
                     type="number" 
                     formControlName="agreedPayments"
                     placeholder="Número de pagos acordados">
              <mat-icon matSuffix>receipt_long</mat-icon>
              <mat-error *ngIf="creditForm.get('agreedPayments')?.hasError('required')">
                El número de cuotas es requerido
              </mat-error>
              <mat-error *ngIf="creditForm.get('agreedPayments')?.hasError('min')">
                Debe ser al menos 1 cuota
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Fecha de Vencimiento</mat-label>
              <input matInput 
                     [matDatepicker]="picker"
                     formControlName="creditExpirationDate"
                     [min]="getTomorrowDate()"
                     placeholder="Seleccione fecha"
                     readonly>
              <mat-datepicker-toggle matIconSuffix [for]="picker">
                <mat-icon matDatepickerToggleIcon>event</mat-icon>
              </mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-error *ngIf="creditForm.get('creditExpirationDate')?.hasError('required')">
                La fecha de vencimiento es requerida
              </mat-error>
            </mat-form-field>
          </div>
        </div>

        <div class="form-section calculation-section" *ngIf="creditForm.get('loan')?.value && creditForm.get('interestRate')?.value && creditForm.get('agreedPayments')?.value">
          <h3 class="section-title">
            <mat-icon>calculate</mat-icon>
            Resumen del Crédito
          </h3>
          
          <div class="calculation-preview">
            <div class="preview-row">
              <span>Monto del Préstamo:</span>
              <span class="amount">{{formatCurrency(creditForm.get('loan')?.value || 0)}}</span>
            </div>
            
            <div class="preview-row">
              <span>Tasa de Interés:</span>
              <span class="rate">{{creditForm.get('interestRate')?.value || 0}}%</span>
            </div>
            
            <div class="preview-row">
              <span>Número de Cuotas:</span>
              <span class="payments">{{creditForm.get('agreedPayments')?.value || 0}} cuotas</span>
            </div>
            
            <div class="preview-row total-row">
              <span>Total a Pagar:</span>
              <span class="total">{{formatCurrency(calculateTotal())}}</span>
            </div>
            
            <div class="preview-row installment-row">
              <span>Valor por Cuota:</span>
              <span class="installment">{{formatCurrency(calculateInstallment())}}</span>
            </div>
          </div>
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="center">
      <button mat-stroked-button (click)="onCancel()" class="cancel-btn">
        <mat-icon>close</mat-icon>
        Cancelar
      </button>
      <button 
        mat-raised-button 
        color="primary" 
        (click)="onSubmit()" 
        [disabled]="!creditForm.valid"
        class="submit-btn">
        <mat-icon>save</mat-icon>
        Crear Crédito
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    /* CSS Variables for consistent theming */
    :root {
      --primary-color: #673ab7;
      --primary-light: #9c27b0;
      --primary-dark: #5e35b1;
      --surface-color: #ffffff;
      --text-primary: #212121;
      --text-secondary: #666;
      --border-color: #e0e0e0;
      --success-color: #4caf50;
      --error-color: #d32f2f;
      --warning-color: #f57c00;
      --surface-elevated: #f8f9fa;
    }

    /* Dark theme overrides */
    :host-context(.dark-theme),
    :host-context([data-theme="dark"]) {
      --primary-color: #ce93d8;
      --primary-light: #ba68c8;
      --primary-dark: #ab47bc;
      --surface-color: rgba(255, 255, 255, 0.05);
      --text-primary: rgba(255, 255, 255, 0.9);
      --text-secondary: rgba(255, 255, 255, 0.7);
      --border-color: rgba(255, 255, 255, 0.12);
      --success-color: #66bb6a;
      --error-color: #ef5350;
      --warning-color: #ffb74d;
      --surface-elevated: rgba(255, 255, 255, 0.08);
    }

    /* System dark theme support */
    @media (prefers-color-scheme: dark) {
      :root {
        --primary-color: #ce93d8;
        --primary-light: #ba68c8;
        --primary-dark: #ab47bc;
        --surface-color: rgba(255, 255, 255, 0.05);
        --text-primary: rgba(255, 255, 255, 0.9);
        --text-secondary: rgba(255, 255, 255, 0.7);
        --border-color: rgba(255, 255, 255, 0.12);
        --success-color: #66bb6a;
        --error-color: #ef5350;
        --warning-color: #ffb74d;
        --surface-elevated: rgba(255, 255, 255, 0.08);
      }
    }

    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 24px 0 16px;
      background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
      margin: -24px -24px 24px -24px;
      border-radius: 16px 16px 0 0;
      position: relative;
      overflow: hidden;
    }

    .dialog-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%, rgba(255, 255, 255, 0.1) 100%);
      pointer-events: none;
    }

    .dialog-icon {
      font-size: 32px;
      color: white;
      background: rgba(255, 255, 255, 0.25);
      border-radius: 50%;
      padding: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      backdrop-filter: blur(10px);
    }

    .credit-form {
      width: 100%;
      max-width: 650px;
      min-width: 320px;
      padding: 0;
    }

    .form-section {
      margin-bottom: 24px;
      padding: 20px;
      background: var(--surface-color);
      border-radius: 12px;
      border: 1px solid var(--border-color);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
    }

    .form-section:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 16px 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--primary-color);
      padding-bottom: 8px;
      border-bottom: 2px solid var(--primary-color);
    }

    .section-title mat-icon {
      color: var(--primary-color);
      font-size: 20px;
    }

    .client-section {
      background: var(--surface-elevated) !important;
      border: 1px solid var(--primary-color) !important;
      position: relative;
      overflow: hidden;
    }

    .client-info {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .client-main h4 {
      margin: 0 0 8px 0;
      color: var(--primary-color);
      font-weight: 600;
      font-size: 20px;
    }

    .document {
      margin: 0;
      color: var(--text-secondary);
      font-weight: 500;
      font-size: 14px;
      background-color: var(--surface-elevated);
      padding: 4px 8px;
      border-radius: 4px;
      display: inline-block;
      width: fit-content;
      border: 1px solid var(--border-color);
    }

    .client-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .client-details p {
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--text-secondary);
      font-size: 14px;
    }

    .client-details mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: var(--primary-color);
    }

    .calculation-section {
      background: var(--surface-elevated) !important;
      border: 1px solid var(--success-color) !important;
      position: relative;
      overflow: hidden;
    }

    .calculation-preview {
      background: transparent;
      padding: 0;
      border: none;
      margin: 0;
    }

    .preview-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      color: var(--text-primary);
      font-size: 16px;
      border-bottom: 1px solid var(--border-color);
    }

    .preview-row:last-child {
      border-bottom: none;
    }

    .total-row {
      background: rgba(211, 47, 47, 0.05);
      padding: 16px 12px;
      border-radius: 8px;
      margin-top: 8px;
      border: 1px solid rgba(211, 47, 47, 0.1);
      font-weight: 600;
    }

    .installment-row {
      background: rgba(76, 175, 80, 0.05);
      padding: 16px 12px;
      border-radius: 8px;
      margin-top: 8px;
      border: 1px solid rgba(76, 175, 80, 0.1);
      font-weight: 600;
    }

    .amount {
      font-weight: 600;
      color: var(--primary-color);
      font-size: 18px;
    }

    .rate {
      font-weight: 500;
      color: var(--warning-color);
      font-size: 16px;
    }

    .payments {
      font-weight: 500;
      color: var(--primary-color);
      font-size: 16px;
    }

    .total {
      font-weight: 700;
      color: var(--error-color);
      font-size: 20px;
    }

    .installment {
      font-weight: 700;
      color: var(--success-color);
      font-size: 20px;
    }

    .form-row {
      display: flex;
      gap: 16px;
      width: 100%;
      align-items: flex-start;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .half-width {
      flex: 1;
      margin-bottom: 16px;
    }

    mat-dialog-content {
      max-height: 80vh;
      overflow-y: auto;
      padding: 0 !important;
      background: var(--surface-color);
      width: 100%;
      box-sizing: border-box;
    }

    :host ::ng-deep .mat-mdc-dialog-container {
      max-width: 90vw !important;
      width: auto !important;
      min-width: 320px !important;
    }

    :host ::ng-deep .mat-mdc-dialog-surface {
      max-width: 650px !important;
      width: auto !important;
      min-width: 320px !important;
      background: var(--surface-color) !important;
    }

    mat-dialog-title {
      color: white !important;
      font-weight: 600;
      font-size: 24px;
      margin: 0;
    }

    mat-dialog-actions {
      padding: 24px 0 8px !important;
      justify-content: center !important;
      gap: 16px;
      background: var(--surface-color);
      border-top: 1px solid var(--border-color);
    }

    .cancel-btn {
      min-width: 140px;
      height: 44px;
      border-radius: 22px;
      font-weight: 500;
      border: 2px solid var(--primary-color) !important;
      color: var(--primary-color) !important;
      background-color: transparent !important;
      transition: all 0.3s ease;
    }

    .cancel-btn:hover {
      background: var(--primary-color) !important;
      color: white !important;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(103, 58, 183, 0.3) !important;
    }

    .submit-btn {
      min-width: 140px;
      height: 44px;
      border-radius: 22px;
      font-weight: 600;
      background: linear-gradient(135deg, var(--primary-color), var(--primary-light)) !important;
      color: white !important;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(103, 58, 183, 0.3);
    }

    .submit-btn:hover:not([disabled]) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(103, 58, 183, 0.4);
    }

    .submit-btn[disabled] {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
    }

    /* Dark theme specific adjustments */
    :host-context(.dark-theme) .total-row,
    :host-context([data-theme="dark"]) .total-row {
      background: rgba(239, 83, 80, 0.15);
      border-color: rgba(239, 83, 80, 0.3);
    }

    :host-context(.dark-theme) .installment-row,
    :host-context([data-theme="dark"]) .installment-row {
      background: rgba(102, 187, 106, 0.15);
      border-color: rgba(102, 187, 106, 0.3);
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
      }
      
      .half-width {
        width: 100%;
      }
      
      :host ::ng-deep .mat-mdc-dialog-container {
        margin: 16px !important;
      }
      
      :host ::ng-deep .mat-mdc-dialog-surface {
        max-width: 100% !important;
        margin: 0 !important;
      }
    }
  `]
})
export class CreditFormDialogComponent {
  creditForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CreditFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreditDialogData,
    private fb: FormBuilder
  ) {
    this.creditForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      loan: [null, [Validators.required, Validators.min(1)]],
      interestRate: [null, [Validators.required, Validators.min(0)]],
      agreedPayments: [null, [Validators.required, Validators.min(1)]],
      creditExpirationDate: [null, Validators.required]
    });
  }

  calculateTotal(): number {
    const loan = this.creditForm.get('loan')?.value || 0;
    const interestRate = this.creditForm.get('interestRate')?.value || 0;
    return loan + (loan * interestRate / 100);
  }

  calculateInstallment(): number {
    const total = this.calculateTotal();
    const payments = this.creditForm.get('agreedPayments')?.value || 1;
    return total / payments;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  onSubmit(): void {
    if (this.creditForm.valid) {
      const formValue = this.creditForm.value;
      const creditData: CreateCreditDTO = {
        loan: formValue.loan,
        interestRate: formValue.interestRate,
        agreedPayments: formValue.agreedPayments,
        creditExpirationDate: this.formatDateForAPI(formValue.creditExpirationDate)
      };

      this.dialogRef.close(creditData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getTomorrowDate(): Date {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }

  formatDateForAPI(date: Date): string {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  openDatepicker(picker: any): void {
    if (picker && !picker.opened) {
      picker.open();
    }
  }
}

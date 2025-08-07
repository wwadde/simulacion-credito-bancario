import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { CreditDTO } from '../../core/models/credit.model';
import { PaymentDTO } from '../../core/models/account.model';

export interface PaymentDialogData {
  credit: CreditDTO;
}

@Component({
  selector: 'app-payment-form-dialog',
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
    <div class="dialog-container">
      <h2 mat-dialog-title>
        <mat-icon>payment</mat-icon>
        Realizar Pago
      </h2>
      
      <div class="credit-info">
        <h3>Cliente: {{data.credit.account.person.name}} {{data.credit.account.person.surname}}</h3>
        <div class="credit-details">
          <div class="detail-row">
            <span>Monto total del crédito:</span>
            <span class="amount">{{formatCurrency(data.credit.totalLoan)}}</span>
          </div>
          <div class="detail-row">
            <span>Monto pagado:</span>
            <span class="paid">{{formatCurrency(data.credit.amountPaid)}}</span>
          </div>
          <div class="detail-row">
            <span>Monto pendiente:</span>
            <span class="pending">{{formatCurrency(data.credit.amountToPay)}}</span>
          </div>
          <div class="detail-row">
            <span>Pagos realizados:</span>
            <span>{{data.credit.paymentsMade}} / {{data.credit.agreedPayments}}</span>
          </div>
        </div>
      </div>

      <form [formGroup]="paymentForm" (ngSubmit)="onSubmit()">
        <mat-dialog-content>
          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Valor del Pago</mat-label>
              <input matInput 
                     type="number" 
                     formControlName="value"
                     placeholder="Ingrese el valor del pago">
              <span matTextPrefix>$ </span>
              <mat-error *ngIf="paymentForm.get('value')?.hasError('required')">
                El valor del pago es requerido
              </mat-error>
              <mat-error *ngIf="paymentForm.get('value')?.hasError('min')">
                El valor debe ser mayor a cero
              </mat-error>
              <mat-error *ngIf="paymentForm.get('value')?.hasError('max')">
                El valor no puede ser mayor al monto pendiente
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Fecha del Pago</mat-label>
              <input matInput 
                     [matDatepicker]="picker"
                     formControlName="paymentDate"
                     placeholder="Seleccione la fecha del pago">
              <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-error *ngIf="paymentForm.get('paymentDate')?.hasError('required')">
                La fecha del pago es requerida
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Descripción (Opcional)</mat-label>
              <textarea matInput 
                        formControlName="description"
                        rows="3"
                        placeholder="Ingrese una descripción del pago">
              </textarea>
            </mat-form-field>
          </div>

          <div class="payment-summary" *ngIf="paymentForm.get('value')?.value">
            <h4>Resumen del Pago</h4>
            <div class="summary-row">
              <span>Valor del pago:</span>
              <span class="payment-amount">{{formatCurrency(paymentForm.get('value')?.value || 0)}}</span>
            </div>
            <div class="summary-row">
              <span>Monto restante después del pago:</span>
              <span class="remaining">{{formatCurrency(calculateRemaining())}}</span>
            </div>
            <div class="summary-row" *ngIf="isFullPayment()">
              <span class="full-payment-text">✓ Este pago liquidará completamente el crédito</span>
            </div>
          </div>
        </mat-dialog-content>

        <mat-dialog-actions align="end">
          <button mat-button type="button" (click)="onCancel()">
            Cancelar
          </button>
          <button mat-raised-button color="primary" type="submit" [disabled]="!paymentForm.valid">
            <mat-icon>payment</mat-icon>
            Realizar Pago
          </button>
        </mat-dialog-actions>
      </form>
    </div>
  `,
  styles: [`
    /* CSS Variables for consistent theming */
    :root {
      --primary-color: #1976d2;
      --primary-light: #42a5f5;
      --surface-color: #ffffff;
      --surface-elevated: #f5f5f5;
      --text-primary: #333;
      --text-secondary: #666;
      --border-color: #e0e0e0;
      --success-color: #2e7d32;
      --error-color: #d32f2f;
      --info-background: #f9f9f9;
    }

    /* Dark theme overrides */
    :host-context(.dark-theme),
    :host-context([data-theme="dark"]) {
      --primary-color: #64b5f6;
      --primary-light: #90caf9;
      --surface-color: rgba(255, 255, 255, 0.05);
      --surface-elevated: rgba(255, 255, 255, 0.08);
      --text-primary: rgba(255, 255, 255, 0.9);
      --text-secondary: rgba(255, 255, 255, 0.7);
      --border-color: rgba(255, 255, 255, 0.12);
      --success-color: #66bb6a;
      --error-color: #ef5350;
      --info-background: rgba(255, 255, 255, 0.03);
    }

    /* System dark theme support */
    @media (prefers-color-scheme: dark) {
      :root {
        --primary-color: #64b5f6;
        --primary-light: #90caf9;
        --surface-color: rgba(255, 255, 255, 0.05);
        --surface-elevated: rgba(255, 255, 255, 0.08);
        --text-primary: rgba(255, 255, 255, 0.9);
        --text-secondary: rgba(255, 255, 255, 0.7);
        --border-color: rgba(255, 255, 255, 0.12);
        --success-color: #66bb6a;
        --error-color: #ef5350;
        --info-background: rgba(255, 255, 255, 0.03);
      }
    }

    .dialog-container {
      min-width: 500px;
      max-width: 600px;
      background: var(--surface-color);
    }

    .credit-info {
      background-color: var(--surface-elevated);
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 24px;
      border: 1px solid var(--border-color);
      transition: all 0.3s ease;
    }

    .credit-info:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .credit-info h3 {
      margin: 0 0 16px 0;
      color: var(--primary-color);
      font-weight: 500;
    }

    .credit-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: var(--text-primary);
      padding: 4px 0;
    }

    .amount {
      font-weight: 600;
      color: var(--primary-color);
    }

    .paid {
      font-weight: 500;
      color: var(--success-color);
    }

    .pending {
      font-weight: 500;
      color: var(--error-color);
    }

    .form-row {
      margin-bottom: 16px;
    }

    .full-width {
      width: 100%;
    }

    h2[mat-dialog-title] {
      display: flex;
      align-items: center;
      gap: 12px;
      color: var(--primary-color);
      margin-bottom: 16px;
      font-weight: 500;
    }

    .payment-summary {
      background-color: var(--info-background);
      padding: 16px;
      border-radius: 8px;
      margin-top: 24px;
      border: 1px solid var(--border-color);
      transition: all 0.3s ease;
    }

    .payment-summary:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .payment-summary h4 {
      margin: 0 0 16px 0;
      color: var(--success-color);
      font-size: 16px;
      font-weight: 500;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      padding: 4px 0;
      color: var(--text-primary);
    }

    .summary-row:last-child {
      margin-bottom: 0;
    }

    .payment-amount {
      font-weight: 600;
      color: var(--primary-color);
      font-size: 16px;
    }

    .remaining {
      font-weight: 500;
      color: var(--text-primary);
    }

    .full-payment-text {
      color: var(--success-color);
      font-weight: 500;
      text-align: center;
      flex: 1;
    }

    mat-dialog-actions {
      margin-top: 24px;
      padding: 16px 0 0 0;
      border-top: 1px solid var(--border-color);
    }

    /* Ensure Material components adapt to theme */
    :host ::ng-deep .mat-mdc-dialog-surface {
      background: var(--surface-color) !important;
    }

    /* Button styling */
    button[mat-button] {
      color: var(--primary-color) !important;
    }

    button[mat-raised-button] {
      background: var(--primary-color) !important;
      color: white !important;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .dialog-container {
        min-width: 300px;
        width: 100%;
      }
      
      .credit-info,
      .payment-summary {
        margin: 12px 0;
      }
    }

    mat-form-field {
      margin-bottom: 8px;
    }

    /* Dark theme support */
    :host-context(.dark-theme) .credit-info,
    :host-context([data-theme="dark"]) .credit-info {
      background-color: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.12);
    }

    :host-context(.dark-theme) .credit-info h3,
    :host-context([data-theme="dark"]) .credit-info h3 {
      color: #90caf9;
    }

    :host-context(.dark-theme) .detail-row,
    :host-context([data-theme="dark"]) .detail-row {
      color: rgba(255, 255, 255, 0.87);
    }

    :host-context(.dark-theme) .amount,
    :host-context([data-theme="dark"]) .amount {
      color: #90caf9;
    }

    :host-context(.dark-theme) .paid,
    :host-context([data-theme="dark"]) .paid {
      color: #a5d6a7;
    }

    :host-context(.dark-theme) .pending,
    :host-context([data-theme="dark"]) .pending {
      color: #ef5350;
    }

    :host-context(.dark-theme) h2[mat-dialog-title],
    :host-context([data-theme="dark"]) h2[mat-dialog-title] {
      color: #90caf9;
    }

    :host-context(.dark-theme) .payment-summary,
    :host-context([data-theme="dark"]) .payment-summary {
      background-color: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.12);
    }

    :host-context(.dark-theme) .payment-summary h4,
    :host-context([data-theme="dark"]) .payment-summary h4 {
      color: #a5d6a7;
    }

    :host-context(.dark-theme) .summary-row,
    :host-context([data-theme="dark"]) .summary-row {
      color: rgba(255, 255, 255, 0.87);
    }

    :host-context(.dark-theme) .payment-amount,
    :host-context([data-theme="dark"]) .payment-amount {
      color: #90caf9;
    }

    :host-context(.dark-theme) .remaining,
    :host-context([data-theme="dark"]) .remaining {
      color: rgba(255, 255, 255, 0.87);
    }

    :host-context(.dark-theme) .full-payment-text,
    :host-context([data-theme="dark"]) .full-payment-text {
      color: #a5d6a7;
    }

    /* Media query fallback for dark theme */
    @media (prefers-color-scheme: dark) {
      .credit-info {
        background-color: rgba(255, 255, 255, 0.05);
        border-color: rgba(255, 255, 255, 0.12);
      }

      .credit-info h3 {
        color: #90caf9;
      }

      .detail-row {
        color: rgba(255, 255, 255, 0.87);
      }

      .amount {
        color: #90caf9;
      }

      .paid {
        color: #a5d6a7;
      }

      .pending {
        color: #ef5350;
      }

      h2[mat-dialog-title] {
        color: #90caf9;
      }

      .payment-summary {
        background-color: rgba(255, 255, 255, 0.05);
        border-color: rgba(255, 255, 255, 0.12);
      }

      .payment-summary h4 {
        color: #a5d6a7;
      }

      .summary-row {
        color: rgba(255, 255, 255, 0.87);
      }

      .payment-amount {
        color: #90caf9;
      }

      .remaining {
        color: rgba(255, 255, 255, 0.87);
      }

      .full-payment-text {
        color: #a5d6a7;
      }
    }
  `]
})
export class PaymentFormDialogComponent {
  paymentForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<PaymentFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PaymentDialogData,
    private fb: FormBuilder
  ) {
    this.paymentForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      value: [null, [
        Validators.required, 
        Validators.min(1),
        Validators.max(this.data.credit.amountToPay)
      ]],
      paymentDate: [new Date(), Validators.required],
      description: ['']
    });
  }

  calculateRemaining(): number {
    const paymentValue = this.paymentForm.get('value')?.value || 0;
    return Math.max(0, this.data.credit.amountToPay - paymentValue);
  }

  isFullPayment(): boolean {
    const paymentValue = this.paymentForm.get('value')?.value || 0;
    return paymentValue >= this.data.credit.amountToPay;
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
    if (this.paymentForm.valid) {
      const formValue = this.paymentForm.value;
      const paymentData: Omit<PaymentDTO, 'id'> = {
        paymentDate: formValue.paymentDate.toISOString(),
        description: formValue.description || `Pago de crédito - ${this.formatCurrency(formValue.value)}`,
        value: formValue.value
      };

      this.dialogRef.close(paymentData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

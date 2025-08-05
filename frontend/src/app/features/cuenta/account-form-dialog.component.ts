import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AccountService } from '../../core/services/account.service';
import { PersonService } from '../../core/services/person.service';
import { PersonDTO } from '../../core/models/person.model';

@Component({
  selector: 'app-account-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title>Crear Nueva Cuenta</h2>
    
    <mat-dialog-content>
      <form [formGroup]="accountForm" class="account-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Seleccionar Persona *</mat-label>
          <mat-select formControlName="personId">
            <mat-option *ngFor="let person of persons" [value]="person.id">
              {{person.name}} {{person.surname}} - {{person.documentType}}: {{person.document}}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="accountForm.get('personId')?.hasError('required')">
            Debe seleccionar una persona
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Balance Inicial *</mat-label>
          <input matInput type="number" formControlName="balance" placeholder="0">
          <mat-error *ngIf="accountForm.get('balance')?.hasError('required')">
            El balance inicial es requerido
          </mat-error>
          <mat-error *ngIf="accountForm.get('balance')?.hasError('min')">
            El balance no puede ser negativo
          </mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button 
        mat-raised-button 
        color="primary" 
        (click)="onSubmit()" 
        [disabled]="accountForm.invalid || loading">
        <span *ngIf="loading">Creando...</span>
        <span *ngIf="!loading">Crear Cuenta</span>
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .account-form {
      min-width: 450px;
      padding: 24px 0;
      background: linear-gradient(135deg, rgba(76, 175, 80, 0.02), rgba(139, 195, 74, 0.02));
      border-radius: 12px;
      margin: 0 -24px;
      padding: 24px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 20px;
    }

    mat-dialog-content {
      max-height: 70vh;
      overflow-y: auto;
      padding: 0 !important;
    }

    mat-dialog-title {
      background: linear-gradient(135deg, #4caf50, #8bc34a);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 600;
      font-size: 24px;
      text-align: center;
      margin-bottom: 0;
    }

    mat-dialog-actions {
      padding: 24px 0 8px !important;
      justify-content: center !important;
      gap: 16px;
    }

    mat-dialog-actions button {
      min-width: 120px;
    }

    @media (max-width: 600px) {
      .account-form {
        min-width: unset;
      }
    }
  `]
})
export class AccountFormDialogComponent implements OnInit {
  accountForm!: FormGroup;
  loading = false;
  persons: PersonDTO[] = [];

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private personService: PersonService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AccountFormDialogComponent>
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadPersons();
  }

  private initForm(): void {
    this.accountForm = this.fb.group({
      personId: ['', [Validators.required]],
      balance: [0, [Validators.required, Validators.min(0)]]
    });
  }

  private loadPersons(): void {
    this.personService.findAllPersons().subscribe({
      next: (persons) => {
        this.persons = persons.filter(p => p.status === 'ACTIVO');
      },
      error: () => {
        this.snackBar.open('Error al cargar personas', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  onSubmit(): void {
    if (this.accountForm.valid) {
      this.loading = true;
      const { personId, balance } = this.accountForm.value;

      this.accountService.createAccount(personId, balance).subscribe({
        next: () => {
          this.loading = false;
          this.snackBar.open('Cuenta creada correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.dialogRef.close(true);
        },
        error: () => {
          this.loading = false;
          this.snackBar.open('Error al crear cuenta', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}

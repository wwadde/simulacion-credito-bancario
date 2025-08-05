import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PersonService } from '../../core/services/person.service';
import { PersonDTO, EditPersonDTO, DocumentType, PersonStatus } from '../../core/models/person.model';

@Component({
  selector: 'app-person-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title>{{isEdit ? 'Editar' : 'Nueva'}} Persona</h2>
    
    <mat-dialog-content>
      <form [formGroup]="personForm" class="person-form">
        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Nombre *</mat-label>
            <input matInput formControlName="name" placeholder="Ingrese el nombre">
            <mat-error *ngIf="personForm.get('name')?.hasError('required')">
              El nombre es requerido
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Apellido</mat-label>
            <input matInput formControlName="surname" placeholder="Ingrese el apellido">
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" placeholder="correo@ejemplo.com">
          <mat-error *ngIf="personForm.get('email')?.hasError('email')">
            Ingrese un email válido
          </mat-error>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Teléfono</mat-label>
            <input matInput formControlName="phoneNumber" placeholder="Número de teléfono">
          </mat-form-field>

          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Fecha de Nacimiento</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="birthDate" readonly>
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Dirección</mat-label>
          <input matInput formControlName="address" placeholder="Dirección de residencia">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width" *ngIf="isEdit">
          <mat-label>Estado</mat-label>
          <mat-select formControlName="status">
            <mat-option *ngFor="let status of statusOptions" [value]="status.value">
              {{status.label}}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button 
        mat-raised-button 
        color="primary" 
        (click)="onSubmit()" 
        [disabled]="personForm.invalid || loading">
        <span *ngIf="loading">Guardando...</span>
        <span *ngIf="!loading">{{isEdit ? 'Actualizar' : 'Crear'}}</span>
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .person-form {
      min-width: 500px;
      padding: 20px 0;
      background: linear-gradient(135deg, rgba(103, 58, 183, 0.02), rgba(156, 39, 176, 0.02));
      border-radius: 12px;
      margin: 0 -24px;
      padding: 24px;
    }

    .form-row {
      display: flex;
      gap: 20px;
      width: 100%;
    }

    .full-width {
      width: 100%;
      margin-bottom: 20px;
    }

    .half-width {
      flex: 1;
      margin-bottom: 20px;
    }

    mat-dialog-content {
      max-height: 70vh;
      overflow-y: auto;
      padding: 0 !important;
    }

    mat-dialog-title {
      background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
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
      .form-row {
        flex-direction: column;
        gap: 0;
      }
      
      .half-width {
        width: 100%;
      }

      .person-form {
        min-width: unset;
      }
    }
  `]
})
export class PersonFormDialogComponent implements OnInit {
  personForm!: FormGroup;
  loading = false;
  isEdit = false;

  statusOptions = [
    { value: PersonStatus.ACTIVO, label: 'Activo' },
    { value: PersonStatus.INACTIVO, label: 'Inactivo' }
  ];

  constructor(
    private fb: FormBuilder,
    private personService: PersonService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<PersonFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PersonDTO | null
  ) {
    this.isEdit = !!data;
  }

  ngOnInit(): void {
    this.initForm();
    if (this.data) {
      this.populateForm(this.data);
    }
  }

  private initForm(): void {
    this.personForm = this.fb.group({
      name: ['', this.isEdit ? [] : [Validators.required]],
      surname: [''],
      email: ['', [Validators.email]],
      phoneNumber: [''],
      birthDate: [''],
      address: [''],
      status: [PersonStatus.ACTIVO]
    });
  }

  private populateForm(person: PersonDTO): void {
    this.personForm.patchValue({
      name: person.name,
      surname: person.surname,
      email: person.email,
      phoneNumber: person.phoneNumber,
      birthDate: person.birthDate ? new Date(person.birthDate) : null,
      status: person.status
    });
  }

  onSubmit(): void {
    if (this.personForm.valid) {
      this.loading = true;
      const formData = this.personForm.value;
      
      if (this.isEdit && this.data) {
        const updateData: EditPersonDTO = {
          id: this.data.id,
          ...formData,
          birthDate: formData.birthDate ? formData.birthDate.toISOString().split('T')[0] : undefined
        };

        this.personService.updatePerson(updateData).subscribe({
          next: () => {
            this.loading = false;
            this.snackBar.open('Persona actualizada correctamente', 'Cerrar', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.dialogRef.close(true);
          },
          error: () => {
            this.loading = false;
            this.snackBar.open('Error al actualizar persona', 'Cerrar', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}

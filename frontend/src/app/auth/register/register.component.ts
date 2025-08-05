import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PersonService } from '../../core/services/person.service';
import { AddPersonDTO, DocumentType } from '../../core/models/person.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
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
    <div class="register-container">
      <mat-card class="register-card">
        <mat-card-header>
          <mat-card-title>Crear Cuenta</mat-card-title>
          <mat-card-subtitle>Únete a nuestro sistema de gestión crediticia</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Nombre *</mat-label>
                <input matInput formControlName="name" placeholder="Ingrese su nombre">
                <mat-error *ngIf="registerForm.get('name')?.hasError('required')">
                  El nombre es requerido
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Apellido</mat-label>
                <input matInput formControlName="surname" placeholder="Ingrese su apellido">
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Tipo de Documento *</mat-label>
                <mat-select formControlName="documentType">
                  <mat-option *ngFor="let type of documentTypes" [value]="type.value">
                    {{type.label}}
                  </mat-option>
                </mat-select>
                <mat-error *ngIf="registerForm.get('documentType')?.hasError('required')">
                  El tipo de documento es requerido
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Documento *</mat-label>
                <input matInput formControlName="document" placeholder="Número de documento">
                <mat-error *ngIf="registerForm.get('document')?.hasError('required')">
                  El documento es requerido
                </mat-error>
                <mat-error *ngIf="registerForm.get('document')?.hasError('pattern')">
                  Formato inválido (6-12 caracteres alfanuméricos)
                </mat-error>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email *</mat-label>
              <input matInput type="email" formControlName="email" placeholder="correo@ejemplo.com">
              <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
                El email es requerido
              </mat-error>
              <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
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

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Contraseña *</mat-label>
              <input matInput type="password" formControlName="password" placeholder="Mínimo 6 caracteres">
              <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
                La contraseña es requerida
              </mat-error>
              <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
                La contraseña debe tener mínimo 6 caracteres
              </mat-error>
            </mat-form-field>

            <div class="button-container">
              <button 
                mat-raised-button 
                color="primary" 
                type="submit" 
                [disabled]="registerForm.invalid || loading"
                class="register-button">
                <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
                <span *ngIf="!loading">Registrarse</span>
              </button>
            </div>
          </form>
        </mat-card-content>

        <mat-card-actions>
          <div style="width: 100%; text-align: center;">
            <button mat-button color="accent" (click)="goToLogin()">
              ¿Ya tienes cuenta? Inicia sesión
            </button>
          </div>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .register-card {
      width: 100%;
      max-width: 600px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      border-radius: 16px;
    }

    .form-row {
      display: flex;
      gap: 16px;
      width: 100%;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .half-width {
      flex: 1;
      margin-bottom: 16px;
    }

    .button-container {
      text-align: center;
      margin-top: 20px;
    }

    .register-button {
      width: 100%;
      height: 48px;
      font-size: 16px;
    }

    mat-card-header {
      text-align: center;
      margin-bottom: 20px;
    }

    mat-card-title {
      color: var(--primary-color);
      font-size: 24px;
      font-weight: 600;
    }

    mat-card-subtitle {
      color: var(--text-secondary);
      font-size: 14px;
    }

    @media (max-width: 600px) {
      .form-row {
        flex-direction: column;
        gap: 0;
      }
      
      .half-width {
        width: 100%;
      }
    }
  `]
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  documentTypes = [
    { value: DocumentType.CC, label: 'Cédula de Ciudadanía' },
    { value: DocumentType.TI, label: 'Tarjeta de Identidad' },
    { value: DocumentType.CE, label: 'Cédula de Extranjería' },
    { value: DocumentType.PA, label: 'Pasaporte' }
  ];

  constructor(
    private fb: FormBuilder,
    private personService: PersonService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      surname: [''],
      documentType: ['', [Validators.required]],
      document: ['', [Validators.required, Validators.pattern('^[A-Z0-9]{6,12}$')]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      birthDate: [''],
      address: [''],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      const formData = this.registerForm.value;
      
      const personData: AddPersonDTO = {
        ...formData,
        birthDate: formData.birthDate ? formData.birthDate.toISOString().split('T')[0] : undefined
      };

      this.personService.register(personData).subscribe({
        next: (response) => {
          this.loading = false;
          this.snackBar.open('Registro exitoso. Ya puedes iniciar sesión.', 'Cerrar', {
            duration: 4000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          this.loading = false;
          let errorMessage = 'Error al registrarse. Intente nuevamente.';
          
          if (error.status === 400) {
            errorMessage = 'Datos inválidos. Verifique la información ingresada.';
          }
          
          this.snackBar.open(errorMessage, 'Cerrar', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}

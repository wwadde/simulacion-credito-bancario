import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth.service';
import { PersonService } from '../../core/services/person.service';
import { LoginRequest } from '../../core/models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Iniciar Sesión</mat-card-title>
          <mat-card-subtitle>Gestión de Crédito Bancario</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Documento</mat-label>
              <input matInput formControlName="document" placeholder="Ingrese su documento">
              <mat-error *ngIf="loginForm.get('document')?.hasError('required')">
                El documento es requerido
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Contraseña</mat-label>
              <input matInput type="password" formControlName="password" placeholder="Ingrese su contraseña">
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                La contraseña es requerida
              </mat-error>
            </mat-form-field>

            <div class="button-container">
              <button 
                mat-raised-button 
                color="primary" 
                type="submit" 
                [disabled]="loginForm.invalid || loading"
                class="login-button">
                <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
                <span *ngIf="!loading">Ingresar</span>
              </button>
            </div>
          </form>
        </mat-card-content>

        <mat-card-actions>
          <div style="width: 100%; text-align: center;">
            <button mat-button color="accent" (click)="goToRegister()">
              ¿No tienes cuenta? Regístrate
            </button>
          </div>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      border-radius: 16px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .button-container {
      text-align: center;
      margin-top: 20px;
    }

    .login-button {
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
  `]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private personService: PersonService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      document: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      const credentials: LoginRequest = this.loginForm.value;

      console.log('Attempting login with credentials:', credentials);

      this.authService.login(credentials).subscribe({
        next: (response) => {
          console.log('Login response:', response);
          this.loading = false;
          if (response.accessToken) {
            console.log('Token received, session established');
            this.snackBar.open('Inicio de sesión exitoso', 'Cerrar', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            
            // Navegar al dashboard usando el router de Angular
            console.log('Navigating to dashboard...');
            this.router.navigate(['/dashboard']).then(
              (success) => {
                console.log('Navigation successful:', success);
              },
              (error) => {
                console.error('Navigation failed:', error);
              }
            );
          } else {
            console.error('No access token in response');
            this.snackBar.open('Error: No se recibió token de acceso', 'Cerrar', {
              duration: 4000,
              panelClass: ['error-snackbar']
            });
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          this.loading = false;
          this.snackBar.open('Error al iniciar sesión. Verifique sus credenciales.', 'Cerrar', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}

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
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
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
    MatProgressSpinnerModule,
    MatIconModule,
    MatRippleModule
  ],
  template: `
    <div class="login-container">
      <div class="background-decoration">
        <div class="floating-shape shape-1"></div>
        <div class="floating-shape shape-2"></div>
        <div class="floating-shape shape-3"></div>
      </div>
      
      <div class="login-wrapper">
        <div class="logo-section">
          <div class="logo-icon">
            <mat-icon>account_balance</mat-icon>
          </div>
          <h1 class="app-title">Gestión Crediticia</h1>
          <p class="app-subtitle">Sistema Bancario Integral</p>
        </div>

        <mat-card class="login-card">
          <mat-card-content>
            <div class="welcome-section">
              <h2 class="welcome-title">¡Bienvenido!</h2>
              <p class="welcome-subtitle">Ingresa tus credenciales para continuar</p>
            </div>

            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Documento de Identidad</mat-label>
                <mat-icon matPrefix>person</mat-icon>
                <input 
                  matInput 
                  formControlName="document" 
                  placeholder="Ej: 12345678"
                  autocomplete="username">
                <mat-error *ngIf="loginForm.get('document')?.hasError('required')">
                  El documento es requerido
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Contraseña</mat-label>
                <mat-icon matPrefix>lock</mat-icon>
                <input 
                  matInput 
                  [type]="hidePassword ? 'password' : 'text'" 
                  formControlName="password" 
                  placeholder="Ingresa tu contraseña"
                  autocomplete="current-password">
                <mat-icon 
                  matSuffix 
                  (click)="hidePassword = !hidePassword"
                  class="password-toggle">
                  {{hidePassword ? 'visibility_off' : 'visibility'}}
                </mat-icon>
                <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                  La contraseña es requerida
                </mat-error>
              </mat-form-field>

              <button 
                mat-raised-button 
                color="primary" 
                type="submit" 
                [disabled]="loginForm.invalid || loading"
                class="login-button"
                matRipple>
                <span *ngIf="!loading" class="button-content">
                  <mat-icon>login</mat-icon>
                  Iniciar Sesión
                </span>
                <mat-spinner *ngIf="loading" diameter="20" class="login-spinner"></mat-spinner>
              </button>
            </form>
          </mat-card-content>

          <mat-card-actions class="card-actions">
            <button 
              mat-button 
              color="accent" 
              (click)="goToRegister()"
              class="register-button"
              matRipple>
              <mat-icon>person_add</mat-icon>
              ¿No tienes cuenta? Regístrate aquí
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      position: relative;
      overflow: hidden;
    }

    .background-decoration {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    }

    .floating-shape {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      animation: float 6s ease-in-out infinite;
    }

    .shape-1 {
      width: 80px;
      height: 80px;
      top: 20%;
      left: 10%;
      animation-delay: 0s;
    }

    .shape-2 {
      width: 120px;
      height: 120px;
      top: 60%;
      right: 15%;
      animation-delay: 2s;
    }

    .shape-3 {
      width: 60px;
      height: 60px;
      bottom: 20%;
      left: 20%;
      animation-delay: 4s;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(10deg); }
    }

    .login-wrapper {
      position: relative;
      z-index: 2;
      width: 100%;
      max-width: 450px;
      animation: slideInUp 0.8s ease-out;
    }

    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(50px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .logo-section {
      text-align: center;
      margin-bottom: 2rem;
      color: white;
    }

    .logo-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 1rem;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
      border: 2px solid rgba(255, 255, 255, 0.3);
      animation: pulse 2s infinite;
    }

    .logo-icon mat-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      color: white;
    }

    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }

    .app-title {
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
      font-weight: 700;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      letter-spacing: -0.5px;
    }

    .app-subtitle {
      margin: 0;
      font-size: 1rem;
      opacity: 0.9;
      font-weight: 300;
    }

    .login-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 
        0 20px 60px rgba(0, 0, 0, 0.1),
        0 8px 25px rgba(0, 0, 0, 0.05);
      padding: 0;
      overflow: hidden;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .login-card:hover {
      transform: translateY(-5px);
      box-shadow: 
        0 25px 70px rgba(0, 0, 0, 0.15),
        0 10px 30px rgba(0, 0, 0, 0.08);
    }

    mat-card-content {
      padding: 2.5rem !important;
    }

    .welcome-section {
      text-align: center;
      margin-bottom: 2rem;
    }

    .welcome-title {
      margin: 0 0 0.5rem 0;
      font-size: 1.75rem;
      font-weight: 600;
      color: #333;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .welcome-subtitle {
      margin: 0;
      color: #666;
      font-size: 0.95rem;
      font-weight: 400;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-field {
      width: 100%;
      transition: all 0.3s ease;
    }

    .form-field:focus-within {
      transform: translateY(-2px);
    }

    .form-field .mat-mdc-form-field-outline {
      border-radius: 12px;
    }

    .form-field .mat-mdc-form-field-outline-thick {
      border-width: 2px;
    }

    .form-field mat-icon[matPrefix] {
      color: #667eea;
      margin-right: 12px;
    }

    .password-toggle {
      cursor: pointer;
      transition: color 0.3s ease;
    }

    .password-toggle:hover {
      color: #667eea !important;
    }

    .login-button {
      width: 100%;
      height: 56px;
      font-size: 1.1rem;
      font-weight: 600;
      border-radius: 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      color: white;
      text-transform: none;
      letter-spacing: 0.5px;
      transition: all 0.3s ease;
      margin-top: 1rem;
      position: relative;
      overflow: hidden;
    }

    .login-button:not(:disabled):hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }

    .login-button:disabled {
      background: #ccc;
      color: #666;
    }

    .button-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .login-spinner {
      color: white;
    }

    .card-actions {
      padding: 0 2.5rem 2rem !important;
      justify-content: center;
    }

    .register-button {
      color: #667eea;
      font-weight: 500;
      text-transform: none;
      border-radius: 12px;
      padding: 12px 24px;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .register-button:hover {
      background: rgba(102, 126, 234, 0.1);
      transform: translateY(-1px);
    }

    /* Responsive design */
    @media (max-width: 600px) {
      .login-container {
        padding: 15px;
      }

      .app-title {
        font-size: 1.5rem;
      }

      .app-subtitle {
        font-size: 0.9rem;
      }

      mat-card-content {
        padding: 2rem !important;
      }

      .welcome-title {
        font-size: 1.5rem;
      }

      .login-button {
        height: 52px;
        font-size: 1rem;
      }

      .card-actions {
        padding: 0 2rem 1.5rem !important;
      }
    }

    /* Material Design form field customization */
    .mat-mdc-form-field-appearance-outline .mat-mdc-form-field-outline {
      border-radius: 12px;
    }

    .mat-mdc-form-field-appearance-outline.mat-focused .mat-mdc-form-field-outline-thick {
      color: #667eea;
    }

    .mat-mdc-form-field-appearance-outline.mat-focused .mat-mdc-floating-label {
      color: #667eea;
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  hidePassword = true;

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

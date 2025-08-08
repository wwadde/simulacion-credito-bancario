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
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { PersonService } from '../../core/services/person.service';
import { AddPersonDTO, DocumentType } from '../../core/models/person.model';

// Custom Date Adapter para permitir fechas de nacimiento más antiguas
export class BirthDateAdapter extends NativeDateAdapter {
  override getYearName(date: Date): string {
    return String(date.getFullYear());
  }

  override getFirstDayOfWeek(): number {
    return 1; // Lunes como primer día de la semana
  }
}

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
    MatProgressSpinnerModule,
    MatIconModule,
    MatRippleModule
  ],
  providers: [
    { provide: DateAdapter, useClass: BirthDateAdapter },
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
    <div class="register-container">
      <div class="background-decoration">
        <div class="floating-shape shape-1"></div>
        <div class="floating-shape shape-2"></div>
        <div class="floating-shape shape-3"></div>
        <div class="floating-shape shape-4"></div>
      </div>
      
      <div class="register-wrapper">
        <div class="logo-section">
          <div class="logo-icon">
            <mat-icon>person_add</mat-icon>
          </div>
          <h1 class="app-title">Crear Nueva Cuenta</h1>
          <p class="app-subtitle">Únete al Sistema Bancario Integral</p>
        </div>

        <mat-card class="register-card">
          <mat-card-content>
            <div class="welcome-section">
              <h2 class="welcome-title">¡Bienvenido!</h2>
              <p class="welcome-subtitle">Completa tus datos para crear tu cuenta</p>
            </div>

            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
              
              <!-- Información Personal -->
              <div class="section-header">
                <mat-icon>person</mat-icon>
                <span>Información Personal</span>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field half-width">
                  <mat-label>Nombre *</mat-label>
                  <mat-icon matPrefix>badge</mat-icon>
                  <input 
                    matInput 
                    formControlName="name" 
                    placeholder="Tu nombre"
                    autocomplete="given-name">
                  <mat-error *ngIf="registerForm.get('name')?.hasError('required')">
                    El nombre es requerido
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="form-field half-width">
                  <mat-label>Apellido</mat-label>
                  <mat-icon matPrefix>badge</mat-icon>
                  <input 
                    matInput 
                    formControlName="surname" 
                    placeholder="Tu apellido"
                    autocomplete="family-name">
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field half-width">
                  <mat-label>Tipo de Documento *</mat-label>
                  <mat-icon matPrefix>description</mat-icon>
                  <mat-select formControlName="documentType">
                    <mat-option *ngFor="let type of documentTypes" [value]="type.value">
                      {{type.label}}
                    </mat-option>
                  </mat-select>
                  <mat-error *ngIf="registerForm.get('documentType')?.hasError('required')">
                    El tipo de documento es requerido
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="form-field half-width">
                  <mat-label>Número de Documento *</mat-label>
                  <mat-icon matPrefix>fingerprint</mat-icon>
                  <input 
                    matInput 
                    formControlName="document" 
                    placeholder="Ej: 12345678"
                    autocomplete="off">
                  <mat-error *ngIf="registerForm.get('document')?.hasError('required')">
                    El documento es requerido
                  </mat-error>
                  <mat-error *ngIf="registerForm.get('document')?.hasError('pattern')">
                    Formato inválido (6-12 caracteres alfanuméricos)
                  </mat-error>
                </mat-form-field>
              </div>

              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Fecha de Nacimiento</mat-label>
                <mat-icon matPrefix>cake</mat-icon>
                <input 
                  matInput 
                  [matDatepicker]="picker" 
                  formControlName="birthDate" 
                  [max]="maxBirthDate"
                  [min]="minBirthDate"
                  placeholder="Selecciona tu fecha de nacimiento"
                  readonly>
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker startView="multi-year" [startAt]="defaultBirthDate"></mat-datepicker>
              </mat-form-field>

              <!-- Información de Contacto -->
              <div class="section-header">
                <mat-icon>contact_mail</mat-icon>
                <span>Información de Contacto</span>
              </div>

              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Correo Electrónico *</mat-label>
                <mat-icon matPrefix>email</mat-icon>
                <input 
                  matInput 
                  type="email" 
                  formControlName="email" 
                  placeholder="correo@ejemplo.com"
                  autocomplete="email">
                <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
                  El email es requerido
                </mat-error>
                <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
                  Ingrese un email válido
                </mat-error>
              </mat-form-field>

              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field half-width">
                  <mat-label>Teléfono</mat-label>
                  <mat-icon matPrefix>phone</mat-icon>
                  <input 
                    matInput 
                    formControlName="phoneNumber" 
                    placeholder="Ej: 3001234567"
                    autocomplete="tel">
                </mat-form-field>

                <mat-form-field appearance="outline" class="form-field half-width">
                  <mat-label>Dirección</mat-label>
                  <mat-icon matPrefix>home</mat-icon>
                  <input 
                    matInput 
                    formControlName="address" 
                    placeholder="Tu dirección"
                    autocomplete="street-address">
                </mat-form-field>
              </div>

              <!-- Seguridad -->
              <div class="section-header">
                <mat-icon>security</mat-icon>
                <span>Seguridad</span>
              </div>

              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Contraseña *</mat-label>
                <mat-icon matPrefix>lock</mat-icon>
                <input 
                  matInput 
                  [type]="hidePassword ? 'password' : 'text'" 
                  formControlName="password" 
                  placeholder="Mínimo 6 caracteres"
                  autocomplete="new-password">
                <mat-icon 
                  matSuffix 
                  (click)="hidePassword = !hidePassword"
                  class="password-toggle">
                  {{hidePassword ? 'visibility_off' : 'visibility'}}
                </mat-icon>
                <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
                  La contraseña es requerida
                </mat-error>
                <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
                  La contraseña debe tener mínimo 6 caracteres
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Confirmar Contraseña *</mat-label>
                <mat-icon matPrefix>lock_outline</mat-icon>
                <input 
                  matInput 
                  [type]="hideConfirmPassword ? 'password' : 'text'" 
                  formControlName="confirmPassword" 
                  placeholder="Confirma tu contraseña"
                  autocomplete="new-password">
                <mat-icon 
                  matSuffix 
                  (click)="hideConfirmPassword = !hideConfirmPassword"
                  class="password-toggle">
                  {{hideConfirmPassword ? 'visibility_off' : 'visibility'}}
                </mat-icon>
                <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('required')">
                  Debe confirmar la contraseña
                </mat-error>
                <mat-error *ngIf="registerForm.hasError('passwordMismatch') && registerForm.get('confirmPassword')?.touched">
                  Las contraseñas no coinciden
                </mat-error>
              </mat-form-field>

              <!-- Indicador de validación de contraseñas -->
              <div class="password-validation-indicator" 
                   *ngIf="registerForm.get('password')?.value && registerForm.get('confirmPassword')?.value">
                <div class="validation-item" 
                     [class.valid]="!registerForm.hasError('passwordMismatch')"
                     [class.invalid]="registerForm.hasError('passwordMismatch')">
                  <mat-icon>{{!registerForm.hasError('passwordMismatch') ? 'check_circle' : 'cancel'}}</mat-icon>
                  <span>Las contraseñas coinciden</span>
                </div>
                <div class="validation-item" 
                     [class.valid]="registerForm.get('password')?.value?.length >= 6"
                     [class.invalid]="registerForm.get('password')?.value?.length < 6">
                  <mat-icon>{{registerForm.get('password')?.value?.length >= 6 ? 'check_circle' : 'cancel'}}</mat-icon>
                  <span>Mínimo 6 caracteres</span>
                </div>
              </div>

              <button 
                mat-raised-button 
                color="primary" 
                type="submit" 
                [disabled]="registerForm.invalid || loading"
                class="register-button"
                matRipple>
                <span *ngIf="!loading" class="button-content">
                  <mat-icon>person_add</mat-icon>
                  Crear Cuenta
                </span>
                <mat-spinner *ngIf="loading" diameter="20" class="register-spinner"></mat-spinner>
              </button>
            </form>
          </mat-card-content>

          <mat-card-actions class="card-actions">
            <button 
              mat-button 
              color="accent" 
              (click)="goToLogin()"
              class="login-button"
              matRipple>
              <mat-icon>login</mat-icon>
              ¿Ya tienes cuenta? Inicia sesión aquí
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
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
      animation: float 8s ease-in-out infinite;
    }

    .shape-1 {
      width: 100px;
      height: 100px;
      top: 15%;
      left: 8%;
      animation-delay: 0s;
    }

    .shape-2 {
      width: 80px;
      height: 80px;
      top: 70%;
      right: 10%;
      animation-delay: 2s;
    }

    .shape-3 {
      width: 60px;
      height: 60px;
      bottom: 15%;
      left: 20%;
      animation-delay: 4s;
    }

    .shape-4 {
      width: 90px;
      height: 90px;
      top: 40%;
      right: 25%;
      animation-delay: 6s;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
      33% { transform: translateY(-15px) rotate(10deg) scale(1.1); }
      66% { transform: translateY(10px) rotate(-5deg) scale(0.9); }
    }

    .register-wrapper {
      position: relative;
      z-index: 2;
      width: 100%;
      max-width: 650px;
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
      font-size: 1.9rem;
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

    .register-card {
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

    .register-card:hover {
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

    .register-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #667eea;
      font-weight: 600;
      font-size: 1.1rem;
      margin: 1.5rem 0 1rem 0;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid rgba(102, 126, 234, 0.2);
    }

    .section-header:first-of-type {
      margin-top: 0;
    }

    .section-header mat-icon {
      font-size: 22px;
      width: 22px;
      height: 22px;
    }

    .form-row {
      display: flex;
      gap: 1rem;
      width: 100%;
    }

    .form-field {
      transition: all 0.3s ease;
      margin-bottom: 0.5rem;
    }

    .form-field:focus-within {
      transform: translateY(-2px);
    }

    .form-field.half-width {
      flex: 1;
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

    .register-button {
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
      margin-top: 1.5rem;
      position: relative;
      overflow: hidden;
    }

    .register-button:not(:disabled):hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }

    .register-button:disabled {
      background: #ccc;
      color: #666;
    }

    .button-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .register-spinner {
      color: white;
    }

    .password-validation-indicator {
      margin: 0.5rem 0 1rem 0;
      padding: 1rem;
      background: rgba(248, 249, 250, 0.8);
      border-radius: 12px;
      border: 1px solid rgba(0, 0, 0, 0.05);
    }

    .validation-item {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      transition: all 0.3s ease;
    }

    .validation-item:last-child {
      margin-bottom: 0;
    }

    .validation-item.valid {
      color: #4caf50;
    }

    .validation-item.valid mat-icon {
      color: #4caf50;
    }

    .validation-item.invalid {
      color: #f44336;
    }

    .validation-item.invalid mat-icon {
      color: #f44336;
    }

    .validation-item mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .card-actions {
      padding: 0 2.5rem 2rem !important;
      justify-content: center;
    }

    .login-button {
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

    .login-button:hover {
      background: rgba(102, 126, 234, 0.1);
      transform: translateY(-1px);
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .register-container {
        padding: 15px;
      }

      .app-title {
        font-size: 1.6rem;
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

      .form-row {
        flex-direction: column;
        gap: 0;
      }

      .form-field.half-width {
        width: 100%;
      }

      .register-button {
        height: 52px;
        font-size: 1rem;
      }

      .card-actions {
        padding: 0 2rem 1.5rem !important;
      }

      .section-header {
        font-size: 1rem;
      }
    }

    @media (max-width: 480px) {
      .register-container {
        padding: 10px;
      }

      .logo-icon {
        width: 70px;
        height: 70px;
      }

      .logo-icon mat-icon {
        font-size: 35px;
        width: 35px;
        height: 35px;
      }

      .app-title {
        font-size: 1.4rem;
      }

      mat-card-content {
        padding: 1.5rem !important;
      }

      .welcome-title {
        font-size: 1.3rem;
      }

      .section-header {
        font-size: 0.95rem;
        margin: 1rem 0 0.8rem 0;
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

    /* Select dropdown styling */
    .mat-mdc-select-arrow {
      color: #667eea;
    }

    /* Date picker styling */
    .mat-datepicker-toggle {
      color: #667eea;
    }
  `]
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  hidePassword = true;
  hideConfirmPassword = true;
  maxBirthDate = new Date(); // Fecha máxima es hoy (para evitar fechas futuras)
  minBirthDate = new Date(1900, 0, 1); // Fecha mínima: 1 enero 1900
  defaultBirthDate = new Date(1990, 0, 1); // Fecha por defecto: 1990 para facilitar navegación
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
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  // Validador personalizado para confirmar que las contraseñas coincidan
  private passwordMatchValidator(group: FormGroup): {[key: string]: any} | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');
    
    if (!password || !confirmPassword) {
      return null;
    }
    
    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      const formData = this.registerForm.value;
      
      // Remover el campo confirmPassword antes de enviar al servidor
      const { confirmPassword, ...dataToSend } = formData;
      
      const personData: AddPersonDTO = {
        ...dataToSend,
        birthDate: dataToSend.birthDate ? dataToSend.birthDate.toISOString().split('T')[0] : undefined
      };

      this.personService.register(personData).subscribe({
        next: (response) => {
          this.loading = false;
          console.log('Respuesta del servidor:', response); // Para debugging
          this.snackBar.open(response || 'Registro exitoso. Ya puedes iniciar sesión.', 'Cerrar', {
            duration: 4000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          this.loading = false;
          console.error('Error en registro:', error); // Para debugging
          let errorMessage = 'Error al registrarse. Intente nuevamente.';
          
          if (error.status === 400) {
            errorMessage = 'Datos inválidos. Verifique la información ingresada.';
          } else if (error.status === 409) {
            errorMessage = 'Ya existe una persona con este email o documento.';
          } else if (error.error && typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.message) {
            errorMessage = error.message;
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

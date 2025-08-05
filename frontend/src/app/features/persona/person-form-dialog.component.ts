import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule, MatDatepicker } from '@angular/material/datepicker';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter, MAT_NATIVE_DATE_FORMATS } from '@angular/material/core';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { PersonService } from '../../core/services/person.service';
import { PersonDTO, EditPersonDTO, DocumentType, PersonStatus, AddPersonDTO } from '../../core/models/person.model';

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
    MatProgressSpinnerModule,
    MatIconModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS }
  ],
  template: `
    <div class="dialog-header">
      <mat-icon class="dialog-icon">{{isEdit ? 'edit' : 'person_add'}}</mat-icon>
      <h2 mat-dialog-title>{{isEdit ? 'Editar' : 'Nueva'}} Persona</h2>
    </div>
    
    <mat-dialog-content>
      <form [formGroup]="personForm" class="person-form">
        <div class="form-section">
          <h3 class="section-title">
            <mat-icon>person</mat-icon>
            Información Personal
          </h3>
          
          <div class="form-row">
            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Nombre *</mat-label>
              <input matInput formControlName="name" placeholder="Ingrese el nombre">
              <mat-icon matSuffix>person</mat-icon>
              <mat-error *ngIf="personForm.get('name')?.hasError('required')">
                El nombre es requerido
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Apellido</mat-label>
              <input matInput formControlName="surname" placeholder="Ingrese el apellido">
              <mat-icon matSuffix>person_outline</mat-icon>
            </mat-form-field>
          </div>
        </div>

        <div class="form-section">
          <h3 class="section-title">
            <mat-icon>badge</mat-icon>
            Identificación
          </h3>
          
          <div class="form-row">
            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Tipo de Documento *</mat-label>
              <mat-select formControlName="documentType">
                <mat-option *ngFor="let docType of documentTypes" [value]="docType.value">
                  {{docType.label}}
                </mat-option>
              </mat-select>
              <mat-icon matSuffix>assignment_ind</mat-icon>
              <mat-error *ngIf="personForm.get('documentType')?.hasError('required')">
                El tipo de documento es requerido
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Documento *</mat-label>
              <input matInput formControlName="document" placeholder="Número de documento">
              <mat-icon matSuffix>credit_card</mat-icon>
              <mat-error *ngIf="personForm.get('document')?.hasError('required')">
                El documento es requerido
              </mat-error>
            </mat-form-field>
          </div>
        </div>

        <div class="form-section">
          <h3 class="section-title">
            <mat-icon>contact_mail</mat-icon>
            Información de Contacto
          </h3>
          
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email *</mat-label>
            <input matInput type="email" formControlName="email" placeholder="correo@ejemplo.com">
            <mat-icon matSuffix>email</mat-icon>
            <mat-error *ngIf="personForm.get('email')?.hasError('required')">
              El email es requerido
            </mat-error>
            <mat-error *ngIf="personForm.get('email')?.hasError('email')">
              Ingrese un email válido
            </mat-error>
          </mat-form-field>

          <div class="form-row">
            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Teléfono</mat-label>
              <input matInput formControlName="phoneNumber" placeholder="Número de teléfono">
              <mat-icon matSuffix>phone</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Fecha de Nacimiento</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="birthDate" 
                     readonly (click)="openDatePicker(picker)">
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Dirección</mat-label>
            <input matInput formControlName="address" placeholder="Dirección de residencia">
            <mat-icon matSuffix>location_on</mat-icon>
          </mat-form-field>
        </div>

        <div class="form-section" *ngIf="!isEdit">
          <h3 class="section-title">
            <mat-icon>security</mat-icon>
            Seguridad
          </h3>
          
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Contraseña *</mat-label>
            <input matInput [type]="hidePassword ? 'password' : 'text'" 
                   formControlName="password" placeholder="Contraseña">
            <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
              <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
            </button>
            <mat-error *ngIf="personForm.get('password')?.hasError('required')">
              La contraseña es requerida
            </mat-error>
            <mat-error *ngIf="personForm.get('password')?.hasError('minlength')">
              La contraseña debe tener al menos 6 caracteres
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Confirmar Contraseña *</mat-label>
            <input matInput [type]="hideConfirmPassword ? 'password' : 'text'" 
                   formControlName="confirmPassword" placeholder="Confirme su contraseña">
            <button mat-icon-button matSuffix (click)="hideConfirmPassword = !hideConfirmPassword" type="button">
              <mat-icon>{{hideConfirmPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
            </button>
            <mat-error *ngIf="personForm.get('confirmPassword')?.hasError('required')">
              La confirmación de contraseña es requerida
            </mat-error>
            <mat-error *ngIf="personForm.get('confirmPassword')?.hasError('passwordMismatch')">
              Las contraseñas no coinciden
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-section" *ngIf="isEdit">
          <h3 class="section-title">
            <mat-icon>toggle_on</mat-icon>
            Estado
          </h3>
          
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Estado</mat-label>
            <mat-select formControlName="status">
              <mat-option *ngFor="let status of statusOptions" [value]="status.value">
                {{status.label}}
              </mat-option>
            </mat-select>
            <mat-icon matSuffix>assignment_turned_in</mat-icon>
          </mat-form-field>
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
        [disabled]="personForm.invalid || loading"
        class="submit-btn">
        <mat-icon *ngIf="!loading">{{isEdit ? 'save' : 'person_add'}}</mat-icon>
        <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
        <span *ngIf="loading">Guardando...</span>
        <span *ngIf="!loading">{{isEdit ? 'Actualizar' : 'Crear'}}</span>
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 24px 0 16px;
      background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
      margin: -24px -24px 24px -24px;
      border-radius: 16px 16px 0 0;
    }

    .dialog-icon {
      font-size: 32px;
      color: white;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      padding: 8px;
    }

    .person-form {
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
      background: linear-gradient(135deg, 
        rgba(103, 58, 183, 0.02), 
        rgba(156, 39, 176, 0.02));
      width: 100%;
      box-sizing: border-box;
    }

    /* Dialog container width control */
    :host ::ng-deep .mat-mdc-dialog-container {
      max-width: 90vw !important;
      width: auto !important;
      min-width: 320px !important;
    }

    :host ::ng-deep .mat-mdc-dialog-surface {
      max-width: 650px !important;
      width: auto !important;
      min-width: 320px !important;
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
      border: 2px solid var(--primary-color);
      color: var(--primary-color);
      transition: all 0.3s ease;
    }

    .cancel-btn:hover {
      background: var(--primary-color);
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(103, 58, 183, 0.3);
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
    }

    /* Material form field customizations */
    .mat-mdc-form-field {
      transition: all 0.3s ease;
    }

    .mat-mdc-form-field:hover {
      transform: translateY(-1px);
    }

    .mat-mdc-form-field.mat-focused {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(103, 58, 183, 0.15);
    }

    .mat-mdc-text-field-wrapper {
      border-radius: 8px !important;
    }

    .mat-mdc-form-field-icon-suffix mat-icon {
      color: var(--primary-color);
      opacity: 0.7;
    }

    .mat-mdc-form-field-focus-overlay {
      background-color: var(--primary-color) !important;
      opacity: 0.05 !important;
    }

    /* Default theme handling */
    .mat-mdc-text-field-wrapper {
      background-color: var(--surface-color) !important;
    }

    .mat-mdc-form-field .mat-mdc-input-element {
      color: var(--text-color) !important;
    }

    .mat-mdc-form-field .mdc-floating-label {
      color: var(--text-secondary) !important;
    }

    /* Dark theme adjustments */
    .dark-theme .form-section {
      background: var(--surface-dark);
      border-color: var(--border-dark);
    }

    .dark-theme .mat-mdc-text-field-wrapper {
      background-color: var(--surface-dark) !important;
    }

    .dark-theme .section-title {
      color: var(--primary-light);
      border-bottom-color: var(--primary-light);
    }

    .dark-theme .section-title mat-icon {
      color: var(--primary-light);
    }

    /* Light theme specific fixes - applied when light theme is active */
    :host-context(.light-theme) .form-section,
    :host-context(body.light-theme) .form-section {
      background: #ffffff !important;
      border: 1px solid #e0e0e0 !important;
    }

    :host-context(.light-theme) .section-title,
    :host-context(body.light-theme) .section-title {
      color: #673ab7 !important;
      border-bottom-color: #673ab7 !important;
    }

    :host-context(.light-theme) .section-title mat-icon,
    :host-context(body.light-theme) .section-title mat-icon {
      color: #673ab7 !important;
    }

    /* Light theme form fields with enhanced specificity */
    :host-context(.light-theme) .mat-mdc-text-field-wrapper,
    :host-context(body.light-theme) .mat-mdc-text-field-wrapper {
      background-color: #ffffff !important;
    }

    :host-context(.light-theme) .mat-mdc-form-field .mdc-notched-outline__leading,
    :host-context(.light-theme) .mat-mdc-form-field .mdc-notched-outline__trailing,
    :host-context(.light-theme) .mat-mdc-form-field .mdc-notched-outline__notch,
    :host-context(body.light-theme) .mat-mdc-form-field .mdc-notched-outline__leading,
    :host-context(body.light-theme) .mat-mdc-form-field .mdc-notched-outline__trailing,
    :host-context(body.light-theme) .mat-mdc-form-field .mdc-notched-outline__notch {
      border-color: rgba(0, 0, 0, 0.42) !important;
      border-width: 1px !important;
    }

    :host-context(.light-theme) .mat-mdc-form-field:hover .mdc-notched-outline__leading,
    :host-context(.light-theme) .mat-mdc-form-field:hover .mdc-notched-outline__trailing,
    :host-context(.light-theme) .mat-mdc-form-field:hover .mdc-notched-outline__notch,
    :host-context(body.light-theme) .mat-mdc-form-field:hover .mdc-notched-outline__leading,
    :host-context(body.light-theme) .mat-mdc-form-field:hover .mdc-notched-outline__trailing,
    :host-context(body.light-theme) .mat-mdc-form-field:hover .mdc-notched-outline__notch {
      border-color: rgba(0, 0, 0, 0.87) !important;
    }

    :host-context(.light-theme) .mat-mdc-form-field.mat-focused .mdc-notched-outline__leading,
    :host-context(.light-theme) .mat-mdc-form-field.mat-focused .mdc-notched-outline__trailing,
    :host-context(.light-theme) .mat-mdc-form-field.mat-focused .mdc-notched-outline__notch,
    :host-context(body.light-theme) .mat-mdc-form-field.mat-focused .mdc-notched-outline__leading,
    :host-context(body.light-theme) .mat-mdc-form-field.mat-focused .mdc-notched-outline__trailing,
    :host-context(body.light-theme) .mat-mdc-form-field.mat-focused .mdc-notched-outline__notch {
      border-color: #673ab7 !important;
      border-width: 2px !important;
    }

    :host-context(.light-theme) .mat-mdc-form-field .mat-mdc-input-element,
    :host-context(body.light-theme) .mat-mdc-form-field .mat-mdc-input-element {
      color: #212121 !important;
      caret-color: #673ab7 !important;
    }

    :host-context(.light-theme) .mat-mdc-form-field .mat-mdc-input-element::placeholder,
    :host-context(body.light-theme) .mat-mdc-form-field .mat-mdc-input-element::placeholder {
      color: rgba(0, 0, 0, 0.6) !important;
    }

    :host-context(.light-theme) .mat-mdc-form-field .mdc-floating-label,
    :host-context(body.light-theme) .mat-mdc-form-field .mdc-floating-label {
      color: rgba(0, 0, 0, 0.6) !important;
    }

    :host-context(.light-theme) .mat-mdc-form-field.mat-focused .mdc-floating-label,
    :host-context(body.light-theme) .mat-mdc-form-field.mat-focused .mdc-floating-label {
      color: #673ab7 !important;
    }

    :host-context(.light-theme) .mat-mdc-form-field .mat-mdc-select-value-text,
    :host-context(body.light-theme) .mat-mdc-form-field .mat-mdc-select-value-text {
      color: #212121 !important;
    }

    :host-context(.light-theme) .mat-mdc-form-field .mat-mdc-select-placeholder,
    :host-context(body.light-theme) .mat-mdc-form-field .mat-mdc-select-placeholder {
      color: rgba(0, 0, 0, 0.6) !important;
    }

    :host-context(.light-theme) .mat-mdc-form-field-icon-suffix mat-icon,
    :host-context(body.light-theme) .mat-mdc-form-field-icon-suffix mat-icon {
      color: #673ab7 !important;
      opacity: 0.8;
    }

    :host-context(.light-theme) mat-dialog-actions,
    :host-context(body.light-theme) mat-dialog-actions {
      background: #ffffff !important;
      border-top: 1px solid #e0e0e0 !important;
    }

    :host-context(.light-theme) mat-dialog-content,
    :host-context(body.light-theme) mat-dialog-content {
      background: #f8f9fa !important;
    }

    /* Global overlays for light theme with enhanced specificity */
    :host-context(.light-theme) ::ng-deep .mat-mdc-select-panel {
      background: #ffffff !important;
      border: 1px solid #e0e0e0 !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
    }

    :host-context(.light-theme) ::ng-deep .mat-mdc-option {
      color: #212121 !important;
      background: #ffffff !important;
    }

    :host-context(.light-theme) ::ng-deep .mat-mdc-option .mdc-list-item__primary-text {
      color: #212121 !important;
    }

    :host-context(.light-theme) ::ng-deep .mat-mdc-option:hover {
      background: #f5f5f5 !important;
      color: #212121 !important;
    }

    :host-context(.light-theme) ::ng-deep .mat-mdc-option:hover .mdc-list-item__primary-text {
      color: #212121 !important;
    }

    :host-context(.light-theme) ::ng-deep .mat-mdc-option.mdc-list-item--selected {
      background: #e8eaf6 !important;
      color: #673ab7 !important;
    }

    :host-context(.light-theme) ::ng-deep .mat-mdc-option.mdc-list-item--selected .mdc-list-item__primary-text {
      color: #673ab7 !important;
    }

    /* Additional option text fixes for light theme */
    :host-context(.light-theme) ::ng-deep .mat-mdc-option span {
      color: #212121 !important;
    }

    :host-context(.light-theme) ::ng-deep .mat-mdc-option:hover span {
      color: #212121 !important;
    }

    :host-context(.light-theme) ::ng-deep .mat-mdc-option.mdc-list-item--selected span {
      color: #673ab7 !important;
    }

    :host-context(.light-theme) ::ng-deep .mat-datepicker-content {
      background: #ffffff !important;
      border: 1px solid #e0e0e0 !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
    }

    :host-context(.light-theme) ::ng-deep .mat-calendar-body-cell-content {
      color: #212121 !important;
    }

    :host-context(.light-theme) ::ng-deep .mat-calendar-body-selected {
      background-color: #673ab7 !important;
      color: #ffffff !important;
    }

    :host-context(.light-theme) ::ng-deep .mat-datepicker-toggle {
      color: #673ab7 !important;
    }

    /* Additional input styling for light theme */
    :host-context(.light-theme) .mat-mdc-form-field input {
      color: #212121 !important;
    }

    :host-context(.light-theme) .mat-mdc-form-field input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 1000px #ffffff inset !important;
      -webkit-text-fill-color: #212121 !important;
    }

    :host-context(.light-theme) .mat-mdc-form-field .mat-mdc-select-arrow {
      color: rgba(0, 0, 0, 0.54) !important;
    }

    :host-context(.light-theme) .mat-mdc-form-field.mat-focused .mat-mdc-select-arrow {
      color: #673ab7 !important;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .person-form {
        min-width: 280px;
        max-width: 100%;
        width: 100%;
      }
      
      .form-row {
        flex-direction: column;
        gap: 0;
      }
      
      .half-width {
        width: 100%;
      }

      .dialog-header {
        padding: 16px 0 12px;
      }

      .dialog-icon {
        font-size: 28px;
        padding: 6px;
      }

      mat-dialog-title {
        font-size: 20px;
      }

      .form-section {
        margin-bottom: 20px;
        padding: 16px;
      }

      .section-title {
        font-size: 16px;
      }

      :host ::ng-deep .mat-mdc-dialog-container {
        max-width: 95vw !important;
        margin: 16px !important;
      }

      :host ::ng-deep .mat-mdc-dialog-surface {
        max-width: 100% !important;
        margin: 0 !important;
      }
    }

    @media (max-width: 576px) {
      .person-form {
        min-width: 280px;
        max-width: 100%;
      }

      .form-section {
        padding: 12px;
        margin-bottom: 16px;
      }

      .form-row {
        gap: 0;
      }

      .half-width, .full-width {
        margin-bottom: 16px;
      }

      :host ::ng-deep .mat-mdc-dialog-container {
        max-width: 98vw !important;
        margin: 8px !important;
      }
    }

    @media (min-width: 769px) and (max-width: 1024px) {
      .person-form {
        min-width: 500px;
        max-width: 600px;
      }

      :host ::ng-deep .mat-mdc-dialog-surface {
        max-width: 600px !important;
      }
    }

    @media (min-width: 1025px) {
      .person-form {
        min-width: 550px;
        max-width: 650px;
      }

      :host ::ng-deep .mat-mdc-dialog-surface {
        max-width: 650px !important;
      }
    }

    /* Password visibility button styling */
    .mat-mdc-form-field-icon-suffix button {
      color: var(--primary-color);
      opacity: 0.7;
      transition: all 0.3s ease;
    }

    .mat-mdc-form-field-icon-suffix button:hover {
      opacity: 1;
      color: var(--primary-color);
    }

    /* Error states */
    .mat-mdc-form-field.mat-form-field-invalid .mat-mdc-form-field-icon-suffix mat-icon {
      color: var(--warn-color);
    }

    /* Success states */
    .mat-mdc-form-field.ng-valid.ng-touched .mat-mdc-form-field-icon-suffix mat-icon {
      color: var(--accent-color);
    }

    /* Animations */
    @keyframes slideInUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .form-section {
      animation: slideInUp 0.3s ease-out;
    }

    .form-section:nth-child(2) { animation-delay: 0.1s; }
    .form-section:nth-child(3) { animation-delay: 0.2s; }
    .form-section:nth-child(4) { animation-delay: 0.3s; }
    .form-section:nth-child(5) { animation-delay: 0.4s; }
  `]
})
export class PersonFormDialogComponent implements OnInit {
  personForm!: FormGroup;
  loading = false;
  isEdit = false;
  hidePassword = true;
  hideConfirmPassword = true;

  documentTypes = [
    { value: DocumentType.CC, label: 'Cédula de Ciudadanía' },
    { value: DocumentType.TI, label: 'Tarjeta de Identidad' },
    { value: DocumentType.CE, label: 'Cédula de Extranjería' },
    { value: DocumentType.PA, label: 'Pasaporte' }
  ];

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

  // Custom validator for password confirmation
  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (!password || !confirmPassword) {
      return null;
    }
    
    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  // Method to open date picker
  openDatePicker(picker: MatDatepicker<Date>): void {
    picker.open();
  }

  private initForm(): void {
    const baseValidators = this.isEdit ? [] : [Validators.required];
    
    this.personForm = this.fb.group({
      name: ['', baseValidators],
      surname: [''],
      documentType: ['', baseValidators],
      document: ['', baseValidators],
      email: ['', this.isEdit ? [Validators.email] : [Validators.required, Validators.email]],
      phoneNumber: [''],
      birthDate: [''],
      address: [''],
      password: ['', this.isEdit ? [] : [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', this.isEdit ? [] : [Validators.required]],
      status: [PersonStatus.ACTIVO]
    }, { 
      validators: this.isEdit ? null : this.passwordMatchValidator 
    });

    // Add real-time password confirmation validation for new users
    if (!this.isEdit) {
      this.personForm.get('confirmPassword')?.valueChanges.subscribe(() => {
        this.updatePasswordConfirmationErrors();
      });
      
      this.personForm.get('password')?.valueChanges.subscribe(() => {
        this.updatePasswordConfirmationErrors();
      });
    }
  }

  private updatePasswordConfirmationErrors(): void {
    const confirmPasswordControl = this.personForm.get('confirmPassword');
    const passwordControl = this.personForm.get('password');
    
    if (confirmPasswordControl && passwordControl) {
      if (confirmPasswordControl.value && passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
      } else if (confirmPasswordControl.hasError('passwordMismatch')) {
        confirmPasswordControl.setErrors(null);
      }
    }
  }

  private populateForm(person: PersonDTO): void {
    this.personForm.patchValue({
      name: person.name,
      surname: person.surname,
      documentType: person.documentType,
      document: person.document,
      email: person.email,
      phoneNumber: person.phoneNumber,
      birthDate: person.birthDate ? new Date(person.birthDate) : null,
      address: '', // No está en el DTO de respuesta, agregar si es necesario
      status: person.status
    });
  }

  onSubmit(): void {
    if (this.personForm.valid) {
      // Additional validation for password confirmation in new users
      if (!this.isEdit) {
        const password = this.personForm.get('password')?.value;
        const confirmPassword = this.personForm.get('confirmPassword')?.value;
        
        if (password !== confirmPassword) {
          this.snackBar.open('Las contraseñas no coinciden', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          return;
        }
      }

      this.loading = true;
      const formData = this.personForm.value;
      
      if (this.isEdit && this.data) {
        const updateData: EditPersonDTO = {
          id: this.data.id,
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          birthDate: formData.birthDate ? formData.birthDate.toISOString().split('T')[0] : undefined,
          address: formData.address,
          status: formData.status
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
          error: (error) => {
            this.loading = false;
            this.snackBar.open('Error al actualizar persona: ' + (error.error || error.message), 'Cerrar', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
      } else {
        // Crear nueva persona (registro)
        const createData: AddPersonDTO = {
          name: formData.name,
          surname: formData.surname,
          documentType: formData.documentType,
          document: formData.document,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          birthDate: formData.birthDate ? formData.birthDate.toISOString().split('T')[0] : undefined,
          password: formData.password
        };

        this.personService.register(createData).subscribe({
          next: () => {
            this.loading = false;
            this.snackBar.open('Persona registrada correctamente', 'Cerrar', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.loading = false;
            this.snackBar.open('Error al registrar persona: ' + (error.error || error.message), 'Cerrar', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.personForm.controls).forEach(key => {
        this.personForm.get(key)?.markAsTouched();
      });
      
      this.snackBar.open('Por favor, complete todos los campos requeridos', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}

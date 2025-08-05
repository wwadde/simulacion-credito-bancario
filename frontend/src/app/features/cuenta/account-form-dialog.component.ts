import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable, map, startWith, of } from 'rxjs';
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
    MatAutocompleteModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule
  ],
  template: `
    <div class="dialog-header">
      <mat-icon class="dialog-icon">account_balance</mat-icon>
      <h2 mat-dialog-title>Crear Nueva Cuenta</h2>
    </div>
    
    <mat-dialog-content>
      <form [formGroup]="accountForm" class="account-form">
        <div class="form-section">
          <h3 class="section-title">
            <mat-icon>person_search</mat-icon>
            Selección de Titular
          </h3>
          
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Buscar y Seleccionar Persona *</mat-label>
            <input
              type="text"
              matInput
              formControlName="personSearch"
              [matAutocomplete]="auto"
              placeholder="Haga clic para buscar y seleccionar una persona"
              (focus)="onInputFocus()"
              (input)="onInputChange()"
              tabindex="2"
              [readonly]="!searchEnabled"
              (click)="enableSearch($event)">
            <mat-autocomplete 
              #auto="matAutocomplete" 
              [displayWith]="displayPersonFn"
              (optionSelected)="onPersonSelected($event.option.value)"
              panelClass="person-autocomplete-panel"
              autoActiveFirstOption="false">
              <mat-option 
                *ngFor="let person of filteredPersons$ | async; trackBy: trackByPersonId" 
                [value]="person"
                class="person-autocomplete-option">
                <div class="person-option">
                  <div class="person-main">
                    <strong>{{person.name}} {{person.surname}}</strong>
                    <mat-icon class="person-icon">person</mat-icon>
                  </div>
                  <div class="person-details">
                    {{person.documentType}}: {{person.document}} | {{person.email}}
                  </div>
                </div>
              </mat-option>
              <mat-option *ngIf="shouldShowLoadingOption()" disabled>
                <div class="no-results">
                  <mat-icon>hourglass_empty</mat-icon>
                  <span>Cargando personas...</span>
                </div>
              </mat-option>
              <mat-option *ngIf="shouldShowNoResultsOption()" disabled>
                <div class="no-results">
                  <mat-icon>search_off</mat-icon>
                  <span>No se encontraron personas que coincidan con la búsqueda</span>
                </div>
              </mat-option>
              <mat-option *ngIf="shouldShowNoPersonsOption()" disabled>
                <div class="no-results">
                  <mat-icon>person_off</mat-icon>
                  <span>No hay personas activas registradas</span>
                </div>
              </mat-option>
            </mat-autocomplete>
            <button 
              mat-icon-button 
              matSuffix 
              *ngIf="selectedPerson" 
              (click)="clearPersonSelection()"
              type="button"
              matTooltip="Limpiar selección">
              <mat-icon>clear</mat-icon>
            </button>
            <mat-icon matSuffix *ngIf="!selectedPerson">search</mat-icon>
            <mat-error *ngIf="accountForm.get('personId')?.hasError('required')">
              Debe seleccionar una persona
            </mat-error>
          </mat-form-field>

          <div *ngIf="selectedPerson" class="selected-person-card">
            <mat-card class="person-card">
              <mat-card-header>
                <mat-icon mat-card-avatar>account_circle</mat-icon>
                <mat-card-title>{{selectedPerson.name}} {{selectedPerson.surname}}</mat-card-title>
                <mat-card-subtitle>{{selectedPerson.email}}</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <div class="person-info">
                  <div class="info-item">
                    <mat-icon>credit_card</mat-icon>
                    <span>{{selectedPerson.documentType}}: {{selectedPerson.document}}</span>
                  </div>
                  <div class="info-item" *ngIf="selectedPerson.phoneNumber">
                    <mat-icon>phone</mat-icon>
                    <span>{{selectedPerson.phoneNumber}}</span>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </div>

        <div class="form-section">
          <h3 class="section-title">
            <mat-icon>attach_money</mat-icon>
            Configuración de Cuenta
          </h3>
          
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Balance Inicial *</mat-label>
            <input matInput type="number" formControlName="balance" placeholder="0.00" 
                   min="0" step="0.01" (input)="formatBalance($event)" tabindex="1">
            <span matPrefix>$ </span>
            <mat-icon matSuffix>account_balance_wallet</mat-icon>
            <mat-hint>Ingrese el monto inicial para la cuenta</mat-hint>
            <mat-error *ngIf="accountForm.get('balance')?.hasError('required')">
              El balance inicial es requerido
            </mat-error>
            <mat-error *ngIf="accountForm.get('balance')?.hasError('min')">
              El balance no puede ser negativo
            </mat-error>
          </mat-form-field>

          <div class="balance-preview" *ngIf="accountForm.get('balance')?.value >= 0">
            <div class="preview-card">
              <mat-icon>preview</mat-icon>
              <div class="preview-content">
                <span class="preview-label">Balance inicial:</span>
                <span class="preview-amount">{{formatCurrency(accountForm.get('balance')?.value || 0)}}</span>
              </div>
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
        [disabled]="accountForm.invalid || loading"
        class="submit-btn">
        <mat-icon *ngIf="!loading">account_balance</mat-icon>
        <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
        <span *ngIf="loading">Creando...</span>
        <span *ngIf="!loading">Crear Cuenta</span>
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
      background: linear-gradient(135deg, #4caf50, #8bc34a);
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

    .account-form {
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
      color: #4caf50;
      padding-bottom: 8px;
      border-bottom: 2px solid #4caf50;
    }

    .section-title mat-icon {
      color: #4caf50;
      font-size: 20px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .person-option {
      padding: 8px 0;
    }

    .person-main {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }

    .person-main strong {
      font-weight: 600;
      color: var(--text-primary);
    }

    .person-icon {
      color: #4caf50;
      font-size: 18px;
    }

    .person-details {
      font-size: 12px;
      color: var(--text-secondary);
      opacity: 0.8;
    }

    .selected-person-card {
      margin-top: 16px;
      animation: slideInUp 0.3s ease-out;
    }

    .person-card {
      background: linear-gradient(135deg, rgba(76, 175, 80, 0.05), rgba(139, 195, 74, 0.05));
      border: 1px solid #4caf50;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(76, 175, 80, 0.15);
    }

    .person-card mat-card-header {
      padding: 16px;
    }

    .person-card mat-card-avatar {
      background: #4caf50;
      color: white;
      font-size: 24px;
    }

    .person-card mat-card-title {
      color: var(--text-primary);
      font-weight: 600;
    }

    .person-card mat-card-subtitle {
      color: var(--text-secondary);
    }

    .person-info {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 0 16px 16px;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--text-primary);
    }

    .info-item mat-icon {
      color: #4caf50;
      font-size: 18px;
    }

    .balance-preview {
      margin-top: 16px;
      animation: slideInUp 0.3s ease-out;
    }

    .preview-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: linear-gradient(135deg, rgba(76, 175, 80, 0.05), rgba(139, 195, 74, 0.05));
      border: 1px solid #4caf50;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(76, 175, 80, 0.1);
    }

    .preview-card mat-icon {
      color: #4caf50;
      font-size: 24px;
    }

    .preview-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .preview-label {
      font-size: 14px;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .preview-amount {
      font-size: 20px;
      font-weight: 700;
      color: #4caf50;
    }

    mat-dialog-content {
      max-height: 80vh;
      overflow-y: auto;
      padding: 0 !important;
      background: linear-gradient(135deg, 
        rgba(76, 175, 80, 0.02), 
        rgba(139, 195, 74, 0.02));
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

    /* Dark theme dialog adjustments */
    .dark-theme mat-dialog-content {
      background: linear-gradient(135deg, 
        rgba(139, 195, 74, 0.05), 
        rgba(76, 175, 80, 0.05));
    }

    .dark-theme mat-dialog-actions {
      background: var(--surface-color);
      border-top-color: var(--border-color);
    }

    .cancel-btn {
      min-width: 140px;
      height: 44px;
      border-radius: 22px;
      font-weight: 500;
      border: 2px solid #4caf50;
      color: #4caf50;
      transition: all 0.3s ease;
    }

    .cancel-btn:hover {
      background: #4caf50;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
    }

    .submit-btn {
      min-width: 140px;
      height: 44px;
      border-radius: 22px;
      font-weight: 600;
      background: linear-gradient(135deg, #4caf50, #8bc34a) !important;
      color: white !important;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
    }

    .submit-btn:hover:not([disabled]) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
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
      box-shadow: 0 4px 12px rgba(76, 175, 80, 0.15);
    }

    .mat-mdc-text-field-wrapper {
      background-color: var(--surface-color) !important;
      border-radius: 8px !important;
    }

    /* Force Material Design outline styles for light theme */
    .mat-mdc-form-field .mdc-notched-outline__leading,
    .mat-mdc-form-field .mdc-notched-outline__trailing,
    .mat-mdc-form-field .mdc-notched-outline__notch {
      border-color: rgba(0, 0, 0, 0.38) !important;
    }

    .mat-mdc-form-field.mat-focused .mdc-notched-outline__leading,
    .mat-mdc-form-field.mat-focused .mdc-notched-outline__trailing,
    .mat-mdc-form-field.mat-focused .mdc-notched-outline__notch {
      border-color: #4caf50 !important;
      border-width: 2px !important;
    }

    /* Input text and label colors - force override */
    .mat-mdc-form-field .mat-mdc-input-element {
      color: var(--text-primary) !important;
      caret-color: #4caf50 !important;
    }

    .mat-mdc-form-field .mdc-floating-label {
      color: rgba(0, 0, 0, 0.6) !important;
    }

    .mat-mdc-form-field.mat-focused .mdc-floating-label {
      color: #4caf50 !important;
    }

    .mat-mdc-form-field .mat-mdc-select-value-text {
      color: var(--text-primary) !important;
    }

    .mat-mdc-form-field-icon-suffix mat-icon {
      color: #4caf50;
      opacity: 0.7;
    }

    .mat-mdc-form-field-focus-overlay {
      background-color: #4caf50 !important;
      opacity: 0.05 !important;
    }

    /* Select option text colors */
    .person-main strong {
      color: var(--text-primary);
    }

    .person-details {
      color: var(--text-secondary);
    }

    /* Light theme explicit styles with higher specificity */
    body.light-theme .mat-mdc-form-field .mdc-notched-outline__leading,
    body.light-theme .mat-mdc-form-field .mdc-notched-outline__trailing,
    body.light-theme .mat-mdc-form-field .mdc-notched-outline__notch,
    .light-theme .mat-mdc-form-field .mdc-notched-outline__leading,
    .light-theme .mat-mdc-form-field .mdc-notched-outline__trailing,
    .light-theme .mat-mdc-form-field .mdc-notched-outline__notch,
    .mat-mdc-form-field .mdc-notched-outline__leading,
    .mat-mdc-form-field .mdc-notched-outline__trailing,
    .mat-mdc-form-field .mdc-notched-outline__notch {
      border-color: rgba(0, 0, 0, 0.38) !important;
    }

    body.light-theme .mat-mdc-form-field.mat-focused .mdc-notched-outline__leading,
    body.light-theme .mat-mdc-form-field.mat-focused .mdc-notched-outline__trailing,
    body.light-theme .mat-mdc-form-field.mat-focused .mdc-notched-outline__notch,
    .light-theme .mat-mdc-form-field.mat-focused .mdc-notched-outline__leading,
    .light-theme .mat-mdc-form-field.mat-focused .mdc-notched-outline__trailing,
    .light-theme .mat-mdc-form-field.mat-focused .mdc-notched-outline__notch,
    .mat-mdc-form-field.mat-focused .mdc-notched-outline__leading,
    .mat-mdc-form-field.mat-focused .mdc-notched-outline__trailing,
    .mat-mdc-form-field.mat-focused .mdc-notched-outline__notch {
      border-color: #4caf50 !important;
      border-width: 2px !important;
    }

    body.light-theme .mat-mdc-form-field .mat-mdc-input-element,
    .light-theme .mat-mdc-form-field .mat-mdc-input-element,
    .mat-mdc-form-field .mat-mdc-input-element {
      color: #212121 !important;
      caret-color: #4caf50 !important;
    }

    body.light-theme .mat-mdc-form-field .mdc-floating-label,
    .light-theme .mat-mdc-form-field .mdc-floating-label,
    .mat-mdc-form-field .mdc-floating-label {
      color: rgba(0, 0, 0, 0.6) !important;
    }

    body.light-theme .mat-mdc-form-field.mat-focused .mdc-floating-label,
    .light-theme .mat-mdc-form-field.mat-focused .mdc-floating-label,
    .mat-mdc-form-field.mat-focused .mdc-floating-label {
      color: #4caf50 !important;
    }

    body.light-theme .mat-mdc-form-field .mat-mdc-select-value-text,
    .light-theme .mat-mdc-form-field .mat-mdc-select-value-text,
    .mat-mdc-form-field .mat-mdc-select-value-text {
      color: #212121 !important;
    }

    .light-theme .form-section,
    :root .form-section {
      background: #ffffff;
      border-color: #e0e0e0;
    }

    .light-theme .section-title,
    :root .section-title {
      color: #4caf50;
      border-bottom-color: #4caf50;
    }

    .light-theme .section-title mat-icon,
    :root .section-title mat-icon {
      color: #4caf50;
    }

    .light-theme .mat-mdc-text-field-wrapper,
    :root .mat-mdc-text-field-wrapper {
      background-color: #ffffff !important;
    }

    .light-theme .mat-mdc-form-field-icon-suffix mat-icon,
    :root .mat-mdc-form-field-icon-suffix mat-icon {
      color: #4caf50;
    }

    .light-theme mat-dialog-actions,
    :root mat-dialog-actions {
      background: #ffffff;
      border-top-color: #e0e0e0;
    }

    .light-theme .person-main strong,
    :root .person-main strong {
      color: #212121;
    }

    .light-theme .person-details,
    :root .person-details {
      color: #757575;
    }

    .light-theme .person-card,
    :root .person-card {
      background: linear-gradient(135deg, rgba(76, 175, 80, 0.05), rgba(139, 195, 74, 0.05));
      border-color: #4caf50;
    }

    .light-theme .preview-card,
    :root .preview-card {
      background: linear-gradient(135deg, rgba(76, 175, 80, 0.05), rgba(139, 195, 74, 0.05));
      border-color: #4caf50;
    }

    .light-theme .person-card mat-card-title,
    :root .person-card mat-card-title {
      color: #212121;
    }

    .light-theme .person-card mat-card-subtitle,
    :root .person-card mat-card-subtitle {
      color: #757575;
    }

    .light-theme .info-item,
    :root .info-item {
      color: #212121;
    }

    .light-theme .info-item mat-icon,
    :root .info-item mat-icon {
      color: #4caf50;
    }

    .light-theme .preview-card mat-icon,
    :root .preview-card mat-icon {
      color: #4caf50;
    }

    .light-theme .preview-label,
    :root .preview-label {
      color: #757575;
    }

    .light-theme .preview-amount,
    :root .preview-amount {
      color: #4caf50;
    }

    /* Dark theme adjustments with higher specificity */
    .dark-theme .form-section {
      background: var(--surface-color);
      border-color: var(--border-color);
    }

    .dark-theme .section-title {
      color: #8bc34a;
      border-bottom-color: #8bc34a;
    }

    .dark-theme .section-title mat-icon {
      color: #8bc34a;
    }

    .dark-theme .mat-mdc-form-field-icon-suffix mat-icon {
      color: #8bc34a;
    }

    .dark-theme .mat-mdc-form-field.mat-focused .mdc-floating-label {
      color: #8bc34a !important;
    }

    .dark-theme .mat-mdc-form-field .mdc-notched-outline__leading,
    .dark-theme .mat-mdc-form-field .mdc-notched-outline__trailing,
    .dark-theme .mat-mdc-form-field .mdc-notched-outline__notch {
      border-color: rgba(255, 255, 255, 0.38) !important;
    }

    .dark-theme .mat-mdc-form-field.mat-focused .mdc-notched-outline__leading,
    .dark-theme .mat-mdc-form-field.mat-focused .mdc-notched-outline__trailing,
    .dark-theme .mat-mdc-form-field.mat-focused .mdc-notched-outline__notch {
      border-color: #8bc34a !important;
      border-width: 2px !important;
    }

    .dark-theme .mat-mdc-form-field .mat-mdc-input-element {
      color: var(--text-primary) !important;
    }

    .dark-theme .mat-mdc-form-field .mdc-floating-label {
      color: rgba(255, 255, 255, 0.6) !important;
    }

    /* Light theme fixes - optimized */
    .light-theme .form-section { background: #fff !important; border: 1px solid #e0e0e0 !important; }
    .light-theme .section-title { color: #4caf50 !important; border-bottom-color: #4caf50 !important; }
    .light-theme .section-title mat-icon { color: #4caf50 !important; }
    .light-theme .mat-mdc-text-field-wrapper { background-color: #fff !important; }
    .light-theme .mat-mdc-form-field .mdc-notched-outline__leading,
    .light-theme .mat-mdc-form-field .mdc-notched-outline__trailing,
    .light-theme .mat-mdc-form-field .mdc-notched-outline__notch { border-color: rgba(0,0,0,0.38) !important; }
    .light-theme .mat-mdc-form-field.mat-focused .mdc-notched-outline__leading,
    .light-theme .mat-mdc-form-field.mat-focused .mdc-notched-outline__trailing,
    .light-theme .mat-mdc-form-field.mat-focused .mdc-notched-outline__notch { border-color: #4caf50 !important; border-width: 2px !important; }
    .light-theme .mat-mdc-form-field .mat-mdc-input-element { color: #212121 !important; caret-color: #4caf50 !important; }
    .light-theme .mat-mdc-form-field .mdc-floating-label { color: rgba(0,0,0,0.6) !important; }
    .light-theme .mat-mdc-form-field.mat-focused .mdc-floating-label { color: #4caf50 !important; }
    .light-theme .mat-mdc-form-field .mat-mdc-select-value-text { color: #212121 !important; }
    .light-theme mat-dialog-actions { background: #fff !important; border-top: 1px solid #e0e0e0 !important; }
    .light-theme ::ng-deep .mat-mdc-select-panel { background: #fff !important; border: 1px solid #e0e0e0 !important; }
    .light-theme ::ng-deep .mat-mdc-option { color: #212121 !important; background: #fff !important; }
    .light-theme ::ng-deep .mat-mdc-option .mdc-list-item__primary-text { color: #212121 !important; }
    .light-theme ::ng-deep .mat-mdc-option span { color: #212121 !important; }
    .light-theme ::ng-deep .mat-mdc-option:hover { background: #f5f5f5 !important; color: #212121 !important; }
    .light-theme ::ng-deep .mat-mdc-option:hover .mdc-list-item__primary-text { color: #212121 !important; }
    .light-theme ::ng-deep .mat-mdc-option:hover span { color: #212121 !important; }
    .light-theme ::ng-deep .mat-mdc-option.mdc-list-item--selected { background: #e8f5e8 !important; color: #4caf50 !important; }
    .light-theme ::ng-deep .mat-mdc-option.mdc-list-item--selected .mdc-list-item__primary-text { color: #4caf50 !important; }
    .light-theme ::ng-deep .mat-mdc-option.mdc-list-item--selected span { color: #4caf50 !important; }

    :not(.dark-theme) ::ng-deep .mat-mdc-option:hover {
      background: #f5f5f5 !important;
    }

    .dark-theme .mat-mdc-form-field .mat-mdc-select-value-text {
      color: var(--text-primary) !important;
    }

    .dark-theme .person-card {
      background: linear-gradient(135deg, rgba(139, 195, 74, 0.1), rgba(76, 175, 80, 0.1));
      border-color: #8bc34a;
    }

    .dark-theme .preview-card {
      background: linear-gradient(135deg, rgba(139, 195, 74, 0.1), rgba(76, 175, 80, 0.1));
      border-color: #8bc34a;
    }

    .dark-theme .person-card mat-card-avatar {
      background: #8bc34a;
    }

    .dark-theme .person-card mat-card-title {
      color: var(--text-primary);
    }

    .dark-theme .person-card mat-card-subtitle {
      color: var(--text-secondary);
    }

    .dark-theme .info-item {
      color: var(--text-primary);
    }

    .dark-theme .info-item mat-icon {
      color: #8bc34a;
    }

    .dark-theme .preview-card mat-icon {
      color: #8bc34a;
    }

    .dark-theme .preview-label {
      color: var(--text-secondary);
    }

    .dark-theme .preview-amount {
      color: #8bc34a;
    }

    /* Global styles for Material components that render outside this component */
    ::ng-deep .mat-mdc-select-panel {
      background: var(--surface-color) !important;
    }

    ::ng-deep .mat-mdc-option {
      color: var(--text-primary) !important;
    }

    ::ng-deep .mat-mdc-option:hover {
      background: var(--hover-color) !important;
    }

    ::ng-deep .mat-mdc-option.mdc-list-item--selected {
      background: var(--hover-color-alt) !important;
    }

    ::ng-deep .mat-mdc-snack-bar-container.success-snackbar {
      background: var(--success-color) !important;
      color: white !important;
    }

    ::ng-deep .mat-mdc-snack-bar-container.error-snackbar {
      background: var(--warn-color) !important;
      color: white !important;
    }

    /* Light theme global adjustments */
    .light-theme ::ng-deep .mat-mdc-select-panel,
    :root ::ng-deep .mat-mdc-select-panel {
      background: #ffffff !important;
      border: 1px solid #e0e0e0 !important;
    }

    .light-theme ::ng-deep .mat-mdc-option,
    :root ::ng-deep .mat-mdc-option {
      color: #212121 !important;
    }

    /* Dark theme global adjustments */
    .dark-theme ::ng-deep .mat-mdc-select-panel {
      background: var(--surface-color) !important;
      border: 1px solid var(--border-color) !important;
    }

    .dark-theme ::ng-deep .mat-mdc-option {
      color: var(--text-primary) !important;
    }

    .form-section:nth-child(2) { animation-delay: 0.2s; }

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

    .form-section:nth-child(1) { animation-delay: 0.1s; }
    .form-section:nth-child(2) { animation-delay: 0.2s; }

    /* Success states */
    .mat-mdc-form-field.ng-valid.ng-touched .mat-mdc-form-field-icon-suffix mat-icon {
      color: #4caf50;
    }

    /* Error states */
    .mat-mdc-form-field.mat-form-field-invalid .mat-mdc-form-field-icon-suffix mat-icon {
      color: var(--warn-color);
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .account-form {
        min-width: 280px;
        max-width: 100%;
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
        margin-bottom: 16px;
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
      .account-form {
        min-width: 280px;
        max-width: 100%;
      }

      .form-section {
        padding: 12px;
        margin-bottom: 16px;
      }

      .full-width {
        margin-bottom: 16px;
      }

      :host ::ng-deep .mat-mdc-dialog-container {
        max-width: 98vw !important;
        margin: 8px !important;
      }
    }

    @media (min-width: 769px) and (max-width: 1024px) {
      .account-form {
        min-width: 500px;
        max-width: 600px;
      }

      :host ::ng-deep .mat-mdc-dialog-surface {
        max-width: 600px !important;
      }
    }

    @media (min-width: 1025px) {
      .account-form {
        min-width: 550px;
        max-width: 650px;
      }

      :host ::ng-deep .mat-mdc-dialog-surface {
        max-width: 650px !important;
      }
    }

    /* Essential light theme fixes */
    .light-theme .form-section { background: #fff !important; }
    .light-theme .mat-mdc-text-field-wrapper { background: #fff !important; }
    .light-theme .mat-mdc-form-field .mat-mdc-input-element { color: #212121 !important; }
    .light-theme .mat-mdc-form-field .mat-mdc-select-value-text { color: #212121 !important; }

    /* Autocomplete panel styles */
    :host ::ng-deep .person-autocomplete-panel {
      max-height: 300px !important;
      overflow-y: auto !important;
      background: var(--surface-color) !important;
      border-radius: 12px !important;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
    }

    .person-autocomplete-option {
      border-bottom: 1px solid rgba(0, 0, 0, 0.08);
      padding: 12px 16px !important;
      min-height: auto !important;
      line-height: normal !important;
    }

    .person-autocomplete-option:last-child {
      border-bottom: none;
    }

    .person-autocomplete-option:hover {
      background: rgba(76, 175, 80, 0.08) !important;
    }

    .person-autocomplete-option.mat-mdc-option.mat-selected {
      background: rgba(76, 175, 80, 0.12) !important;
    }

    .no-results {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      color: rgba(0, 0, 0, 0.54);
      font-style: italic;
    }

    .no-results mat-icon {
      margin-right: 8px;
      color: rgba(0, 0, 0, 0.38);
    }

    /* Light theme autocomplete fixes */
    .light-theme :host ::ng-deep .person-autocomplete-panel {
      background: #ffffff !important;
    }

    .light-theme .person-autocomplete-option {
      color: #212121 !important;
    }

    .light-theme .person-autocomplete-option:hover {
      background: rgba(76, 175, 80, 0.08) !important;
      color: #212121 !important;
    }

    .light-theme .no-results {
      color: rgba(0, 0, 0, 0.54) !important;
    }

    /* Readonly input styling */
    input[readonly]:not([disabled]) {
      cursor: pointer !important;
      background: transparent !important;
    }

    input[readonly]:not([disabled]):hover {
      background: rgba(0, 0, 0, 0.04) !important;
    }

    .mat-mdc-form-field input[readonly]:not([disabled]) {
      color: rgba(0, 0, 0, 0.87) !important;
    }

    .light-theme .mat-mdc-form-field input[readonly]:not([disabled]) {
      color: #212121 !important;
    }
  `]
})
export class AccountFormDialogComponent implements OnInit {
  accountForm!: FormGroup;
  loading = false;
  loadingPersons = true;
  persons: PersonDTO[] = [];
  filteredPersons$: Observable<PersonDTO[]> = of([]);
  selectedPerson: PersonDTO | null = null;
  hasUserInteracted = false;
  currentFilteredCount = 0;
  searchEnabled = false;

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
    // setupPersonFilter() se llama ahora desde loadPersons() después de cargar los datos
  }

  private initForm(): void {
    this.accountForm = this.fb.group({
      personId: ['', [Validators.required]],
      personSearch: [''],
      balance: [0, [Validators.required, Validators.min(0)]]
    });
  }

  private loadPersons(): void {
    this.loadingPersons = true;
    this.personService.findAllPersons().subscribe({
      next: (persons) => {
        this.persons = persons.filter(p => p.status === 'ACTIVO');
        this.loadingPersons = false;
        // Configurar el filtro solo después de cargar las personas
        this.setupPersonFilter();
      },
      error: () => {
        this.loadingPersons = false;
        this.snackBar.open('Error al cargar personas', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  private setupPersonFilter(): void {
    this.filteredPersons$ = this.accountForm.get('personSearch')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        // Solo mostrar opciones si el usuario ha interactuado con el campo
        if (!this.hasUserInteracted) {
          this.currentFilteredCount = 0;
          return [];
        }
        
        let result: PersonDTO[];
        if (typeof value === 'object' && value) {
          // Si es un objeto PersonDTO, mostrar todas las personas
          result = this.persons;
        } else {
          // Si es string (búsqueda), filtrar
          result = this._filterPersons(value || '');
        }
        
        this.currentFilteredCount = result.length;
        return result;
      })
    );
  }

  private _filterPersons(value: string): PersonDTO[] {
    if (!value.trim()) {
      return this.persons; // Mostrar todas si no hay texto de búsqueda
    }
    
    const filterValue = value.toLowerCase();
    return this.persons.filter(person => {
      const fullName = `${person.name} ${person.surname}`.toLowerCase();
      const document = person.document.toLowerCase();
      const email = person.email.toLowerCase();
      
      return fullName.includes(filterValue) || 
             document.includes(filterValue) || 
             email.includes(filterValue);
    });
  }

  onInputFocus(): void {
    if (this.searchEnabled) {
      this.hasUserInteracted = true;
      // Trigger filter update
      this.accountForm.get('personSearch')?.updateValueAndValidity();
    }
  }

  onInputChange(): void {
    if (this.searchEnabled) {
      this.hasUserInteracted = true;
    }
  }

  enableSearch(event: Event): void {
    if (!this.searchEnabled) {
      this.searchEnabled = true;
      this.hasUserInteracted = true;
      // Pequeño delay para que el campo se vuelva editable antes de hacer focus
      setTimeout(() => {
        const input = event.target as HTMLInputElement;
        input.removeAttribute('readonly');
        input.focus();
        input.placeholder = "Escriba el nombre o documento de la persona";
        // Trigger filter update
        this.accountForm.get('personSearch')?.updateValueAndValidity();
      }, 10);
    }
  }

  shouldShowLoadingOption(): boolean {
    return this.hasUserInteracted && this.loadingPersons;
  }

  shouldShowNoResultsOption(): boolean {
    return this.hasUserInteracted && 
           !this.loadingPersons && 
           this.persons.length > 0 && 
           this.currentFilteredCount === 0 &&
           !!this.accountForm.get('personSearch')?.value?.trim();
  }

  shouldShowNoPersonsOption(): boolean {
    return this.hasUserInteracted && 
           !this.loadingPersons && 
           this.persons.length === 0;
  }

  displayPersonFn = (person: PersonDTO): string => {
    return person ? `${person.name} ${person.surname}` : '';
  }

  trackByPersonId = (index: number, person: PersonDTO): number => {
    return person.id;
  }

  onPersonSelected(person: PersonDTO): void {
    this.selectedPerson = person;
    this.searchEnabled = false; // Deshabilitar la búsqueda una vez seleccionada
    // Actualizar el campo personId para la validación del formulario
    this.accountForm.get('personId')?.setValue(person.id);
    this.accountForm.get('personId')?.markAsTouched();
    // Mostrar el nombre de la persona seleccionada en el campo
    this.accountForm.get('personSearch')?.setValue(person);
  }

  clearPersonSelection(): void {
    this.selectedPerson = null;
    this.hasUserInteracted = false;
    this.searchEnabled = false;
    this.currentFilteredCount = 0;
    this.accountForm.get('personId')?.setValue('');
    this.accountForm.get('personSearch')?.setValue('');
    this.accountForm.get('personId')?.markAsUntouched();
  }

  formatBalance(event: any): void {
    const value = event.target.value;
    if (value < 0) {
      event.target.value = 0;
      this.accountForm.get('balance')?.setValue(0);
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 2
    }).format(amount);
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
        error: (error) => {
          this.loading = false;
          this.snackBar.open('Error al crear cuenta: ' + (error.error || error.message), 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.accountForm.controls).forEach(key => {
        this.accountForm.get(key)?.markAsTouched();
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

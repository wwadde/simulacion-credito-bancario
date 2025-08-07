import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { PersonDTO } from '../../core/models/person.model';

export interface PersonSelectionData {
  persons: PersonDTO[];
  excludePersonsWithCredit: number[];
}

@Component({
  selector: 'app-person-selection-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>
        <mat-icon>people</mat-icon>
        Seleccionar Cliente para Nuevo Crédito
      </h2>

      <mat-dialog-content>
        <div class="search-container">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Buscar cliente</mat-label>
            <input matInput 
                   [(ngModel)]="searchTerm"
                   placeholder="Buscar por nombre, documento o email"
                   (input)="filterPersons()">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
        </div>

        <div class="persons-list" *ngIf="filteredPersons.length > 0">
          <mat-card 
            *ngFor="let person of filteredPersons" 
            class="person-card"
            [class.disabled]="hasCredit(person.id)"
            (click)="selectPerson(person)">
            
            <mat-card-content>
              <div class="person-info">
                <div class="person-main">
                  <h3>{{person.name}} {{person.surname}}</h3>
                  <p class="document">{{person.documentType}}: {{person.document}}</p>
                </div>
                
                <div class="person-details">
                  <p class="email" *ngIf="person.email">
                    <mat-icon class="detail-icon">email</mat-icon>
                    {{person.email}}
                  </p>
                  <p class="phone" *ngIf="person.phoneNumber">
                    <mat-icon class="detail-icon">phone</mat-icon>
                    {{person.phoneNumber}}
                  </p>
                </div>

                <div class="credit-status" *ngIf="hasCredit(person.id)">
                  <mat-icon class="warning-icon">warning</mat-icon>
                  <span>Ya tiene un crédito activo</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <div *ngIf="filteredPersons.length === 0 && searchTerm" class="no-results">
          <mat-icon class="no-results-icon">search_off</mat-icon>
          <h3>No se encontraron resultados</h3>
          <p>No hay clientes que coincidan con "{{searchTerm}}"</p>
        </div>

        <div *ngIf="availablePersons.length === 0" class="no-available">
          <mat-icon class="no-available-icon">credit_card_off</mat-icon>
          <h3>No hay clientes disponibles</h3>
          <p>Todos los clientes ya tienen créditos activos o no hay clientes registrados</p>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">
          Cancelar
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      min-width: 600px;
      max-width: 800px;
      max-height: 80vh;
    }

    h2[mat-dialog-title] {
      display: flex;
      align-items: center;
      gap: 12px;
      color: var(--primary-color, #673ab7);
      margin-bottom: 20px;
      font-weight: 500;
      font-size: 24px;
    }

    .search-container {
      margin-bottom: 24px;
    }

    .full-width {
      width: 100%;
    }

    .persons-list {
      max-height: 250px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 4px;
    }

    .person-card {
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid var(--border-color, #e0e0e0);
      border-radius: 12px;
      background-color: var(--surface-color, #ffffff);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      height: 109px;
      min-height: 109px;
      max-height: 109px;
      overflow: hidden;
      padding: 16px;
      color: var(--text-primary, #212121);
    }

    .person-card:hover:not(.disabled) {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px var(--primary-shadow, rgba(103, 58, 183, 0.15));
      border-color: var(--primary-color, #673ab7);
    }

    .person-card.disabled {
      opacity: 0.6;
      cursor: not-allowed;
      background-color: var(--disabled-background, #f8f8f8);
      border-color: var(--border-color, #e0e0e0);
      color: var(--text-disabled, #9e9e9e);
    }

    .person-card.disabled:hover {
      transform: none;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .person-info {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .person-main {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .person-main h3 {
      margin: 0;
      color: var(--primary-color, #673ab7);
      font-weight: 600;
      font-size: 20px;
    }

    .document {
      margin: 0;
      color: var(--text-secondary, #666);
      font-weight: 500;
      font-size: 14px;
      background-color: var(--chip-background, #f5f5f5);
      padding: 4px 8px;
      border-radius: 4px;
      display: inline-block;
      width: fit-content;
    }

    .person-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 8px;
    }

    .email, .phone {
      margin: 0;
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--text-secondary, #555);
      font-size: 14px;
      padding: 6px 0;
    }

    .detail-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: var(--primary-color, #673ab7);
    }

    .credit-status {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--error-color, #d32f2f);
      font-size: 14px;
      font-weight: 600;
      margin-top: 12px;
      padding: 12px;
      background-color: var(--error-background, #ffebee);
      border-radius: 8px;
      border: 1px solid var(--error-border, #ffcdd2);
    }

    .warning-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: var(--error-color, #d32f2f);
    }

    .no-results, .no-available {
      text-align: center;
      padding: 60px 20px;
      color: var(--text-secondary, #666);
    }

    .no-results-icon, .no-available-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: var(--text-hint, #ccc);
      margin-bottom: 20px;
    }

    .no-results h3, .no-available h3 {
      margin: 0 0 12px 0;
      color: var(--text-primary, #333);
      font-size: 20px;
      font-weight: 500;
    }

    .no-results p, .no-available p {
      margin: 0;
      color: var(--text-secondary, #777);
      font-size: 16px;
    }

    mat-dialog-actions {
      margin-top: 24px;
      padding: 20px 0 0 0;
      border-top: 1px solid var(--border-color, #e0e0e0);
    }

    /* Scrollbar styling */
    .persons-list::-webkit-scrollbar {
      width: 8px;
    }

    .persons-list::-webkit-scrollbar-track {
      background: var(--scrollbar-track, #f1f1f1);
      border-radius: 4px;
    }

    .persons-list::-webkit-scrollbar-thumb {
      background: var(--primary-color, #673ab7);
      border-radius: 4px;
    }

    .persons-list::-webkit-scrollbar-thumb:hover {
      background: var(--primary-dark, #5e35b1);
    }

    /* CSS Variables - Light theme as default */
    :root {
      --primary-color: #673ab7;
      --primary-dark: #5e35b1;
      --primary-shadow: rgba(103, 58, 183, 0.15);
      --surface-color: #ffffff;
      --text-primary: #212121;
      --text-secondary: #666;
      --text-disabled: #9e9e9e;
      --text-hint: #ccc;
      --border-color: #e0e0e0;
      --disabled-background: #f8f8f8;
      --chip-background: #f5f5f5;
      --error-color: #d32f2f;
      --error-background: #ffebee;
      --error-border: #ffcdd2;
      --scrollbar-track: #f1f1f1;
    }

    /* Dark theme overrides - only when dark theme is active */
    :host-context(.dark-theme),
    :host-context([data-theme="dark"]) {
      --primary-color: #ce93d8;
      --primary-dark: #ba68c8;
      --primary-shadow: rgba(206, 147, 216, 0.2);
      --surface-color: rgba(255, 255, 255, 0.05);
      --text-primary: rgba(255, 255, 255, 0.9);
      --text-secondary: rgba(255, 255, 255, 0.7);
      --text-disabled: rgba(255, 255, 255, 0.5);
      --text-hint: rgba(255, 255, 255, 0.3);
      --border-color: rgba(255, 255, 255, 0.12);
      --disabled-background: rgba(255, 255, 255, 0.02);
      --chip-background: rgba(255, 255, 255, 0.08);
      --error-color: #ef5350;
      --error-background: rgba(239, 83, 80, 0.15);
      --error-border: rgba(239, 83, 80, 0.3);
      --scrollbar-track: rgba(255, 255, 255, 0.1);
    }

    /* System dark theme support - only when no explicit light theme is set */
    @media (prefers-color-scheme: dark) {
      :root:not(.light-theme):not([data-theme="light"]) {
        --primary-color: #ce93d8;
        --primary-dark: #ba68c8;
        --primary-shadow: rgba(206, 147, 216, 0.2);
        --surface-color: rgba(255, 255, 255, 0.05);
        --text-primary: rgba(255, 255, 255, 0.9);
        --text-secondary: rgba(255, 255, 255, 0.7);
        --text-disabled: rgba(255, 255, 255, 0.5);
        --text-hint: rgba(255, 255, 255, 0.3);
        --border-color: rgba(255, 255, 255, 0.12);
        --disabled-background: rgba(255, 255, 255, 0.02);
        --chip-background: rgba(255, 255, 255, 0.08);
        --error-color: #ef5350;
        --error-background: rgba(239, 83, 80, 0.15);
        --error-border: rgba(239, 83, 80, 0.3);
        --scrollbar-track: rgba(255, 255, 255, 0.1);
      }
    }

    /* Explicit light theme override */
    :host-context(.light-theme),
    :host-context([data-theme="light"]) {
      --primary-color: #673ab7;
      --primary-dark: #5e35b1;
      --primary-shadow: rgba(103, 58, 183, 0.15);
      --surface-color: #ffffff;
      --text-primary: #212121;
      --text-secondary: #666;
      --text-disabled: #9e9e9e;
      --text-hint: #ccc;
      --border-color: #e0e0e0;
      --disabled-background: #f8f8f8;
      --chip-background: #f5f5f5;
      --error-color: #d32f2f;
      --error-background: #ffebee;
      --error-border: #ffcdd2;
      --scrollbar-track: #f1f1f1;
    }

    /* Ensure Material components respect theme */
    :host ::ng-deep .mat-mdc-dialog-surface {
      background-color: var(--surface-color) !important;
      color: var(--text-primary) !important;
    }

    /* Force white background for light theme */
    :host ::ng-deep .mat-mdc-dialog-container .mat-mdc-dialog-surface {
      background-color: var(--surface-color) !important;
    }

    /* Explicit light theme dialog background */
    :host-context(.light-theme) ::ng-deep .mat-mdc-dialog-surface,
    :host-context([data-theme="light"]) ::ng-deep .mat-mdc-dialog-surface {
      background-color: #ffffff !important;
      color: #212121 !important;
    }

    /* Ensure dialog content is also white in light theme */
    :host ::ng-deep mat-dialog-content {
      background-color: var(--surface-color) !important;
      color: var(--text-primary) !important;
    }

    /* Dialog container background */
    .dialog-container {
      background-color: var(--surface-color) !important;
    }

    /* Force override any dark theme in light mode */
    :root:not(.dark-theme):not([data-theme="dark"]) :host ::ng-deep .mat-mdc-dialog-surface {
      background-color: #ffffff !important;
      color: #212121 !important;
    }

    :host ::ng-deep .mat-mdc-form-field .mat-mdc-input-element {
      color: var(--text-primary) !important;
    }

    :host ::ng-deep .mat-mdc-form-field .mdc-floating-label {
      color: var(--text-secondary) !important;
    }

    :host ::ng-deep .mat-mdc-form-field.mat-focused .mdc-floating-label {
      color: var(--primary-color) !important;
    }

    :host ::ng-deep .mat-mdc-form-field .mdc-notched-outline__leading,
    :host ::ng-deep .mat-mdc-form-field .mdc-notched-outline__trailing,
    :host ::ng-deep .mat-mdc-form-field .mdc-notched-outline__notch {
      border-color: var(--border-color) !important;
    }

    :host ::ng-deep .mat-mdc-form-field.mat-focused .mdc-notched-outline__leading,
    :host ::ng-deep .mat-mdc-form-field.mat-focused .mdc-notched-outline__trailing,
    :host ::ng-deep .mat-mdc-form-field.mat-focused .mdc-notched-outline__notch {
      border-color: var(--primary-color) !important;
    }

    :host ::ng-deep .mat-icon {
      color: var(--primary-color) !important;
    }

    :host ::ng-deep button[mat-button] {
      color: var(--primary-color) !important;
    }

    :host ::ng-deep button[mat-button]:hover {
      background-color: var(--primary-shadow) !important;
    }
  `]
})
export class PersonSelectionDialogComponent {
  searchTerm = '';
  filteredPersons: PersonDTO[] = [];
  availablePersons: PersonDTO[] = [];

  constructor(
    public dialogRef: MatDialogRef<PersonSelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PersonSelectionData
  ) {
    this.availablePersons = this.data.persons.filter(p => 
      p.status === 'ACTIVO' && !this.hasCredit(p.id)
    );
    this.filteredPersons = [...this.availablePersons];
  }

  hasCredit(personId: number): boolean {
    return this.data.excludePersonsWithCredit.includes(personId);
  }

  filterPersons(): void {
    if (!this.searchTerm.trim()) {
      this.filteredPersons = [...this.availablePersons];
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredPersons = this.availablePersons.filter(person =>
      person.name.toLowerCase().includes(searchTermLower) ||
      person.surname.toLowerCase().includes(searchTermLower) ||
      person.document.toLowerCase().includes(searchTermLower) ||
      person.email?.toLowerCase().includes(searchTermLower) ||
      person.phoneNumber?.toLowerCase().includes(searchTermLower)
    );
  }

  selectPerson(person: PersonDTO): void {
    if (!this.hasCredit(person.id)) {
      this.dialogRef.close(person);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

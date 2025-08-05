import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { PersonService } from '../../core/services/person.service';
import { PersonDTO } from '../../core/models/person.model';
import { PersonFormDialogComponent } from './person-form-dialog.component';

@Component({
  selector: 'app-person-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  template: `
    <div class="person-list-container">
      <div class="header-section">
        <h1 class="page-title">Gestión de Personas</h1>
        <button mat-raised-button color="primary" (click)="openPersonDialog()">
          <mat-icon>add</mat-icon>
          Nueva Persona
        </button>
      </div>

      <mat-card class="table-card">
        <mat-card-content>
          <div *ngIf="loading" class="loading-container">
            <mat-spinner></mat-spinner>
          </div>

          <div *ngIf="!loading && persons.length === 0" class="empty-state">
            <mat-icon class="empty-icon">people_outline</mat-icon>
            <h3>No hay personas registradas</h3>
            <p>Comienza agregando una nueva persona al sistema</p>
            <button mat-raised-button color="primary" (click)="openPersonDialog()">
              <mat-icon>add</mat-icon>
              Agregar Primera Persona
            </button>
          </div>

          <table mat-table [dataSource]="persons" *ngIf="!loading && persons.length > 0" class="persons-table">
            <!-- ID Column -->
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let person">{{person.id}}</td>
            </ng-container>

            <!-- Name Column -->
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Nombre</th>
              <td mat-cell *matCellDef="let person">
                <div class="name-container">
                  <strong>{{person.name}}</strong>
                  <span *ngIf="person.surname"> {{person.surname}}</span>
                </div>
              </td>
            </ng-container>

            <!-- Document Column -->
            <ng-container matColumnDef="document">
              <th mat-header-cell *matHeaderCellDef>Documento</th>
              <td mat-cell *matCellDef="let person">
                <div class="document-container">
                  <mat-chip color="accent" selected>{{person.documentType}}</mat-chip>
                  <span class="document-number">{{person.document}}</span>
                </div>
              </td>
            </ng-container>

            <!-- Email Column -->
            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let person">{{person.email}}</td>
            </ng-container>

            <!-- Phone Column -->
            <ng-container matColumnDef="phone">
              <th mat-header-cell *matHeaderCellDef>Teléfono</th>
              <td mat-cell *matCellDef="let person">{{person.phoneNumber || 'N/A'}}</td>
            </ng-container>

            <!-- Status Column -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let person">
                <mat-chip 
                  [color]="person.status === 'ACTIVO' ? 'primary' : 'warn'" 
                  selected>
                  {{person.status}}
                </mat-chip>
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let person">
                <button mat-icon-button color="primary" (click)="editPerson(person)" matTooltip="Editar">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deletePerson(person)" matTooltip="Eliminar">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="person-row"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .person-list-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .page-title {
      font-size: 32px;
      font-weight: 300;
      color: #333;
      margin: 0;
    }

    .table-card {
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      border-radius: 12px;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 60px;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
    }

    .empty-icon {
      font-size: 64px;
      color: #ccc;
      margin-bottom: 16px;
    }

    .empty-state h3 {
      color: #666;
      margin-bottom: 8px;
    }

    .empty-state p {
      color: #999;
      margin-bottom: 24px;
    }

    .persons-table {
      width: 100%;
    }

    .person-row:hover {
      background-color: #f5f5f5;
    }

    .name-container {
      display: flex;
      flex-direction: column;
    }

    .document-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .document-number {
      font-weight: 500;
    }

    mat-chip {
      font-size: 12px;
      min-height: 24px;
    }

    .mat-mdc-table {
      background: transparent;
    }

    .mat-mdc-header-cell {
      font-weight: 600;
      color: #333;
    }

    @media (max-width: 768px) {
      .header-section {
        flex-direction: column;
        align-items: stretch;
      }
      
      .page-title {
        font-size: 24px;
        text-align: center;
      }
      
      .persons-table {
        font-size: 14px;
      }
    }
  `]
})
export class PersonListComponent implements OnInit {
  persons: PersonDTO[] = [];
  loading = true;
  displayedColumns = ['id', 'name', 'document', 'email', 'phone', 'status', 'actions'];

  constructor(
    private personService: PersonService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPersons();
  }

  loadPersons(): void {
    this.loading = true;
    this.personService.findAllPersons().subscribe({
      next: (persons) => {
        this.persons = persons;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open('Error al cargar personas', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  openPersonDialog(person?: PersonDTO): void {
    const dialogRef = this.dialog.open(PersonFormDialogComponent, {
      width: '600px',
      data: person ? { ...person } : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPersons();
      }
    });
  }

  editPerson(person: PersonDTO): void {
    this.openPersonDialog(person);
  }

  deletePerson(person: PersonDTO): void {
    if (confirm(`¿Está seguro de eliminar a ${person.name} ${person.surname || ''}?`)) {
      this.personService.deletePerson(person.id).subscribe({
        next: () => {
          this.snackBar.open('Persona eliminada correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadPersons();
        },
        error: (error) => {
          this.snackBar.open('Error al eliminar persona', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
}

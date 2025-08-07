import { Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { PersonService } from './person.service';
import { AccountService } from './account.service';
import { CreditService } from './credit.service';

export interface DashboardStats {
  totalPersonas: number;
  cuentasActivas: number;
  creditosOtorgados: number;
  montoTotal: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private personService: PersonService,
    private accountService: AccountService,
    private creditService: CreditService
  ) {}

  getDashboardStats(): Observable<DashboardStats> {
    return forkJoin({
      personas: this.personService.findAllPersons(),
      cuentas: this.accountService.getAllAccounts(),
      creditos: this.creditService.getAllCredits({ page: 0, size: 1000 }) // Get all credits with a large page size
    }).pipe(
      map(({ personas, cuentas, creditos }) => {
        // Calcular estadísticas
        const totalPersonas = personas.length;
        
        // Contar cuentas activas (basado en el estado de la persona asociada)
        const cuentasActivas = cuentas.filter(cuenta => 
          cuenta.person && cuenta.person.status === 'ACTIVO'
        ).length;
        
        // Contar créditos otorgados directamente del endpoint de créditos
        const creditosOtorgados = creditos.totalElements;
        
        // Calcular monto total de todos los balances de cuentas activas
        const montoTotal = cuentas
          .filter(cuenta => cuenta.person && cuenta.person.status === 'ACTIVO')
          .reduce((total, cuenta) => total + (cuenta.balance || 0), 0);

        return {
          totalPersonas,
          cuentasActivas,
          creditosOtorgados,
          montoTotal
        };
      })
    );
  }
}

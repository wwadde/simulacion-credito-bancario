import { Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { PersonService } from './person.service';
import { AccountService } from './account.service';

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
    private accountService: AccountService
  ) {}

  getDashboardStats(): Observable<DashboardStats> {
    return forkJoin({
      personas: this.personService.findAllPersons(),
      cuentas: this.accountService.getAllAccounts()
    }).pipe(
      map(({ personas, cuentas }) => {
        // Calcular estadísticas
        const totalPersonas = personas.length;
        
        // Contar cuentas activas (basado en el estado de la persona asociada)
        const cuentasActivas = cuentas.filter(cuenta => 
          cuenta.person && cuenta.person.status === 'ACTIVO'
        ).length;
        
        // Contar créditos otorgados basado en cuentas que han tenido movimientos de pago
        // Esto es una aproximación ya que no tenemos un endpoint directo para créditos
        const creditosOtorgados = cuentas.filter(cuenta => 
          cuenta.paymentList && cuenta.paymentList.length > 0
        ).length;
        
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

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreditDTO, CreateCreditDTO } from '../models/credit.model';
import { PaymentDTO } from '../models/account.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CreditService {
  private readonly API_URL = environment.creditoApiUrl;

  constructor(private http: HttpClient) {}

  createCredit(personId: number, credit: CreateCreditDTO): Observable<string> {
    const params = new HttpParams().set('personId', personId.toString());
    return this.http.post<string>(`${this.API_URL}/api/credits`, credit, { params });
  }

  getCredit(personId: number): Observable<CreditDTO[]> {
    return this.http.get<CreditDTO | CreditDTO[]>(`${this.API_URL}/api/credits/${personId}`)
      .pipe(
        map(response => {
          // Si la respuesta es un array, devolverlo directamente
          if (Array.isArray(response)) {
            console.log('API returned array of credits:', response);
            return response;
          }
          // Si es un objeto directo, convertirlo a array
          console.log('API returned single credit, converting to array:', response);
          return [response];
        })
      );
  }

  makePayment(creditId: number, personId: number, payment: PaymentDTO): Observable<string> {
    const params = new HttpParams().set('personId', personId.toString());
    return this.http.post<string>(`${this.API_URL}/api/credits/${creditId}/payments`, payment, { params });
  }

  deleteCredit(creditId: number, personId: number): Observable<void> {
    const params = new HttpParams().set('personId', personId.toString());
    return this.http.delete<void>(`${this.API_URL}/api/credits/${creditId}`, { params });
  }
}

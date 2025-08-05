import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountDTO } from '../models/account.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly API_URL = environment.cuentaApiUrl;

  constructor(private http: HttpClient) {}

  createAccount(personId: number, balance: number): Observable<string> {
    const params = new HttpParams()
      .set('personId', personId.toString())
      .set('balance', balance.toString());
    
    return this.http.post<string>(`${this.API_URL}/api/create-account`, null, { params });
  }

  getAccount(personId: number): Observable<AccountDTO> {
    const params = new HttpParams().set('personId', personId.toString());
    return this.http.get<AccountDTO>(`${this.API_URL}/api`, { params });
  }

  getAllAccounts(): Observable<AccountDTO[]> {
    return this.http.get<AccountDTO[]>(`${this.API_URL}/api/all`);
  }

  updateBalance(personId: number, addAmount: number): Observable<string> {
    const params = new HttpParams()
      .set('personId', personId.toString())
      .set('addAmount', addAmount.toString());
    
    return this.http.put<string>(`${this.API_URL}/api/update-balance`, null, { params });
  }

  sendPayment(personId: number, amount: number, creditId: number): Observable<string> {
    const params = new HttpParams()
      .set('personId', personId.toString())
      .set('amount', amount.toString())
      .set('creditId', creditId.toString());
    
    return this.http.post<string>(`${this.API_URL}/api/send-payment`, null, { params });
  }

  deleteAccount(personId: number): Observable<string> {
    const params = new HttpParams().set('personId', personId.toString());
    return this.http.delete<string>(`${this.API_URL}/api/delete-account`, { params });
  }
}

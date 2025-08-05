import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError, of } from 'rxjs';
import { AuthResponse, LoginRequest, RefreshTokenRequest } from '../models/auth.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.authApiUrl;
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStoredUser();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/api/login`, credentials)
      .pipe(
        tap(response => {
          if (response.accessToken) {
            this.setSession(response);
          }
        })
      );
  }

  refreshToken(token: string): Observable<AuthResponse> {
    const request: RefreshTokenRequest = { accessToken: token };
    return this.http.post<AuthResponse>(`${this.API_URL}/api/refresh-token`, request)
      .pipe(
        tap(response => {
          if (response.accessToken) {
            this.setSession(response);
          }
        })
      );
  }

  logout(): Observable<string> {
    return this.http.post<string>(`${this.API_URL}/api/logout`, {})
      .pipe(
        tap(() => {
          this.clearSession();
        }),
        catchError((error: any) => {
          // Incluso si el logout falla en el servidor, limpiar la sesión local
          this.clearSession();
          // Retornar éxito para evitar errores en la UI
          return of('Logout completed locally');
        })
      );
  }

  private setSession(authResult: AuthResponse): void {
    console.log('Setting session with:', authResult);
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('expires_at', authResult.expiresAt);
    localStorage.setItem('token_type', authResult.tokenType);
    
    // Actualizar el subject inmediatamente
    this.currentUserSubject.next(authResult);
    
    console.log('Session set. Is authenticated:', this.isAuthenticated());
    console.log('Token stored:', localStorage.getItem('access_token'));
    console.log('Expires at stored:', localStorage.getItem('expires_at'));
  }

  private clearSession(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('token_type');
    this.currentUserSubject.next(null);
  }

  public clearSessionPublic(): void {
    this.clearSession();
  }

  private loadStoredUser(): void {
    const token = localStorage.getItem('access_token');
    const expiresAt = localStorage.getItem('expires_at');
    
    if (token && expiresAt && new Date(expiresAt) > new Date()) {
      this.currentUserSubject.next({
        accessToken: token,
        expiresAt: expiresAt,
        tokenType: localStorage.getItem('token_type')
      });
    }
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const expiresAt = localStorage.getItem('expires_at');
    
    console.log('Checking authentication - token exists:', !!token);
    console.log('Checking authentication - expiresAt:', expiresAt);
    
    if (!token || !expiresAt) {
      console.log('No token or expiration date found');
      return false;
    }
    
    try {
      const expirationDate = new Date(expiresAt);
      const currentDate = new Date();
      const isValid = expirationDate > currentDate;
      
      console.log('Current date:', currentDate.toISOString());
      console.log('Expiration date:', expirationDate.toISOString());
      console.log('Token is valid:', isValid);
      
      return isValid;
    } catch (error) {
      console.error('Error parsing expiration date:', error);
      return false;
    }
  }

  isTokenExpired(): boolean {
    const expiresAt = localStorage.getItem('expires_at');
    if (!expiresAt) {
      return true;
    }
    return new Date(expiresAt) <= new Date();
  }
}

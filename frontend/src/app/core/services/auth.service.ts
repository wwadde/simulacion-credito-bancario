import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError, of } from 'rxjs';
import { AuthResponse, LoginRequest, RefreshTokenRequest } from '../models/auth.model';
import { environment } from '../../../environments/environment';
import { LoggerService } from './logger.service';
import { API_ENDPOINTS, STORAGE_KEYS } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.authApiUrl;
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private logger: LoggerService
  ) {
    this.loadStoredUser();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}${API_ENDPOINTS.AUTH.LOGIN}`, credentials)
      .pipe(
        tap(response => {
          if (response.accessToken) {
            this.setSession(response);
            this.logger.info('User logged in successfully');
          }
        })
      );
  }

  refreshToken(token: string): Observable<AuthResponse> {
    const request: RefreshTokenRequest = { accessToken: token };
    return this.http.post<AuthResponse>(`${this.API_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`, request)
      .pipe(
        tap(response => {
          if (response.accessToken) {
            this.setSession(response);
            this.logger.debug('Token refreshed successfully');
          }
        })
      );
  }

  logout(): Observable<string> {
    return this.http.post<string>(`${this.API_URL}${API_ENDPOINTS.AUTH.LOGOUT}`, {})
      .pipe(
        tap(() => {
          this.clearSession();
          this.logger.info('User logged out successfully');
        }),
        catchError((error: any) => {
          // Incluso si el logout falla en el servidor, limpiar la sesión local
          this.clearSession();
          this.logger.warn('Logout failed on server, clearing local session', error);
          // Retornar éxito para evitar errores en la UI
          return of('Logout completed locally');
        })
      );
  }

  private setSession(authResult: AuthResponse): void {
    this.logger.debug('Setting user session', { tokenType: authResult.tokenType, expiresAt: authResult.expiresAt });
    
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, authResult.accessToken);
    localStorage.setItem(STORAGE_KEYS.EXPIRES_AT, authResult.expiresAt);
    localStorage.setItem(STORAGE_KEYS.TOKEN_TYPE, authResult.tokenType);
    
    // Actualizar el subject inmediatamente
    this.currentUserSubject.next(authResult);
    
    this.logger.debug('Session established', { 
      isAuthenticated: this.isAuthenticated(),
      hasToken: !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    });
  }

  private clearSession(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.EXPIRES_AT);
    localStorage.removeItem(STORAGE_KEYS.TOKEN_TYPE);
    this.currentUserSubject.next(null);
    this.logger.debug('User session cleared');
  }

  public clearSessionPublic(): void {
    this.clearSession();
  }

  private loadStoredUser(): void {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const expiresAt = localStorage.getItem(STORAGE_KEYS.EXPIRES_AT);
    
    if (token && expiresAt && new Date(expiresAt) > new Date()) {
      this.currentUserSubject.next({
        accessToken: token,
        expiresAt: expiresAt,
        tokenType: localStorage.getItem(STORAGE_KEYS.TOKEN_TYPE)
      });
      this.logger.debug('Stored user session loaded');
    }
  }

  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const expiresAt = localStorage.getItem(STORAGE_KEYS.EXPIRES_AT);
    
    this.logger.debug('Checking authentication status', { 
      hasToken: !!token, 
      expiresAt 
    });
    
    if (!token || !expiresAt) {
      this.logger.debug('Authentication failed: missing token or expiration');
      return false;
    }
    
    try {
      const expirationDate = new Date(expiresAt);
      const currentDate = new Date();
      const isValid = expirationDate > currentDate;
      
      this.logger.debug('Token validation result', {
        currentDate: currentDate.toISOString(),
        expirationDate: expirationDate.toISOString(),
        isValid
      });
      
      return isValid;
    } catch (error) {
      this.logger.error('Error parsing expiration date', error);
      return false;
    }
  }

  isTokenExpired(): boolean {
    const expiresAt = localStorage.getItem(STORAGE_KEYS.EXPIRES_AT);
    if (!expiresAt) {
      return true;
    }
    return new Date(expiresAt) <= new Date();
  }
}

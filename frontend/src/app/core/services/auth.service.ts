import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError, of, timer, Subscription } from 'rxjs';
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
  private refreshTokenTimer?: Subscription;
  private isRefreshing = false;
  private lastActivityTime = new Date();

  constructor(
    private http: HttpClient,
    private logger: LoggerService
  ) {
    this.loadStoredUser();
    this.setupActivityTracking();
  }

  ngOnDestroy(): void {
    this.stopRefreshTimer();
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
    return this.http.post(`${this.API_URL}${API_ENDPOINTS.AUTH.LOGOUT}`, {}, { 
      responseType: 'text' 
    })
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
    
    // Iniciar el timer de refresh automático
    this.startRefreshTimer();
    
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
    this.stopRefreshTimer();
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
      this.startRefreshTimer();
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

  /**
   * Inicia un timer que refresca automáticamente el token antes de que expire
   */
  private startRefreshTimer(): void {
    this.stopRefreshTimer();
    
    const expiresAt = localStorage.getItem(STORAGE_KEYS.EXPIRES_AT);
    if (!expiresAt) {
      return;
    }

    const expirationDate = new Date(expiresAt);
    const currentDate = new Date();
    const timeUntilExpiry = expirationDate.getTime() - currentDate.getTime();
    
    // Refrescar el token 30 segundos antes de que expire
    const refreshTime = Math.max(timeUntilExpiry - (30 * 1000), 10000); // Mínimo 10 segundos
    
    if (refreshTime > 0) {
      this.logger.debug(`Token refresh scheduled in ${refreshTime / 1000} seconds`);
      
      this.refreshTokenTimer = timer(refreshTime).subscribe(() => {
        this.refreshTokenAutomatically();
      });
    }
  }

  /**
   * Detiene el timer de refresh automático
   */
  private stopRefreshTimer(): void {
    if (this.refreshTokenTimer) {
      this.refreshTokenTimer.unsubscribe();
      this.refreshTokenTimer = undefined;
      this.logger.debug('Refresh timer stopped');
    }
  }

  /**
   * Refresca el token automáticamente si no hay otro refresh en curso
   */
  private refreshTokenAutomatically(): void {
    if (this.isRefreshing) {
      this.logger.debug('Refresh already in progress, skipping automatic refresh');
      return;
    }

    // Verificar si el usuario ha estado activo en los últimos 30 minutos
    const timeSinceLastActivity = new Date().getTime() - this.lastActivityTime.getTime();
    const maxInactivityTime = 30 * 60 * 1000; // 30 minutos
    
    if (timeSinceLastActivity > maxInactivityTime) {
      this.logger.debug('User inactive for too long, skipping automatic refresh');
      this.clearSession();
      return;
    }

    const token = this.getToken();
    if (!token) {
      this.logger.debug('No token available for automatic refresh');
      return;
    }

    this.isRefreshing = true;
    this.logger.debug('Starting automatic token refresh');

    this.refreshToken(token).subscribe({
      next: (response) => {
        this.logger.info('Token refreshed automatically');
        this.isRefreshing = false;
      },
      error: (error) => {
        this.logger.error('Automatic token refresh failed', error);
        this.isRefreshing = false;
        this.clearSession();
      }
    });
  }

  /**
   * Configura el seguimiento de actividad del usuario
   */
  private setupActivityTracking(): void {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const updateActivity = () => {
      this.lastActivityTime = new Date();
    };

    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });
  }

  /**
   * Actualiza manualmente el tiempo de última actividad
   */
  public updateActivity(): void {
    this.lastActivityTime = new Date();
  }

  /**
   * Verifica si hay un refresh en progreso
   */
  public isRefreshingToken(): boolean {
    return this.isRefreshing;
  }
}

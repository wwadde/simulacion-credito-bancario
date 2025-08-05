import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoggerService } from '../services/logger.service';
import { STORAGE_KEYS } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private logger: LoggerService
  ) {}

  canActivate(): boolean {
    this.logger.debug('AuthGuard: Checking authentication');
    
    // Verificar si hay token en localStorage
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const expiresAt = localStorage.getItem(STORAGE_KEYS.EXPIRES_AT);
    
    this.logger.debug('AuthGuard: Token validation', { 
      hasToken: !!token, 
      expiresAt 
    });
    
    const isAuth = this.authService.isAuthenticated();
    
    if (isAuth) {
      this.logger.debug('AuthGuard: User authenticated, access granted');
      return true;
    } else {
      this.logger.info('AuthGuard: User not authenticated, redirecting to login');
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}

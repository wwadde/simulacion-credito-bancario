import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    console.log('AuthGuard: Checking authentication...');
    
    // Verificar si hay token en localStorage
    const token = localStorage.getItem('access_token');
    const expiresAt = localStorage.getItem('expires_at');
    console.log('AuthGuard: Token exists:', !!token);
    console.log('AuthGuard: Expires at:', expiresAt);
    
    const isAuth = this.authService.isAuthenticated();
    console.log('AuthGuard: Is authenticated?', isAuth);
    
    if (isAuth) {
      console.log('AuthGuard: User is authenticated, allowing access');
      return true;
    } else {
      console.log('AuthGuard: User is not authenticated, redirecting to login');
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}

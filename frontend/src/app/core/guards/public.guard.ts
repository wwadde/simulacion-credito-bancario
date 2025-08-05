import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PublicGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    console.log('PublicGuard: Checking authentication...');
    
    // Verificar si hay token en localStorage
    const token = localStorage.getItem('access_token');
    const expiresAt = localStorage.getItem('expires_at');
    console.log('PublicGuard: Token exists:', !!token);
    console.log('PublicGuard: Expires at:', expiresAt);
    
    const isAuth = this.authService.isAuthenticated();
    console.log('PublicGuard: Is authenticated?', isAuth);
    
    if (!isAuth) {
      console.log('PublicGuard: User is not authenticated, allowing access to public route');
      return true;
    } else {
      console.log('PublicGuard: User is authenticated, redirecting to dashboard');
      this.router.navigate(['/dashboard']);
      return false;
    }
  }
}

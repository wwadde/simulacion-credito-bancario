import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add auth header with jwt if account is logged in and request is to the api url
    const token = this.authService.getToken();
    const isApiUrl = this.isApiUrl(req.url);
    
    if (token && isApiUrl) {
      req = this.addTokenHeader(req, token);
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && isApiUrl) {
          return this.handle401Error(req, next);
        }
        return throwError(() => error);
      })
    );
  }

  private isApiUrl(url: string): boolean {
    return url.includes('/api/') || url.includes('/private/');
  }

  private addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    
    if (token && !this.authService.isTokenExpired()) {
      return this.authService.refreshToken(token).pipe(
        switchMap((response) => {
          const newToken = response.accessToken;
          return next.handle(this.addTokenHeader(request, newToken));
        }),
        catchError((error) => {
          this.authService.logout().subscribe();
          this.router.navigate(['/auth/login']);
          return throwError(() => error);
        })
      );
    } else {
      this.authService.logout().subscribe();
      this.router.navigate(['/auth/login']);
      return throwError(() => new Error('Token expired'));
    }
  }
}

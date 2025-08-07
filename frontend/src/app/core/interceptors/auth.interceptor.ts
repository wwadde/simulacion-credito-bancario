import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { throwError, EMPTY } from 'rxjs';
import { catchError, switchMap, delay, retryWhen, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Add auth header with jwt if account is logged in and request is to the api url
  const token = authService.getToken();
  const isApiUrl = isApiUrlFn(req.url);
  const isLogoutUrl = req.url.includes('/logout');
  
  // Actualizar actividad del usuario en cada request a la API
  if (isApiUrl && !isLogoutUrl) {
    authService.updateActivity();
  }
  
  if (token && isApiUrl) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Evitar bucle infinito: no procesar errores 401 en logout o refresh-token
      if (error.status === 401 && isApiUrl && !isLogoutUrl && !req.url.includes('/refresh-token')) {
        return handle401Error(req, next, authService, router);
      }
      // Para logout, no interceptar el error, dejar que el servicio lo maneje
      return throwError(() => error);
    })
  );
};

function isApiUrlFn(url: string): boolean {
  return url.includes('/api/') || url.includes('/private/');
}

function handle401Error(request: HttpRequest<unknown>, next: HttpHandlerFn, authService: AuthService, router: Router) {
  const token = authService.getToken();
  
  if (token && !authService.isTokenExpired()) {
    // Si ya hay un refresh en progreso, esperar un poco y reintentar
    if (authService.isRefreshingToken()) {
      return EMPTY.pipe(
        delay(1000),
        switchMap(() => {
          const newToken = authService.getToken();
          if (newToken && newToken !== token) {
            const newRequest = request.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`
              }
            });
            return next(newRequest);
          } else {
            authService.clearSessionPublic();
            router.navigate(['/auth/login']);
            return throwError(() => new Error('Token refresh failed'));
          }
        })
      );
    }

    // Intentar refresh del token
    return authService.refreshToken(token).pipe(
      switchMap((response) => {
        const newToken = response.accessToken;
        const newRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${newToken}`
          }
        });
        return next(newRequest);
      }),
      catchError((error) => {
        // Solo limpiar sesión local, no hacer llamada al logout endpoint
        authService.clearSessionPublic();
        router.navigate(['/auth/login']);
        return throwError(() => error);
      })
    );
  } else {
    // Solo limpiar sesión local, no hacer llamada al logout endpoint
    authService.clearSessionPublic();
    router.navigate(['/auth/login']);
    return throwError(() => new Error('Token expired'));
  }
}

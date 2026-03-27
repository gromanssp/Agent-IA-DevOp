import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Interceptor que inyecta el Bearer token de Cubepath
 * en las peticiones a la API de Cubepath.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getCubepathToken();

  // Solo inyectar token en requests a la API de Cubepath
  if (token && req.url.includes('api.cubepath.com')) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(cloned);
  }

  return next(req);
};

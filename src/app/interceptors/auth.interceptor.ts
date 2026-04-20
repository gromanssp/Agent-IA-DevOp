import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Auth interceptor — two responsibilities:
 *
 * 1. Direct CubePath API calls (api.cubepath.com):
 *    Adds `Authorization: Bearer {token}` — standard REST auth.
 *
 * 2. n8n webhook calls (/webhook/ or /api/webhook):
 *    Adds `X-Cubepath-Token: {token}` as a custom header instead of
 *    embedding the token in the request body.
 *
 * SECURITY RATIONALE — why use a header, not the body:
 *   - n8n logs the full execution body by default. Putting the API key
 *     in the body means it appears in n8n's execution history in plaintext.
 *   - HTTP headers are NOT logged by n8n's execution recorder, so the
 *     token stays out of persistent logs.
 *   - Separating auth credentials (headers) from business payload (body)
 *     follows the HTTP semantics and principle of least exposure.
 *   - HTTPS encrypts both headers and body in transit, so there is no
 *     additional transit risk from using headers.
 *
 * n8n workflow must read the token with:
 *   {{ $('Webhook').item.json.headers['x-cubepath-token'] }}
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getCubepathToken();

  if (!token) {
    return next(req);
  }

  // Case 1: direct CubePath REST API — standard Bearer auth
  if (req.url.includes('api.cubepath.com')) {
    return next(req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    }));
  }

  // Case 2: n8n webhook (proxied via Nginx as /webhook/ or /api/webhook/)
  // SECURITY: token goes in a custom header, never in the request body,
  // to avoid it being captured in n8n execution logs.
  if (req.url.includes('/webhook/')) {
    return next(req.clone({
      setHeaders: { 'X-Cubepath-Token': token }
    }));
  }

  return next(req);
};

import { Injectable, signal, computed } from '@angular/core';
import { environment } from '../../environments/environment';

const STORAGE_KEY = 'webhook_test_mode';

@Injectable({ providedIn: 'root' })
export class WebhookModeService {
  readonly isTestMode = signal<boolean>(
    localStorage.getItem(STORAGE_KEY) === 'true'
  );

  readonly webhookUrl = computed(() => {
    const base = environment.n8nWebhookUrl;
    if (this.isTestMode()) {
      return base.replace('/api/webhook/', '/api/webhook-test/');
    }
    return base.replace('/api/webhook-test/', '/api/webhook/');
  });

  toggle(): void {
    const next = !this.isTestMode();
    this.isTestMode.set(next);
    localStorage.setItem(STORAGE_KEY, String(next));
  }
}

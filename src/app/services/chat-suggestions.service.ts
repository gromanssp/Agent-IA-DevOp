import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface SuggestionItem {
  label: string;
  text: string;
  svgPath: string;
}

export const SIDEBAR_SUGGESTIONS: SuggestionItem[] = [
  {
    label: 'Listar VPS',
    text: '¿Cuántos VPS tengo activos?',
    svgPath: 'M4 6h16M4 10h16M4 14h16M4 18h16',
  },
  {
    label: 'Ver métricas',
    text: 'Muestra las métricas de mi VPS',
    svgPath: 'M3 3v18h18M9 17V9m4 8V5m4 12v-4',
  },
  {
    label: 'Reiniciar',
    text: 'Reinicia el servidor de producción',
    svgPath: 'M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15',
  },
  {
    label: 'Encender',
    text: 'Enciende mi VPS',
    svgPath: 'M13 2L3 14h9l-1 8 10-12h-9l1-8',
  },
  {
    label: 'Apagar',
    text: 'Apagar el servidor',
    svgPath: 'M18.36 6.64a9 9 0 1 1-12.73 0M12 2v10',
  },
  {
    label: 'Ver planes',
    text: 'Muestra los planes de VPS disponibles',
    svgPath: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  },
];

@Injectable({ providedIn: 'root' })
export class ChatSuggestionsService {
  private _suggestion$ = new Subject<string>();
  readonly suggestion$ = this._suggestion$.asObservable();

  send(text: string): void {
    this._suggestion$.next(text);
  }
}

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { routes } from './app.routes';
import { ACTION_HANDLERS } from './services/handlers/action-handler.token';
import { VpsListHandler } from './services/handlers/vps-list.handler';
import { VpsPlansHandler } from './services/handlers/vps-plans.handler';
import { VpsMetricsHandler } from './services/handlers/vps-metrics.handler';
import { VpsSingleHandler } from './services/handlers/vps-single.handler';
import { AgentResponseHandler } from './services/handlers/agent-response.handler';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideCharts(withDefaultRegisterables()),
    { provide: ACTION_HANDLERS, useClass: VpsListHandler,      multi: true },
    { provide: ACTION_HANDLERS, useClass: VpsPlansHandler,     multi: true },
    { provide: ACTION_HANDLERS, useClass: VpsMetricsHandler,   multi: true },
    { provide: ACTION_HANDLERS, useClass: VpsSingleHandler,    multi: true },
    { provide: ACTION_HANDLERS, useClass: AgentResponseHandler, multi: true },
  ]
};

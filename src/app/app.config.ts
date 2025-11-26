import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {providePrimeNG} from 'primeng/config';
import {BlueTheme} from '../blue-theme';
import {provideHttpClient} from '@angular/common/http';
import {MessageService} from 'primeng/api';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    MessageService,
    providePrimeNG({
      theme: {
        preset: BlueTheme,
        options: {
          prefix: 'my',
          darkModeSelector: 'none'
        }

      }
    })
  ]
} as ApplicationConfig

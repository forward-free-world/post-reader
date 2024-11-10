import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { LucideAngularModule, Info, Wand } from 'lucide-angular';
import Showdown from 'showdown';

import { DiskPostReader } from './services/post-reader.service';
import { MARKDOWN_CONVERTER } from './tokens/markdown-converter.token';
import { POST_READER } from './tokens/post-reader.token';
import { routes } from './app.routes';
import { SITE_TITLE } from './tokens/site-title.token';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    importProvidersFrom(LucideAngularModule.pick({ Info, Wand })),
    {
      provide: POST_READER,
      useExisting: DiskPostReader
    },
    { provide: MARKDOWN_CONVERTER, useFactory: () => new Showdown.Converter() },
    { provide: SITE_TITLE, useValue: 'post reader' }
  ]
};

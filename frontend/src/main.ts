// frontend/src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      RouterModule.forRoot(routes, {
        enableTracing: false, // Mettre à true pour debug les routes
        scrollPositionRestoration: 'top'
      }),
      HttpClientModule,
      BrowserAnimationsModule
    )
  ]
}).catch(err => console.error(err));
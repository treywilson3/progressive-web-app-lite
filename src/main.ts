import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { ServiceWorkerInitializingService } from './app/service-worker-compileable/service-worker-initialization';

if (environment.production) {
  enableProdMode();
}

ServiceWorkerInitializingService.initialize();

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

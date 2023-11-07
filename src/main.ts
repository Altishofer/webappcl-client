import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {environment} from "environments/environment";

import { AppModule } from './app/app.module';

let backgroundImage : string = environment.BACKGROUND_IMG;

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

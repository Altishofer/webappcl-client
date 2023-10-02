import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutRoutingModule } from './about-routing.module';
import {SharedModule} from "@shared/shared.module";
import { AboutComponent } from './pages/about/about.component';
import {HeaderComponent} from "@layout/header/header.component";


@NgModule({
  declarations: [
    AboutComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AboutRoutingModule,
    HeaderComponent
  ]
})
export class AboutModule { }

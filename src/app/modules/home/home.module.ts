import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {SharedModule} from "@shared/shared.module";
import { HomeComponent } from './pages/home/home.component';
import { SandrinComponent } from './pages/sandrin/sandrin.component';
import {HomeRoutingModule} from "@modules/home/home-routing.module";

@NgModule({
  declarations: [
    HomeComponent,
    SandrinComponent
  ],
    imports: [
        CommonModule,
        SharedModule,
        HomeRoutingModule
    ]
})
export class HomeModule { }

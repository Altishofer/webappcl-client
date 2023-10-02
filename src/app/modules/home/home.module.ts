import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {SharedModule} from "@shared/shared.module";
import { GameComponent } from '@modules/home/pages/game/game.component';
import { SandrinComponent } from './pages/sandrin/sandrin.component';
import {HomeRoutingModule} from "@modules/home/home-routing.module";
import {HeaderComponent} from "@layout/header/header.component";

@NgModule({
  declarations: [
    GameComponent,
    SandrinComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    HeaderComponent
  ]
})
export class HomeModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {SharedModule} from "@shared/shared.module";
import { GameComponent } from '@modules/home/pages/game/game.component';
import { SandrinComponent } from './pages/sandrin/sandrin.component';
import {HomeRoutingModule} from "@modules/home/home-routing.module";

@NgModule({
  declarations: [
    GameComponent,
    SandrinComponent
  ],
    imports: [
        CommonModule,
        SharedModule,
        HomeRoutingModule
    ]
})
export class HomeModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "@shared/shared.module";

import { PlayerRoutingModule } from './player-routing.module';
import { WordCalcComponent } from './pages/word-calc/word-calc.component';
import { RegisterComponent } from './pages/register/register.component';
import { WaitingComponent } from './pages/waiting/waiting.component';
import { RankingComponent } from './pages/ranking/ranking.component';


@NgModule({
  declarations: [
    WordCalcComponent,
    RegisterComponent,
    WaitingComponent,
    RankingComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PlayerRoutingModule,
  ]
})
export class PlayerModule { }

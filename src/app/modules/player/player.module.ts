import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "@shared/shared.module";

import { PlayerRoutingModule } from './player-routing.module';
import { WordCalcComponent } from './pages/word-calc/word-calc.component';


@NgModule({
  declarations: [
    WordCalcComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PlayerRoutingModule,
  ]
})
export class PlayerModule { }

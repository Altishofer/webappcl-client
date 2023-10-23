import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WordCalcComponent } from "./pages/word-calc/word-calc.component";
import {RegisterComponent} from "@modules/player/pages/register/register.component";
import {WaitingComponent} from "@modules/player/pages/waiting/waiting.component";
import {RankingComponent} from "@modules/player/pages/ranking/ranking.component";

const routes: Routes = [
  {
    path:'', redirectTo:'register', pathMatch:'full'
  },
  {
    path:'register', component:RegisterComponent
  },
  {
    path:'waiting', component:WaitingComponent
  },
  {
    path:'game', component:WordCalcComponent
  },
  {
    path:'ranking', component:RankingComponent
  }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlayerRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GameComponent} from "@modules/home/pages/game/game.component";
import {SandrinComponent} from "./pages/sandrin/sandrin.component";

const routes: Routes = [
  {
    path:'', redirectTo:'game', pathMatch:'full'
  },
  {
    path:'game', component:GameComponent
  },
  {
    path:'sandrin', component:SandrinComponent
  }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }

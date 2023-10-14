import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GameSelectionComponent} from "@modules/home/pages/game-selection/game-selection.component";
import {SandrinComponent} from "./pages/sandrin/sandrin.component";

const routes: Routes = [
  {
    path:'', component:GameSelectionComponent
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

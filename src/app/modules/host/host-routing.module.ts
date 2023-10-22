import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {QuizSelectionComponent} from "@modules/host/pages/quiz-selection/quiz-selection.component";
import {SandrinComponent} from "./pages/sandrin/sandrin.component";
import {QuizPreviewComponent} from "@modules/host/pages/quiz-preview/quiz-preview.component";
import {LoginComponent} from "@modules/host/pages/login/login.component";
import {LobbyComponent} from "@modules/host/pages/lobby/lobby.component";
import {RoundMainComponent} from "@modules/host/pages/round-main/round-main.component";
import {ResultsComponent} from "@modules/host/pages/results/results.component";

const routes: Routes = [
  {
    path:'', redirectTo: 'login', pathMatch: "full"
  },
  {
    path:'sandrin', component:SandrinComponent
  },
  {
    path:'login',
    component:LoginComponent
  },
  {
    path:'selection',
    component:QuizSelectionComponent
  },
  {
    path:'preview', component: QuizPreviewComponent
  },
  {
    path:'lobby', component: LobbyComponent
  },
  {
    path:'round', component: RoundMainComponent
  },
  {
    path:'results', component: ResultsComponent
  }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HostRoutingModule { }

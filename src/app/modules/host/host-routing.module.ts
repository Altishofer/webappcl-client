import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {QuizSelectionComponent} from "@modules/host/pages/quiz-selection/quiz-selection.component";
import {QuizPreviewComponent} from "@modules/host/pages/quiz-preview/quiz-preview.component";
import {LoginComponent} from "@modules/host/pages/login/login.component";
import {LobbyComponent} from "@modules/host/pages/lobby/lobby.component";
import {RoundMainComponent} from "@modules/host/pages/round-main/round-main.component";
import {ResultsComponent} from "@modules/host/pages/results/results.component";

const routes: Routes = [
  {
    path:'', redirectTo: 'login', pathMatch: "prefix"
  },
  {
    path:'login', component:LoginComponent
  },
  {
    path:':hostId/selection', component:QuizSelectionComponent
  },
  {
    path:':hostId/preview/:quizId', component: QuizPreviewComponent
  },
  {
    path:':hostId/lobby/:quizId', component: LobbyComponent
  },
  {
    path:':hostId/round/:quizId/:roundId', component: RoundMainComponent
  },
  {
    path:':hostId/results/:quizId/:roundId', component: ResultsComponent
  },
  {
    path:':hostId/results/:quizId', component: ResultsComponent
  }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HostRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {QuizSelectionComponent} from "@modules/host/pages/quiz-selection/quiz-selection.component";
import {QuizPreviewComponent} from "@modules/host/pages/quiz-preview/quiz-preview.component";
import {LoginComponent} from "@modules/host/pages/login/login.component";
import {LobbyComponent} from "@modules/host/pages/lobby/lobby.component";
import {RoundMainComponent} from "@modules/host/pages/round-main/round-main.component";
import {ResultsComponent} from "@modules/host/pages/results/results.component";
import {authGuard, loggedInGuard} from "@data/guards/authentication.guard";

const routes: Routes = [
  {
    path:'',
    redirectTo: 'login',
    pathMatch: "prefix"
  },
  {
    path:'login',
    component:LoginComponent,
    canActivate: [loggedInGuard]
  },
  {
    path:':hostId/selection',
    component:QuizSelectionComponent,
    canActivate: [authGuard]
  },
  {
    path:':hostId/lobby/:quizId',
    component: LobbyComponent,
    canActivate: [authGuard]
  },
  {
    path:':hostId/round/:quizId/:roundId',
    component: RoundMainComponent,
    canActivate: [authGuard]
  },
  {
    path:':hostId/results/:quizId/:roundId',
    component: ResultsComponent,
    canActivate: [authGuard]
  },
  {
    path:':hostId/results/:quizId',
    component: ResultsComponent,
    canActivate: [authGuard]
  }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HostRoutingModule { }

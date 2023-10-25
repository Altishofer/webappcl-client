import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {QuizSelectionComponent} from "@modules/host/pages/quiz-selection/quiz-selection.component";
import {SandrinComponent} from "./pages/sandrin/sandrin.component";
import {QuizPreviewComponent} from "@modules/host/pages/quiz-preview/quiz-preview.component";
import {LoginComponent} from "@modules/host/pages/login/login.component";
import {LobbyComponent} from "@modules/host/pages/lobby/lobby.component";
import {RoundMainComponent} from "@modules/host/pages/round-main/round-main.component";
import {ResultsComponent} from "@modules/host/pages/results/results.component";
import {QuizCreationComponent} from "@modules/host/pages/quiz-creation/quiz-creation.component";

const routes: Routes = [
  {
    path:'', redirectTo: 'login', pathMatch: "full"
  },
  {
    path:'sandrin', component:SandrinComponent
  },
  {
    path:'login', component:LoginComponent
  },
  {
    path:'selection', component:QuizSelectionComponent
  },
  {
    path:'preview/:quizId', component: QuizPreviewComponent
  },
  {
    path:'lobby/:quizId', component: LobbyComponent
  },
  {
    path:'round/:quizId/:roundId', component: RoundMainComponent
  },
  {
    path:'results/:quizId', component: ResultsComponent
  },
  {
    path:'creation', component:QuizCreationComponent
  }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HostRoutingModule { }

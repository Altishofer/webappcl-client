import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {QuizSelectionComponent} from "@modules/host/pages/quiz-selection/quiz-selection.component";
import {SandrinComponent} from "./pages/sandrin/sandrin.component";
import {QuizPreviewComponent} from "@modules/host/pages/quiz-preview/quiz-preview.component";
import {LoginComponent} from "@modules/host/pages/login/login.component";

const routes: Routes = [
  {
    path:'', redirectTo: 'login', pathMatch: "full"
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
    path:'sandrin', component:SandrinComponent
  }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HostRoutingModule { }

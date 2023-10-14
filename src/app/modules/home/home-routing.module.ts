import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {QuizSelectionComponent} from "@modules/home/pages/quiz-selection/quiz-selection.component";
import {SandrinComponent} from "./pages/sandrin/sandrin.component";
import {QuizPreviewComponent} from "@modules/home/pages/quiz-preview/quiz-preview.component";

const routes: Routes = [
  {
    path:'', redirectTo: 'selection', pathMatch: "full"
  },
  {
    path:'selection', component:QuizSelectionComponent
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
export class HomeRoutingModule { }

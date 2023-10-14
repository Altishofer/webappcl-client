import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "@shared/shared.module";
import { HomeRoutingModule } from "@modules/home/home-routing.module";

import { QuizSelectionComponent } from '@modules/home/pages/quiz-selection/quiz-selection.component';
import { SandrinComponent } from './pages/sandrin/sandrin.component';
import { HeaderComponent } from "@layout/header/header.component";
import { QuizPreviewComponent } from './pages/quiz-preview/quiz-preview.component';

@NgModule({
  declarations: [
    QuizSelectionComponent,
    SandrinComponent,
    QuizPreviewComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    HeaderComponent
  ]
})
export class HomeModule { }

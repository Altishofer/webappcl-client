import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "@shared/shared.module";
import { HostRoutingModule } from "@modules/host/host-routing.module";

import { QuizSelectionComponent } from '@modules/host/pages/quiz-selection/quiz-selection.component';
import { SandrinComponent } from './pages/sandrin/sandrin.component';
import { HeaderComponent } from "@layout/header/header.component";
import { QuizPreviewComponent } from './pages/quiz-preview/quiz-preview.component';
import { LoginComponent } from "@modules/host/pages/login/login.component";

@NgModule({
  declarations: [
    QuizSelectionComponent,
    SandrinComponent,
    QuizPreviewComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    HostRoutingModule,
    HeaderComponent
  ]
})
export class HostModule { }

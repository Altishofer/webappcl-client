import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "@shared/shared.module";
import { HostRoutingModule } from "@modules/host/host-routing.module";

import { QuizSelectionComponent } from '@modules/host/pages/quiz-selection/quiz-selection.component';
import { HeaderComponent } from "@layout/header/header.component";
import { QuizPreviewComponent } from './pages/quiz-preview/quiz-preview.component';
import { LoginComponent } from "@modules/host/pages/login/login.component";
import { LobbyComponent } from './pages/lobby/lobby.component';
import { RoundMainComponent } from './pages/round-main/round-main.component';
import { ResultsComponent } from './pages/results/results.component';
import { CdkAccordionModule } from "@angular/cdk/accordion";
import { WelcomePortalComponent } from './pages/welcome-portal/welcome-portal.component';
import {NgxQrcodeStylingModule} from "ngx-qrcode-styling";

@NgModule({
  declarations: [
    QuizSelectionComponent,
    QuizPreviewComponent,
    LoginComponent,
    LobbyComponent,
    RoundMainComponent,
    ResultsComponent,
    WelcomePortalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    HostRoutingModule,
    HeaderComponent,
    CdkAccordionModule,
    NgxQrcodeStylingModule,
  ]
})
export class HostModule { }

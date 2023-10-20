import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { SharedModule } from "@shared/shared.module";
import { LoginComponent } from './pages/login/login.component';
import { FlexModule } from "@angular/flex-layout";


@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    LoginRoutingModule,
    FlexModule
  ]
})
export class LoginModule { }

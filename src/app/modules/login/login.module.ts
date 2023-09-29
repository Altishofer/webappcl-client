import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { SharedModule } from "@shared/shared.module";
import { LoginComponent } from './pages/login/login.component';
import { FlexModule } from "@angular/flex-layout";
import { RegisterComponent } from "@modules/login/pages/register/register.component";


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    LoginRoutingModule,
    FlexModule
  ]
})
export class LoginModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import {SharedModule} from "app/shared/shared.module";
import { LoginComponent } from './pages/login/login.component';
import {AngularMaterialModule} from "@app/angular-material.module";
import {FlexModule} from "@angular/flex-layout";


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    AngularMaterialModule,
    FlexModule
  ]
})
export class LoginModule { }

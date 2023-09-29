import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterRoutingModule } from './register-routing.module';
import {SharedModule} from "app/shared/shared.module";
import {RegisterComponent} from "./pages/register/register.component";
import {FlexModule} from "@angular/flex-layout";
import {AngularMaterialModule} from "@app/angular-material.module";


@NgModule({
  declarations: [
    RegisterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RegisterRoutingModule,
    AngularMaterialModule,
    FlexModule
  ]
})
export class RegisterModule { }

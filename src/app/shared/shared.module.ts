import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AngularMaterialModule } from "@app/angular-material.module";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { FlexLayoutModule } from "@angular/flex-layout";
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    AngularMaterialModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    AngularMaterialModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule
  ]
})
export class SharedModule { }

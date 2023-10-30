import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from '@core/core.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { MainpageComponent } from '@layout/mainpage/mainpage.component';
import { HeaderComponent } from '@layout/header/header.component';
import { FooterComponent } from '@layout/footer/footer.component';

import { SharedModule } from '@shared/shared.module';
import { LocationStrategy, PathLocationStrategy} from "@angular/common";
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    MainpageComponent,
    FooterComponent
  ],
  imports: [
    MatSlideToggleModule,
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    HeaderComponent,
    FormsModule
  ],
  providers: [{
    provide: LocationStrategy,
    useClass: PathLocationStrategy
  }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {HomeModule} from "@modules/home/home.module";
import {MainpageComponent} from "@layout/mainpage/mainpage.component";
import {LoginModule} from "@modules/login/login.module";
import {AboutModule} from "@modules/about/about.module";
import {RegisterModule} from "@modules/register/register.module";

const routes: Routes = [
  {
    path: '',
    component: MainpageComponent,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./modules/home/home.module').then((m):typeof HomeModule => m.HomeModule)
      },
      {
        path: 'about',
        loadChildren: () => import('./modules/about/about.module').then((m):typeof AboutModule => m.AboutModule)
      },
      {
        path: 'contact',
        loadChildren: () => import('@modules/login/login.module').then((m):typeof LoginModule => m.LoginModule)
      }
    ]
  },
  { path: 'login', loadChildren: () => import('@modules/login/login.module').then((m):typeof LoginModule => m.LoginModule)},
  { path: 'register', loadChildren: () => import('@modules/register/register.module').then((m):typeof RegisterModule => m.RegisterModule)}
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

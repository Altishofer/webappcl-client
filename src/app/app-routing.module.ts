import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {HomeModule} from "@modules/home/home.module";
import {LoginModule} from "@modules/login/login.module";
import {AboutModule} from "@modules/about/about.module";
import {PlayerModule} from "@modules/player/player.module";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('@modules/login/login.module').then((m):typeof LoginModule => m.LoginModule)
  },
  {
    path: 'home',
    loadChildren: () => import('@modules/home/home.module').then((m):typeof HomeModule => m.HomeModule)
  },
  {
    path: 'player',
    loadChildren: () => import('@modules/player/player.module').then((m):typeof  PlayerModule => m.PlayerModule)
  },
  {
    path: 'about',
    loadChildren: () => import('@modules/about/about.module').then((m):typeof AboutModule => m.AboutModule)
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

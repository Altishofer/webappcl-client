import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {HostModule} from "@modules/host/host.module";
import {PlayerModule} from "@modules/player/player.module";
import {JoinComponent} from "@layout/join/join.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'host',
    pathMatch: 'prefix'
  },
  {
    path: 'join',
    component: JoinComponent
  },
  {
    path: 'host',
    loadChildren: () => import('@modules/host/host.module').then((m):typeof HostModule => m.HostModule)
  },
  {
    path: 'player',
    loadChildren: () => import('@modules/player/player.module').then((m):typeof  PlayerModule => m.PlayerModule)
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

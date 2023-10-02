import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {SandrinComponent} from "./pages/sandrin/sandrin.component";

const routes: Routes = [
  {
    path:'', component:HomeComponent, pathMatch:"full"
  },
  {
    path:'sandrin', component:SandrinComponent, pathMatch:"full"
  }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }

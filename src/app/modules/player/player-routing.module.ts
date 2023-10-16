import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WordCalcComponent } from "./pages/word-calc/word-calc.component";

const routes: Routes = [
  {
    path:'', redirectTo:'calc', pathMatch:'full'
  },
  {
    path:'calc', component:WordCalcComponent
  }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlayerRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResetPasswordPage } from './recuperarpass.page';  

const routes: Routes = [
  {
    path: '',
    component: ResetPasswordPage  // 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecuperarpassPageRoutingModule {}

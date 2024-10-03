import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '../candeactivate.guard';
import { LobbyPage } from './lobby.page';

const routes: Routes = [
  {
    path: '',
    component: LobbyPage,
    canDeactivate: [CanDeactivateGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LobbyPageRoutingModule {}

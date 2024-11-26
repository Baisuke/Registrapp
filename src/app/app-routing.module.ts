import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from './auth/role.guard';

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then((m) => m.AdminPageModule),
    canActivate: [RoleGuard],
    data: { role: 'profesor' },
  },
  {
    path: 'lobby',
    loadChildren: () => import('./lobby/lobby.module').then((m) => m.LobbyPageModule),
    canActivate: [RoleGuard],
    data: { role: 'usuario' },
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomePageModule),
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

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
  {
    path: 'recuperarpass',
    loadChildren: () => import('./recuperarpass/recuperarpass.module').then((m) => m.RecuperarpassPageModule),
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // Ruta para la página de error 404
  {
    path: 'not-found',
    loadChildren: () => import('./not-found/not-found.module').then( m => m.NotFoundPageModule)
  },

  // Ruta wildcard para manejar cualquier otra ruta no definida
  { path: '**', redirectTo: '/not-found' }, // Redirige a la página 404 si la ruta no existe
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { canActivate } from './canactivate.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',  // Redirige a la página de inicio
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
  },
  {
    path: 'recuperarpass',
    loadChildren: () =>
      import('./recuperarpass/recuperarpass.module').then(
        (m) => m.RecuperarpassPageModule
      ),
  },
  {
    path: 'lobby',
    loadChildren: () =>
      import('./lobby/lobby.module').then((m) => m.LobbyPageModule),
    canActivate: [canActivate], // Protege esta ruta
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminPageModule),
    canActivate: [canActivate], // Protege esta ruta
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

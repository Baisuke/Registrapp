import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { canActivate } from './canactivate.guard';
import { CanmatchGuard } from './canmatch.guard';
import { CanDeactivateGuard } from './candeactivate.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',  // Redirige a la página de inicio
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'recuperarpass',
    loadChildren: () => import('./recuperarpass/recuperarpass.module').then(m => m.RecuperarpassPageModule)
  },
  {
    path: 'lobby',
    loadChildren: () => import('./lobby/lobby.module').then(m => m.LobbyPageModule),
   canActivate: [canActivate],
   canMatch: [CanmatchGuard],
   canDeactivate: [CanDeactivateGuard]
  },  {
    path: 'qr',
    loadChildren: () => import('./qr/qr.module').then( m => m.QrPageModule)
  },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

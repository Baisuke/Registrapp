import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class canActivate implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      const role = this.authService.getUserRole(); // Asume que tienes un método para obtener el rol del usuario

      if (role === 'profesor') {
        this.router.navigate(['/admin']); // Redirige a la página de administrador
        return false; // Bloquea la ruta actual
      } else if (role === 'usuario') {
        this.router.navigate(['/lobby']); // Redirige a la página de usuario
        return false; // Bloquea la ruta actual
      }

      return true; // Permite el acceso si no hay redirección
    } else {
      this.router.navigate(['/login']); // Redirige al login si no está autenticado
      return false;
    }
  }
}

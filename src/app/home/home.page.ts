import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  usuario: string = '';  // Variable para almacenar el nombre de usuario
  password: string = ''; // Variable para almacenar la contraseña

  constructor(private router: Router) {}

  onLogin() {
    // Validar si el nombre de usuario y la contraseña están completos
    if (this.usuario && this.password) {
      // Redirigir a la página de bienvenida (lobby) y pasar el nombre de usuario
      this.router.navigate(['/lobby'], {
        state: { nombre_usuario: this.usuario }
      });
    } else {
      console.log('Por favor, ingresa tu nombre de usuario y contraseña.');
    }
  }
}

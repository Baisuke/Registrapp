import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.page.html',
  styleUrls: ['./lobby.page.scss'],
})
export class LobbyPage {
  nombre_usuario: string = '';  // Variable para almacenar el nombre de usuario

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { nombre_usuario: string };

    // Asignar el nombre de usuario pasado desde la página anterior
    if (state && state.nombre_usuario) {
      this.nombre_usuario = state.nombre_usuario;
    }
  }
}

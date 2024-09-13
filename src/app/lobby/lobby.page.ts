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
    const state = navigation?.extras.state as { nombre_usuario: string };}

    ngOnInit() {
      // Obtener el nombre del usuario pasado desde la página anterior
      const navigation = this.router.getCurrentNavigation();
      if (navigation?.extras?.state) {
        this.nombre_usuario = navigation.extras.state['nombre_usuario'] || 'usuario';
      }
    }
    
    cerrarSesion(){
      // Aquí puedes agregar la lógica de limpieza de datos de sesión, si es necesario
      // Redirigir al usuario a la página de inicio
      this.router.navigate(['/home']);
    }


}

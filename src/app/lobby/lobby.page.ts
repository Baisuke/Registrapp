import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CanComponentDeactivate } from '../candeactivate.guard';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.page.html',
  styleUrls: ['./lobby.page.scss'],
})
export class LobbyPage implements CanComponentDeactivate {
  nombre_usuario: string = '';  
  audio: any;
  song: Array<{ title: string; path: string }> = [
    { title: 'Cancion 1', path: 'assets/audio/a.mp3' },
  ];
  cancionActual: number = 0;  

  constructor(private router: Router, private alertController: AlertController, private authService: AuthService) {}

  cargarCancion(index: number) {
    if (this.audio) {
      this.audio.pause(); 
    }
    this.audio = new Audio(this.song[index].path); 
    this.audio.play(); 
  }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.nombre_usuario = navigation.extras.state['nombre_usuario'] || 'usuario';
    }

    this.cargarCancion(this.cancionActual);
  }

  canDeactivate(): boolean {
    return confirm('¿Estás seguro que deseas cerrar sesión?');
  }

  logout() {
    if (this.canDeactivate()) {
      this.authService.logout(); // Cerrar sesión
      console.log("Sesión cerrada");
      this.router.navigate(['/home']);
    }
  }

  async presentAlert(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}

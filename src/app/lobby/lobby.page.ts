import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.page.html',
  styleUrls: ['./lobby.page.scss'],
})
export class LobbyPage {
  nombre_usuario: string = '';  
  audio: any;
  song: Array<{ title: string; path: string }> = [
    { title: 'Cancion 1', path: 'assets/audio/a.mp3' },
  ];
  cancionActual: number = 0;  

  constructor(private router: Router, private alertController: AlertController) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { nombre_usuario: string };
  }

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

  cerrarSesion() {
    this.router.navigate(['/home']);
    this.audio.pause(); 
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

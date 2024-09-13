import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  usuario: string = '';  //NOMBRE
  password: string = ''; // CONTRASEGNA

  constructor(
    private router: Router,
    private alertController: AlertController
  ) {}

 //INICIO SESION
  onLogin() {
    //VALIDA LOS DATOS
    if (this.usuario && this.password) {
      //IR A PAGINA LOBBY
      this.router.navigate(['/lobby'], {
        state: { nombre_usuario: this.usuario }
      });
    } else {
      //FALTAN DATOS
      this.presentAlert('Error', 'Datos incompletos', 'Por favor, ingresa tu nombre de usuario y contraseña.');
    }
  }

  //MOSTRAR ALERTA
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

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-recuperarpass',
  templateUrl: './recuperarpass.page.html',
  styleUrls: ['./recuperarpass.page.scss'],
})
export class ResetPasswordPage {
  usuario: string = '';  //NOMBRE
  constructor(
    private router: Router,
    private alertController: AlertController
  ) {}

 //INICIO SESION
  resetPass() {
    //VALIDA LOS DATOS
    if (this.usuario) {
      //IR A PAGINA LOBBY
      this.presentAlert(
        'Contraseña recuperada exitosamente','',`Se enviaron los datos al correo del usuario: ${this.usuario || 'usuario'}`);
      this.router.navigate(['/home'], {
        state: { nombre_usuario: this.usuario }
      });
    } else {
      //FALTAN DATOS
      this.presentAlert('Error', 'Datos incompletos', 'Por favor, ingresa tu nombre de usuario.');
    }
  }
  back(){
    this.router.navigate(['/home']);
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


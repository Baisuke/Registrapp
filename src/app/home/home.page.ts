import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  usuario: string = '';  //NOMBRE
  password: string = ''; // CONTRASEGNA

  constructor(
    private alertController: AlertController,
    private authService: AuthService, private router: Router
  ) {}

 //INICIO SESION
  onLogin() {
    //VALIDA LOS DATOS
    if (this.usuario && this.password) {
        if (this.authService.login(this.usuario, this.password)) {
        //aprovechamos de usar state para llevar la informacion al dashboard.
        this.router.navigate(['/lobby'], { state: { username: this.usuario } });
        } else {
        alert('Nombre de usuario o contraseña incorrectos');
        };
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

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  usuario: string = '';  //NOMBRE
  password: string = ''; // CONTRASEGNA
  nombre: string | null = null;
  nombreAlmacenado: string | null = null;

  constructor(
    private alertController: AlertController,
    private authService: AuthService, private router: Router,
    private storage: Storage
  ) {
    this.initStorage()
  }
  async initStorage() {
    await this.storage.create(); // Inicializamos el storage antes de usarlo
    }

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
  guardarNombre() {
    this.storage.set('nombre', this.nombre);
    console.log('Nombre guardado:', this.nombre);
  }
  async eliminarNombre() {
      await this.storage.remove('nombre');
      this.nombreAlmacenado = null;
      console.log('Nombre eliminado');
  }
  async limpiarStorage() {
    await this.storage.clear();
    this.nombreAlmacenado = null;
    console.log('Almacenamiento limpiado');
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

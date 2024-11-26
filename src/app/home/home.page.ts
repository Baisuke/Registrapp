import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { Storage } from '@ionic/storage-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  loginForm: FormGroup;
  nombreAlmacenado: string | null = null;

  constructor(
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router,
    private storage: Storage,
    private fb: FormBuilder
  ) {
    this.initStorage();
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  async initStorage() {
    await this.storage.create(); // Inicializamos el almacenamiento
    this.nombreAlmacenado = await this.storage.get('nombre') || null;
  }

  async guardarNombre(username: string) {
    await this.storage.set('nombre', username);
    this.nombreAlmacenado = username;
    console.log('Nombre guardado:', username);
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

  async onLogin() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      const isValidLogin = this.authService.login(username, password);

      if (isValidLogin) {
        await this.guardarNombre(username); // Guarda el nombre del usuario

        const role = this.authService.getUserRole();
        if (role === 'profesor') {
          this.router.navigate(['/admin'], { state: { username } });
        } else if (role === 'usuario') {
          this.router.navigate(['/lobby'], { state: { username } });
        }
      } else {
        this.presentAlert('Error', 'Acceso Denegado', 'Usuario o contraseña incorrectos.');
      }
    } else {
      this.presentAlert('Error', 'Datos incompletos', 'Por favor, completa todos los campos.');
    }
  }

  async presentAlert(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}

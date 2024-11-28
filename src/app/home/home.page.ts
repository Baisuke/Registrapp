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
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  async initStorage() {
    await this.storage.create();
    this.nombreAlmacenado = await this.storage.get('nombre');
    if (this.nombreAlmacenado) {
      this.router.navigate(['/lobby'], { state: { nombre_usuario: this.nombreAlmacenado } });
    }
  }

  async guardarNombre(nombre_usuario: string) {
    await this.storage.set('nombre', nombre_usuario);
    this.nombreAlmacenado = nombre_usuario;
    console.log('Nombre guardado:', nombre_usuario);
  }

  async onLogin() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value; // Aquí, username es el RUT.
      const isValidLogin = this.authService.login(username, password);
  
      if (isValidLogin) {
        const userName = this.authService.getUserName(); // Obtén el nombre del usuario.
        const role = this.authService.getUserRole();
  
        if (role === 'profesor') {
          this.router.navigate(['/admin'], { state: { nombre_usuario: userName } });
        } else if (role === 'usuario') {
          this.router.navigate(['/lobby'], { state: { nombre_usuario: userName } });
        }
      } else {
        this.presentAlert('Error', 'Acceso Denegado', 'RUT o contraseña incorrectos.');
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

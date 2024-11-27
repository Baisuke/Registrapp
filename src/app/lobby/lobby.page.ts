import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CanComponentDeactivate } from '../candeactivate.guard';
import { AuthService } from '../auth.service';
import { Storage } from '@ionic/storage-angular';
import { ApiService } from '../services/api.service';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Share } from '@capacitor/share';
import { UserDataService } from '../user-data.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.page.html',
  styleUrls: ['./lobby.page.scss'],
})
export class LobbyPage implements CanComponentDeactivate, OnInit {
  // **Propiedades**
  nombre_usuario: string = '';
  nombreAlmacenado: string | null = null;
  audio: any;
  cancionActual: number = 0;
  posts: any[] = [];
  song: Array<{ title: string; path: string }> = [
    { title: 'Canción 1', path: 'assets/audio/a.mp3' },
  ];

  constructor(
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService,
    private storage: Storage,
    private apiService: ApiService,
    private userDataService: UserDataService
  ) {
    this.initStorage();
  }
  async CheckPermission() {
    try
    {
      const status = await BarcodeScanner.checkPermission({force:true}); 
      if(status.granted) {
        return true;
      }

      return false;

    }
    catch(e)
    {
      return undefined;
    }
  }
  // **Métodos de ciclo de vida**
  async ngOnInit() {
    this.nombre_usuario = this.router.getCurrentNavigation()?.extras?.state?.['nombre_usuario'] || 'usuario';
    this.cargarCancion(this.cancionActual);
    await this.obtenerNombre();
  }

  // **Inicialización de Storage**
  private async initStorage() {
    await this.storage.create();
  }

  private async obtenerNombre() {
    this.nombreAlmacenado = await this.storage.get('nombre');
    console.log('Nombre almacenado:', this.nombreAlmacenado);
  }

  async scanQRCode() {
    try {
      const hasPermission = await this.CheckPermission();
      if (!hasPermission) {
        this.presentAlert('Error', 'Permiso denegado', 'No se ha concedido permiso para escanear QR.');
        return;
      }
  
      await BarcodeScanner.prepare();
      const result = await BarcodeScanner.startScan();
  
      if (result.hasContent) {
        const scannedData = JSON.parse(result.content); // Decodificar JSON del QR
        const { sessionId, subject, section } = scannedData;
  
        if (!sessionId || !subject || !section) {
          this.presentAlert('Error', 'Datos incompletos', 'El QR escaneado no contiene todos los datos necesarios.');
          return;
        }
  
        if (!this.nombreAlmacenado) {
          this.presentAlert('Error', 'Nombre no encontrado', 'No se ha encontrado tu nombre almacenado. Por favor, verifica tu sesión.');
          return;
        }
  
        const userData = {
          studentId: this.nombreAlmacenado,
          sessionId,
          subject,
          section,
          attendanceStatus: 'presente',
          date: new Date().toISOString(),
        };
  
        this.sendData(userData);
      }
    } catch (err) {
      console.error('Error al escanear el QR:', err);
      this.presentAlert('Error', 'Error en el escaneo', 'Hubo un problema al escanear el código QR.');
    }
  }
  

  sendData(userData: any) {
    this.userDataService.sendUserData(userData).subscribe(
      (response) => {
        console.log('Datos enviados correctamente', response);
        // Puedes mostrar un mensaje de éxito aquí si lo deseas
      },
      (error) => {
        console.error('Error al enviar los datos', error);
        // Aquí puedes manejar el error, por ejemplo, mostrar una alerta
      }
    );
  }

  async shareContent(content: string) {
    await Share.share({
      title: 'Código QR Escaneado',
      text: content,
      dialogTitle: 'Compartir contenido',
    });
  }

  // **Manejo de Canción**
  cargarCancion(index: number) {
    if (this.audio) this.audio.pause();
    this.audio = new Audio(this.song[index].path);
  }

  // **Cerrar sesión**
  canDeactivate(): boolean {
    return confirm('¿Estás seguro de que deseas cerrar sesión?');
  }

  logout() {
    if (this.canDeactivate()) {
      this.authService.logout();
      this.audio?.pause();
      this.router.navigate(['/home']);
    }
  }

  // **Alertas generales**
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

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
    try {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        return true;
      } else if (status.denied) {
        // Abrir configuración si el permiso es denegado
        await BarcodeScanner.openAppSettings();
      }
      return false;
    } catch (error) {
      console.error('Error al verificar permisos de cámara:', error);
      return false;
    }
  }
  
  // **Métodos de ciclo de vida**
  async ngOnInit() {
    this.nombre_usuario = this.router.getCurrentNavigation()?.extras?.state?.['nombre_usuario'] 
                          || localStorage.getItem('userName') 
                          || 'Usuario';
    console.log('Nombre mostrado en LobbyPage:', this.nombre_usuario);
  }
  
  
  private async initStorage() {
    await this.storage.create();
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
        const scannedData = JSON.parse(result.content);
        const { sessionId, subject, section } = scannedData;
  
        if (!sessionId || !subject || !section) {
          this.presentAlert('Error', 'Datos incompletos', 'El QR escaneado no contiene todos los datos necesarios.');
          return;
        }
  
        if (!this.nombreAlmacenado) {
          this.presentAlert('Error', 'Nombre no encontrado', 'No se ha encontrado tu nombre almacenado.');
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
    } catch (error) {
      console.error('Error al escanear el QR:', error);
      this.presentAlert('Error', 'Error en el escaneo', 'Hubo un problema al escanear el código QR.');
    } finally {
      await BarcodeScanner.stopScan(); // Detener la cámara
    }
  }
  

  sendData(userData: any) {
    // Agregar la sección y formatear la fecha
    userData.section = userData.section || ''; // Asegúrate de que la sección esté presente
    userData.date = new Date(userData.date).toISOString().split('T')[0]; // Formatear la fecha
  
    this.userDataService.sendUserData(userData).subscribe(
      async (response) => {
        console.log('Datos enviados correctamente:', response);
        await this.presentAlert('Éxito', '', 'La asistencia se ha registrado correctamente.');
      },
      async (error) => {
        console.error('Error al enviar los datos:', error);
        await this.presentAlert(
          'Error',
          'Error al registrar asistencia',
          'No se pudo registrar la asistencia. Por favor, intenta de nuevo.'
        );
      }
    );
  }
  
  

  async shareContent(content: string) {
    try {
      await Share.share({
        title: 'Código QR Escaneado',
        text: content,
        dialogTitle: 'Compartir contenido',
      });
    } catch (error) {
      console.error('Error al compartir contenido:', error);
      this.presentAlert('Error', '', 'No se pudo compartir el contenido.');
    }
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

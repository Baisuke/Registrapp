import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CanComponentDeactivate } from '../candeactivate.guard';
import { AuthService } from '../auth.service';
import { ApiService } from '../services/api.service';
import { Storage } from '@ionic/storage-angular';
import * as QRCode from 'qrcode';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements CanComponentDeactivate, OnInit {
  nombre_usuario: string = '';
  date: string = '';
  section: string = '';
  attendanceRecords: any[] = [];
  nombreAlmacenado: string | null = null;
  errorMessage: string = '';
  qrCodeUrl: string = '';
  userData: any;
  qrCodes: Array<{ section: string; url: string }> = [];
  sections = [
    { id: 'A', name: '002D', subject: 'Programación de aplicaciones móviles' },
    { id: 'B', name: '004D', subject: 'Programación de aplicaciones móviles' },
    { id: 'C', name: '006D', subject: 'Programación de aplicaciones móviles' },
    { id: 'D', name: '008D', subject: 'Programación de aplicaciones móviles' },
  ];
  selectedQRCode: string | null = null;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService,
    private apiService: ApiService,
    private storage: Storage,
    private http: HttpClient
  ) {}

  async generateQRCode(section: any) {
    const data = {
      section: section.name,
      subject: section.subject,
      sessionId: new Date().toISOString(), 
    };

    try {
      const qrCodeUrl = await QRCode.toDataURL(JSON.stringify(data));


      if (!this.qrCodes.some(qr => qr.section === section.name)) {
        this.qrCodes.push({ section: section.name, url: qrCodeUrl });
      }

      this.selectedQRCode = qrCodeUrl; 
    } catch (err) {
      console.error('Error al generar el código QR:', err);
    }
  }

  generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15); 
  }

  async ngOnInit() {
    this.nombre_usuario = this.router.getCurrentNavigation()?.extras?.state?.['nombre_usuario'] 
                          || localStorage.getItem('userName') 
                          || 'Usuario';
    console.log('Nombre mostrado en LobbyPage:', this.nombre_usuario);
  }



  async obtenerNombre() {
    this.nombreAlmacenado = await this.storage.get('nombre');
    console.log('Nombre almacenado:', this.nombreAlmacenado);
  }

  canDeactivate(): boolean {
    return confirm('¿Estás seguro que deseas cerrar sesión?');
  }

  logout() {
    if (this.canDeactivate()) {
      this.authService.logout();
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

  // Método que falta y que se debe agregar
  startClass() {
    // Aquí puedes agregar la lógica que desees cuando se haga clic en "Iniciar Clase"
    console.log('Clase iniciada');
    // Por ejemplo, puedes redirigir a otra página, o realizar alguna acción relacionada
    this.router.navigate(['/class']);
  }

  resetToGif() {
    this.selectedQRCode = null;
  }

  consultAttendance() {
    if (!this.date || !this.section) {
      alert('Debe proporcionar una fecha y sección válidas.');
      return;
    }
  
    this.apiService.getAttendance(this.date, this.section).subscribe(
      (data) => {
        this.attendanceRecords = data;
        console.log('Asistencia:', data);
      },
      (error) => {
        console.error('Error al consultar la asistencia:', error);
        alert('Hubo un error al consultar los datos.');
      }
    );

  
  
  }
}

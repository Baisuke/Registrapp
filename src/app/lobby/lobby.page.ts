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

  // **Métodos de ciclo de vida**
  async ngOnInit() {
    this.nombre_usuario = this.router.getCurrentNavigation()?.extras?.state?.['nombre_usuario'] || 'usuario';
    this.cargarCancion(this.cancionActual);
    this.loadPosts();
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

  // **Manejo de QR**
  async scanQRCode() {
    try {
      await BarcodeScanner.prepare();

      const result = await BarcodeScanner.startScan();
      if (result.hasContent) {
        const scannedData = JSON.parse(result.content); // Decodificar JSON del QR
        const userData = {
          user: 'Alumno123',
          date: new Date().toISOString(),
          subject: scannedData.subject,
          section: scannedData.section,
          sessionId: scannedData.sessionId,
        };

        this.sendUserData(userData);
      }
    } catch (err) {
      console.error('Error al escanear el QR:', err);
    }
  }

  private sendUserData(userData: any) {
    this.userDataService.sendUserData(userData).subscribe(
      (response) => console.log('Datos enviados correctamente', response),
      (error) => console.error('Error al enviar los datos', error)
    );
  }

  async shareContent(content: string) {
    await Share.share({
      title: 'Código QR Escaneado',
      text: content,
      dialogTitle: 'Compartir contenido',
    });
  }

  // **Manejo de Posts**
  private loadPosts() {
    this.apiService.getPosts().subscribe((data: any[]) => {
      this.posts = data;
    });
  }

  async addPost() {
    const alert = await this.alertController.create({
      header: 'Añadir Post',
      inputs: [
        { name: 'title', type: 'text', placeholder: 'Título del Post' },
        { name: 'body', type: 'textarea', placeholder: 'Contenido del Post' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            this.apiService.addPost(data).subscribe((newNota) => {
              this.posts.push(newNota);
            });
          },
        },
      ],
    });
    await alert.present();
  }

  async editPost(post: any) {
    const alert = await this.alertController.create({
      header: 'Editar Post',
      inputs: [
        { name: 'title', type: 'text', value: post.title },
        { name: 'body', type: 'textarea', value: post.body },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            const updatedPost = { ...post, ...data };
            this.apiService.updatePost(updatedPost.id, updatedPost).subscribe(() => {
              const index = this.posts.findIndex((p) => p.id === updatedPost.id);
              if (index > -1) this.posts[index] = updatedPost;
            });
          },
        },
      ],
    });
    await alert.present();
  }

  async confirmDelete(id: number) {
    const alert = await this.alertController.create({
      header: 'Eliminar Post',
      message: '¿Estás seguro de que deseas eliminar este post?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: () => this.deletePost(id),
        },
      ],
    });
    await alert.present();
  }

  private deletePost(id: number) {
    this.apiService.deletePost(id).subscribe(() => {
      this.posts = this.posts.filter((post) => post.id !== id);
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

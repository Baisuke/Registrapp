import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CanComponentDeactivate } from '../candeactivate.guard';
import { AuthService } from '../auth.service';
import { ApiService } from '../services/api.service';
import { Storage } from '@ionic/storage-angular';
import * as QRCode from 'qrcode';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements CanComponentDeactivate, OnInit {
  nombre_usuario: string = '';
  nombreAlmacenado: string | null = null;
  posts: any[] = [];
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
      sessionId: new Date().toISOString(), // Identificador único
    };

    try {
      const qrCodeUrl = await QRCode.toDataURL(JSON.stringify(data));
      this.qrCodes = [
        ...this.qrCodes.filter(qr => qr.section !== section.name), // Evita duplicados
        { section: section.name, url: qrCodeUrl },
      ];

      this.selectedQRCode = qrCodeUrl; // Actualiza la imagen del QR
    } catch (err) {
      console.error('Error al generar el código QR:', err);
    }
  }


  generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15); 
  }
  async ngOnInit() {
    await this.storage.create();
    this.obtenerNombre();

    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.nombre_usuario = navigation.extras.state['nombre_usuario'] || 'profesor';
    } else {
      this.nombre_usuario = this.nombreAlmacenado || 'profesor';
    }
    this.loadUserData();
    this.loadPosts();
  }
  loadUserData() {
    this.apiService.getUserData().subscribe(
      (data) => {
        this.userData = data;
        console.log('Datos recibidos:', this.userData);
      },
      (error) => {
        console.error('Error al obtener los datos', error);
      }
    );
  }
  async obtenerNombre() {
    this.nombreAlmacenado = await this.storage.get('nombre');
    console.log('Nombre almacenado:', this.nombreAlmacenado);
  }

  loadPosts() {
    this.apiService.getPosts().subscribe((data: any[]) => {
      this.posts = data;
    });
  }

  async addPosts() {
    const alert = await this.alertController.create({
      header: 'Añadir Post',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Título del Post',
        },
        {
          name: 'body',
          type: 'textarea',
          placeholder: 'Contenido del Post',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Guardar',
          handler: (data) => {
            this.apiService.addPost(data).subscribe((newPost) => {
              this.posts.push(newPost);
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
        {
          name: 'title',
          type: 'text',
          value: post.title,
          placeholder: 'Título del Post',
        },
        {
          name: 'body',
          type: 'textarea',
          value: post.body,
          placeholder: 'Contenido del Post',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Guardar',
          handler: (data) => {
            const updatedPost = { ...post, ...data };
            this.apiService.updatePost(updatedPost.id, updatedPost).subscribe(() => {
              const index = this.posts.findIndex((p) => p.id === updatedPost.id);
              if (index > -1) {
                this.posts[index] = updatedPost;
              }
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
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.deletePosts(id);
          },
        },
      ],
    });

    await alert.present();
  }

  deletePosts(id: number) {
    this.apiService.deletePost(id).subscribe(() => {
      this.posts = this.posts.filter((post) => post.id !== id);
    });
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
}

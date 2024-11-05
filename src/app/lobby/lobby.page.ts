import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { CanComponentDeactivate } from '../candeactivate.guard';
import { AuthService } from '../auth.service';
import { Storage } from '@ionic/storage-angular';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.page.html',
  styleUrls: ['./lobby.page.scss'],
})
export class LobbyPage implements CanComponentDeactivate, OnInit {
  nombre_usuario: string = '';
  audio: any;
  song: Array<{ title: string; path: string }> = [
    { title: 'Cancion 1', path: 'assets/audio/a.mp3' },
  ];
  cancionActual: number = 0;
  nombreAlmacenado: string | null = null;
  posts: any[] = [];

  constructor(
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService,
    private storage: Storage,
    private apiService: ApiService,
    private navCtrl: NavController
  ) {
    this.initStorage();
  }

  async initStorage() {
    await this.storage.create();
    await this.obtenerNombre();
  }

  cargarCancion(index: number) {
    if (this.audio) {
      this.audio.pause();
    }
    this.audio = new Audio(this.song[index].path);
    this.audio.play();
  }

  async obtenerNombre() {
    this.nombreAlmacenado = await this.storage.get('nombre');
    console.log('Nombre almacenado:', this.nombreAlmacenado);
  }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.nombre_usuario = navigation.extras.state['nombre_usuario'] || 'usuario';
    }

    this.cargarCancion(this.cancionActual);

    this.apiService.getPosts().subscribe((data: any) => {
      this.posts = data;
    });
  }

  createPost() {
    // Here, you can prompt the user for the title and content of the new post
    this.alertController.create({
      header: 'Nuevo Post',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Título'
        },
        {
          name: 'body',
          type: 'text',
          placeholder: 'Contenido'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Post cancelado');
          }
        },
        {
          text: 'Agregar',
          handler: (data) => {
            const newPost = {
              title: data.title,
              body: data.body
            };
            this.apiService.createPost(newPost).subscribe(() => {
              this.posts.push(newPost); // Add new post to local array
              console.log('Post creado:', newPost);
            });
          }
        }
      ]
    }).then(alert => alert.present());
  }

  editPost(id: number) {
    console.log('Editando el post con ID:', id);
    this.navCtrl.navigateForward('/edit', {
      state: {
        postId: id,
      },
    });
  }

  canDeactivate(): boolean {
    return confirm('¿Estás seguro que deseas cerrar sesión?');
  }

  logout() {
    if (this.canDeactivate()) {
      this.authService.logout();
      console.log("Sesión cerrada");
      this.audio.pause();
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

  deletePost(id: number) {
    this.apiService.deletePost(id).subscribe(() => {
      this.posts = this.posts.filter(post => post.id !== id);
      console.log("Post Eliminado:", id);
    });
  }
}

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

    this.loadPosts();
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
            console.log('Post actualizado:', updatedPost);  // Verifica que la actualización esté correcta
            
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
      this.posts = this.posts.filter((posts) => posts.id !== id);
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

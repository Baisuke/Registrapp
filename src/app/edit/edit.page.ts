import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  postId: number | null = null;
  title: string = '';
  body: string = '';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    const nav = this.router.getCurrentNavigation();

    if (nav?.extras.state) {
      this.postId = nav.extras.state['postId'];

      if (this.postId !== null) {
        console.log('Post ID:', this.postId);

        // Obtener el contenido del post a editar
        this.apiService.getPost(this.postId).subscribe((post: any) => {
          this.title = post.title;
          this.body = post.body;
        });
      }
    } else {
      // Navegar a home si no existe postId
      this.navCtrl.navigateBack('/lobby');
    }
  }

  updatePost() {
    if (this.postId !== null) {
      const updatedPost: any = {
        id: this.postId,
        title: this.title,
        body: this.body
      };

      // Actualizar el post en la API
      this.apiService.updatePost(this.postId, updatedPost).subscribe(response => {
        console.log('Post actualizado:', response);
        this.navCtrl.navigateBack('/lobby');
      });
    }
  }
}

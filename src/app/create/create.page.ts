import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage {
  title: string = '';
  body: string = '';

  constructor(private apiService: ApiService, private navCtrl: NavController) {}

  createPost() {
    const newPost = {
      title: this.title,
      body: this.body,
    };

    this.apiService.createPost(newPost).subscribe(response => {
      console.log('Post creado:', response);
      this.navCtrl.navigateBack('/lobby');
    });
  }
}

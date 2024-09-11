import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperarpass',
  templateUrl: './recuperarpass.page.html',
  styleUrls: ['./recuperarpass.page.scss'],
})
export class ResetPasswordPage {
  constructor(private router: Router) {}

  recuperarPassword() {
   
    this.router.navigate(['/home']);
  }
}
